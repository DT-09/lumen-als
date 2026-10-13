"""Core learning engine for LUMEN ALS. Deterministic, inspectable, source-aware baseline."""
from __future__ import annotations
import re, math, json, sqlite3, hashlib, os
from contextvars import ContextVar, Token
from pathlib import Path
from typing import Iterable

DB_PATH = os.environ.get('LUMEN_DB', str(Path(__file__).with_name('lumen.sqlite3')))
_REQUEST_DB_PATH: ContextVar[str | None] = ContextVar('lumen_request_db_path', default=None)

def set_request_db_path(path: str) -> Token:
    """Set an isolated database path for the current request context."""
    return _REQUEST_DB_PATH.set(path)

def reset_request_db_path(token: Token) -> None:
    _REQUEST_DB_PATH.reset(token)

SCHEMA = '''
CREATE TABLE IF NOT EXISTS chunks (
 id INTEGER PRIMARY KEY AUTOINCREMENT, source TEXT NOT NULL, locator TEXT NOT NULL,
 kind TEXT NOT NULL, text TEXT NOT NULL, topic TEXT NOT NULL, concepts TEXT NOT NULL DEFAULT '[]', prerequisites TEXT NOT NULL DEFAULT '[]', digest TEXT UNIQUE
);
CREATE TABLE IF NOT EXISTS attempts (
 id INTEGER PRIMARY KEY AUTOINCREMENT, topic TEXT NOT NULL, question TEXT NOT NULL,
 correct INTEGER NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS mastery (
 topic TEXT PRIMARY KEY, alpha REAL NOT NULL DEFAULT 2, beta REAL NOT NULL DEFAULT 2,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS quiz_history (
 digest TEXT PRIMARY KEY, question TEXT NOT NULL, topic TEXT NOT NULL, payload TEXT NOT NULL DEFAULT '{}'
);
'''

def connect():
    active_path = _REQUEST_DB_PATH.get() or DB_PATH
    Path(active_path).parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(active_path, timeout=15)
    con.execute('PRAGMA foreign_keys=ON')
    con.execute('PRAGMA busy_timeout=15000')
    con.row_factory = sqlite3.Row
    con.executescript(SCHEMA)
    cols={r['name'] for r in con.execute('PRAGMA table_info(chunks)')}
    if 'concepts' not in cols: con.execute("ALTER TABLE chunks ADD COLUMN concepts TEXT NOT NULL DEFAULT '[]'")
    if 'prerequisites' not in cols: con.execute("ALTER TABLE chunks ADD COLUMN prerequisites TEXT NOT NULL DEFAULT '[]'")
    qcols={r['name'] for r in con.execute('PRAGMA table_info(quiz_history)')}
    if 'payload' not in qcols: con.execute("ALTER TABLE quiz_history ADD COLUMN payload TEXT NOT NULL DEFAULT '{}'")
    con.commit()
    return con

def clean_text(s: str) -> str:
    return re.sub(r'\s+', ' ', s or '').strip()

def topic_for(text: str) -> str:
    """Assign a conservative topic label using explicit domain patterns before lexical fallback.

    Labels are heuristics, not a validated topic model. When the text is ambiguous, the
    fallback returns a salient term rather than asserting a relationship it cannot prove.
    """
    low=(text or '').lower().replace('’', "'")
    law_matches=re.findall(r"newton'?s\s+(first|1st|second|2nd|third|3rd)\s+law",low)
    law_kinds={('first' if x in ('first','1st') else 'second' if x in ('second','2nd') else 'third') for x in law_matches}
    if len(law_kinds)>1: return "Newton's Laws Overview"
    law=re.search(r"newton'?s\s+(first|1st|second|2nd|third|3rd)\s+law",low)
    if law:
        ordinal={'first':'First','1st':'First','second':'Second','2nd':'Second','third':'Third','3rd':'Third'}[law.group(1)]
        if ordinal=='First': return 'Inertia & Motion'
        if ordinal=='Second': return 'Force & Acceleration'
        return 'Action–Reaction'
    if re.search(r'action[\s–-]+reaction',low) or ('equal magnitude' in low or 'equal and opposite' in low) and ('different objects' in low or 'opposite direction' in low):
        return 'Action–Reaction'
    if ('balanced forces' in low or 'vector sum' in low or 'net force is zero' in low):
        return 'Net Force'
    if ('inertia' in low and ('constant velocity' in low or 'at rest' in low)):
        return 'Inertia & Motion'
    if ('diagram' in low and ('force' in low or 'acceleration' in low)): return 'Force Diagram'
    if ('inertia' in low and 'mass' in low and 'weight' in low): return 'Mass, Weight & Inertia'
    if (re.search(r'\b\d+(?:\.\d+)?\s*kg\b',low) and re.search(r'\b\d+(?:\.\d+)?\s*n\b',low) and 'acceleration' in low): return 'Worked Example: Force & Acceleration'
    if ('newton' in low and 'kilogram' in low and 'acceleration' in low): return 'Worked Example: Force & Acceleration'
    if ('force' in low and 'acceleration' in low and ('mass' in low or re.search(r'\bf\s*=\s*m',low))):
        return 'Force & Acceleration'
    if ('work' in low and 'energy' in low): return 'Work & Energy'
    if ('dna' in low and ('gene' in low or 'genetic' in low)): return 'Genetics'
    if ('cell' in low and ('membrane' in low or 'cytoplasm' in low or 'organelle' in low)): return 'Cell Biology'
    words = re.findall(r"[A-Za-z][A-Za-z'-]{3,}", low)
    stop = set('this that with from have were they their about into when which what where while than then also using used each most more some such only very will would should could been being there these those through between after before because therefore example examples concept concepts applying acting continues remains states stated called measure measured increases decreases multiplied following first second third acts equals calculated demonstration diagram directions cart force mass object objects result results according states state based given shows shown write written formula relationship'.split())
    freq = {}
    for w in words:
        if w not in stop:
            freq[w] = freq.get(w, 0) + 1
    return (sorted(freq, key=lambda x: (-freq[x], x))[0].title() if freq else 'General')

def split_chunks(text: str, max_chars=850):
    text = clean_text(text)
    if not text: return []
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks, cur = [], ''
    for s in sentences:
        if len(cur) + len(s) + 1 > max_chars and cur:
            chunks.append(cur.strip()); cur = ''
        cur += (' ' if cur else '') + s
    if cur.strip(): chunks.append(cur.strip())
    return chunks


def concepts_for(text: str, limit=5):
    stop=set('this that with from have were they their about into when which what where while than then also using used each most more some such only very will would should could been being there these those through between after before because therefore example examples concept concepts lumen sample course material original demo page slide applying acting continues remains states stated called measure measured increases decreases multiplied following calculated calculation demonstration diagram directions cart equals according result results states state shows shown write written formula relationship included included demonstrate demonstrates determines chosen source note'.split())
    words=re.findall(r"[A-Za-z][A-Za-z'-]{3,}", text.lower())
    freq={}
    for w in words:
        if w not in stop: freq[w]=freq.get(w,0)+1
    ranked=sorted(freq, key=lambda w:(-freq[w],-len(w),w))
    return [w for w in ranked[:limit]]

def prerequisites_for(text: str):
    links=[]
    patterns=[
      (r'before (?:learning|applying|understanding) ([a-z][a-z -]{2,45}), (?:first )?(?:learn|understand|know|identify) ([a-z][a-z -]{2,45})', 'second'),
      (r'([a-z][a-z -]{2,45}) is a prerequisite for ([a-z][a-z -]{2,45})', 'first'),
      (r'([a-z][a-z -]{2,45}) depends on ([a-z][a-z -]{2,45})', 'second'),
    ]
    for pattern, prereq_side in patterns:
        for m in re.finditer(pattern, text.lower()):
            a,b=(clean_text(m.group(1)),clean_text(m.group(2)))
            prereq,topic=(b,a) if prereq_side=='second' else (a,b)
            if 2<=len(prereq.split())<=5 and 2<=len(topic.split())<=5:
                link={'prerequisite':prereq,'topic':topic,'evidence':m.group(0)}
                if link not in links: links.append(link)
    return links[:5]

def add_chunk(con, source, locator, kind, text):
    text = clean_text(text)
    if len(text) < 25: return False
    digest = hashlib.sha256(f'{source}|{locator}|{text}'.encode()).hexdigest()
    try:
        con.execute('INSERT INTO chunks(source,locator,kind,text,topic,concepts,prerequisites,digest) VALUES(?,?,?,?,?,?,?,?)',
                    (source, locator, kind, text, topic_for(text), json.dumps(concepts_for(text)), json.dumps(prerequisites_for(text)), digest))
        return True
    except sqlite3.IntegrityError:
        return False

def add_document(source: str, kind: str, pages: Iterable[tuple[str,str]]):
    con = connect(); count = 0
    for locator, text in pages:
        for chunk in split_chunks(text):
            count += int(add_chunk(con, source, locator, kind, chunk))
    con.commit(); con.close(); return count

def get_chunks():
    con = connect(); rows = [dict(r) for r in con.execute('SELECT * FROM chunks ORDER BY id')]; con.close(); return rows

_QUERY_STOP = set('a an the and or but if then than so of to in on at by for from with about is are was were be been being do does did what which who whom when where why how can could would should will may might it its this that these those i we you they he she them their your our as into over under up down not no explain explanation explainable main concept evidence summarize summary most important idea key terms term material course clearly difference compare using use tell me describe show change changes occur occurs happen happens during'.split())
_QUERY_CANONICAL = {
    'made':'produce', 'make':'produce', 'makes':'produce', 'making':'produce',
    'product':'produce', 'products':'produce', 'produced':'produce', 'produces':'produce', 'producing':'produce',
    'began':'begin', 'begun':'begin', 'begins':'begin', 'beginning':'begin',
    'developed':'develop', 'develops':'develop', 'developing':'develop',
    'lowered':'lower', 'lowers':'lower', 'lowering':'lower',
    'contains':'contain', 'contained':'contain', 'containing':'contain',
    'absorbs':'absorb', 'absorbed':'absorb', 'absorbing':'absorb',
    'shifted':'shift', 'shifts':'shift', 'shifting':'shift',
    'caused':'cause', 'causes':'cause', 'causing':'cause',
    'increases':'increase', 'increased':'increase', 'increasing':'increase',
    'decreases':'decrease', 'decreased':'decrease', 'decreasing':'decrease',
}

def _canonical_token(token: str) -> str:
    token = token.lower()
    if token in _QUERY_CANONICAL:
        return _QUERY_CANONICAL[token]
    # Conservative plural normalization; preserve words ending in -ss, -us, and -is.
    if len(token) > 4 and token.endswith('ies'):
        return token[:-3] + 'y'
    if len(token) > 4 and token.endswith('s') and not token.endswith(('ss', 'us', 'is')):
        return token[:-1]
    return token

def _query_tokens(text: str):
    tokens = [_canonical_token(t) for t in re.findall(r'[a-z0-9]{2,}', (text or '').lower())]
    return [t for t in tokens if t not in _QUERY_STOP]

def retrieve(query: str, limit=4):
    """Transparent BM25 retrieval with query coverage for auditable evidence selection."""
    qtokens = _query_tokens(query)
    qterms = set(qtokens)
    if not qterms:
        return []
    rows = get_chunks()
    if not rows:
        return []
    tokenized=[]; df={}; total_len=0
    for r in rows:
        toks=[_canonical_token(t) for t in re.findall(r'[a-z0-9]{2,}', r['text'].lower())]
        tokenized.append(toks); total_len += len(toks)
        for term in set(toks): df[term]=df.get(term,0)+1
    n=len(rows); avg_len=total_len/max(1,n); k1=1.5; b=0.75
    scored=[]
    for r,toks in zip(rows,tokenized):
        if not toks: continue
        tf={}
        for term in toks: tf[term]=tf.get(term,0)+1
        raw=0.0
        for term in qterms:
            f=tf.get(term,0)
            if not f: continue
            idf=math.log(1+(n-df.get(term,0)+0.5)/(df.get(term,0)+0.5))
            denom=f+k1*(1-b+b*len(toks)/max(1,avg_len))
            raw += idf*(f*(k1+1))/denom
        coverage=len(qterms.intersection(tf))/max(1,len(qterms))
        # Bound both components to [0,1], preserving interpretable retrieval confidence.
        bm25_norm=raw/(raw+4.0)
        score=0.55*coverage+0.45*bm25_norm
        if coverage>0 and score>0.08:
            scored.append((score,coverage,raw,r))
    scored.sort(key=lambda x:(x[0],x[1],x[2]),reverse=True)
    return [dict(score=round(score,3), query_coverage=round(cov,3), bm25=round(raw,3), **r) for score,cov,raw,r in scored[:limit]]

def ask(question: str):
    hits = retrieve(question, 4)
    qtokens = _query_tokens(question)
    qterm_count = len(set(qtokens))
    # Retrieval overlap alone can be misleading for fact-type questions (e.g. asking for
    # the population of a physics law). Require the requested answer type to be evidenced.
    answer_type_markers = ('population', 'capital', 'price', 'exchange rate', 'salary',
                           'revenue', 'market capitalization', 'market cap', 'winner',
                           'won', 'cure', 'medication', 'invented')
    requested_types = [marker for marker in answer_type_markers if marker in question.lower()]
    top_text = hits[0]['text'].lower() if hits else ''
    type_mismatch = any(marker not in top_text for marker in requested_types)
    coverage = hits[0].get('query_coverage', 0) if hits else 0
    minimum_coverage = 1.0 if qterm_count <= 2 else (2 / 3) if qterm_count == 3 else 0.50
    if (not hits or hits[0]['score'] < 0.25 or coverage < minimum_coverage or type_mismatch):
        return {'supported':False, 'answer':"I can't substantiate that from the material currently in this course. Upload relevant notes or ask a question tied to an indexed topic.", 'sources':[], 'confidence':'insufficient evidence'}
    qterms=set(_query_tokens(question))
    selected=[]
    for h in hits:
        for sentence in re.split(r'(?<=[.!?])\s+',h['text']):
            sentence=sentence.strip()
            if len(sentence)<35: continue
            words={_canonical_token(t) for t in re.findall(r'[a-z0-9]{2,}',sentence.lower())}
            overlap=len(qterms & words)
            if overlap:
                score=overlap/max(1,len(qterms)) + 0.1*overlap/max(1,len(words))
                selected.append((score,h,sentence))
    selected.sort(key=lambda x:x[0],reverse=True)
    evidence=[]; seen=set()
    for score,h,sentence in selected:
        sentence=re.sub(r'^(?:\d+\.\s*)?Newton[’\']s\s+(First|Second|Third)\s+Law\s+(?=Newton[’\']s\s+\1\s+Law\b)', '', sentence, flags=re.I).strip()
        key=sentence.lower()
        if key in seen: continue
        seen.add(key); evidence.append((h,sentence,score))
        if len(evidence)>=3: break
    if not evidence:
        # A question may be broad; return a source passage rather than fabricate a summary.
        evidence=[(hits[0],hits[0]['text'],hits[0]['score'])]
    answer='From the indexed course material:\n'+'\n'.join('• '+sentence for _,sentence,_ in evidence)
    sources=[]
    for h,sentence,score in evidence:
        sources.append({'source':h['source'],'locator':h['locator'],'kind':h['kind'],'excerpt':sentence,'score':round(score,3)})
    return {'supported':True, 'answer':answer, 'sources':sources, 'confidence':'retrieval-supported; not a calibrated probability', 'retrieval':{'method':'BM25 + informative-query-term coverage','top_score':hits[0]['score'],'query_coverage':hits[0].get('query_coverage',0)}}

def posterior_summary(alpha: float, beta: float):
    """Beta-posterior mean and a clearly approximate normal interval; not a calibrated score."""
    total=max(1e-9, alpha+beta)
    mean=alpha/total
    variance=(alpha*beta)/(total*total*(total+1))
    sd=math.sqrt(max(0.0,variance))
    return {'mean':round(mean,3),'interval_low':round(max(0.0,mean-1.96*sd),3),'interval_high':round(min(1.0,mean+1.96*sd),3),'posterior_sd':round(sd,3)}

def topics_summary():
    con=connect()
    rows=con.execute('SELECT topic,COUNT(*) n FROM chunks GROUP BY topic ORDER BY n DESC, topic').fetchall()
    mastery={r['topic']:posterior_summary(r['alpha'],r['beta']) for r in con.execute('SELECT * FROM mastery')}
    attempts={r['topic']:(r['n'],r['ok']) for r in con.execute('SELECT topic,COUNT(*) n,SUM(correct) ok FROM attempts GROUP BY topic')}
    con.close(); out=[]
    for r in rows:
        topic=r['topic']; n,ok=attempts.get(topic,(0,0)); post=mastery.get(topic,posterior_summary(2.0,2.0))
        out.append({'topic':topic,'chunks':r['n'],'mastery':post['mean'],'interval_low':post['interval_low'],'interval_high':post['interval_high'],'posterior_sd':post['posterior_sd'],'attempts':n,'accuracy':round((ok or 0)/n,3) if n else None})
    return out

def _candidate_questions():
    rows=get_chunks(); con=connect(); used={r['digest'] for r in con.execute('SELECT digest FROM quiz_history')}
    candidates=[]
    for r in rows:
        sentences=re.split(r'(?<=[.!?])\s+',r['text'])
        for sentence in sentences:
            sentence=sentence.strip()
            words=re.findall(r"\b[A-Za-z][A-Za-z'-]{4,}\b", sentence)
            if len(sentence)<65 or len(words)<7: continue
            key=hashlib.sha256(sentence.encode()).hexdigest()
            if key in used: continue
            candidates.append((key,r,sentence,words))
    con.close(); return candidates

def make_quiz(count=5):
    candidates=_candidate_questions(); questions=[]
    rows=get_chunks(); con=connect()
    used={r['digest'] for r in con.execute('SELECT digest FROM quiz_history')}
    mastery={r['topic']:r['alpha']/(r['alpha']+r['beta']) for r in con.execute('SELECT * FROM mastery')}
    con.close()
    rows.sort(key=lambda r:(mastery.get(r['topic'],0.5),r['id']))
    vocab=[]
    stop_words=set('about after again also and are because been being between both could does each from have into just more most must not only other same should some than that their them then there these they this those through under until very was were what when where which while with would your states stated called measure measured increases decreases multiplied calculated calculation demonstration diagram directions cart equals according result results newton law first second third object objects example examples sample course pack original material included demonstrates remains continues acting acts different equal opposite following shown shows write written required moving experiences horizontal divided relationship change tendency'.split())
    for _,r,s,words in candidates:
        for w in words:
            wl=w.lower()
            if wl not in stop_words and len(wl)>5 and not any(x[0]==wl for x in vocab): vocab.append((wl,w.title(),r['topic']))
    pool=[]
    # Numerical items are created only when a numeric result is explicitly present in the source.
    for r in rows:
        m=re.search(r'\b([a-zA-Z])\s*=\s*([0-9]+(?:\.[0-9]+)?)\s*[A-Za-z]*\s*/\s*([0-9]+(?:\.[0-9]+)?)\s*[A-Za-z]*\s*=\s*([0-9]+(?:\.[0-9]+)?)\s*([A-Za-z0-9/^²³]+)',r['text'])
        if m:
            var,num,den,result,unit=m.groups()
            qid=hashlib.sha256(('numerical|'+r['digest']+'|'+m.group(0)).encode()).hexdigest()
            formula_question=re.sub(r'=\s*'+re.escape(result)+r'\s*'+re.escape(unit)+r'\s*$', '= ?', m.group(0)).strip()
            context_sentences=re.split(r'(?<=[.!?])\s+',r['text'])
            context=next((sentence for sentence in context_sentences if m.group(0) in sentence),m.group(0))
            qtopic=topic_for(context)
            if qid not in used:
                pool.append({'id':qid,'type':'numerical','question':f'Using the source formula “{formula_question}”, what result and unit are calculated?','options':[],'answer':f'{result} {unit.rstrip(".")}', 'numeric_value':float(result),'topic':qtopic,'source':r['source'],'locator':r['locator'],'explanation':m.group(0),'keywords':[]})
    # Short-answer questions use topic prompts and a small source-derived keyword checklist.
    for r in rows:
        qid=hashlib.sha256(('short|'+r['digest']).encode()).hexdigest()
        if qid in used or len(r['text'])<120 or 'Overview' in r['topic']: continue
        try: concepts=json.loads(r.get('concepts','[]'))
        except Exception: concepts=[]
        keywords=[x.lower() for x in concepts if len(x)>3][:4]
        if len(keywords)<2: continue
        pool.append({'id':qid,'type':'short_answer','question':f'In your own words, explain the core idea of “{r["topic"]}”. Include the relevant key terms.','options':[],'answer':r['text'],'keywords':keywords,'topic':r['topic'],'source':r['source'],'locator':r['locator'],'explanation':r['text']})
    # MCQs are source-derived cloze items.
    for digest,r,s,words in candidates:
        s=re.sub(r'^(?:\d+\.\s*)?Newton[’\']s\s+(First|Second|Third)\s+Law\s+(?=Newton[’\']s\s+\1\s+Law\b)', '', s, flags=re.I).strip()
        if not 65 <= len(s) <= 320: continue
        if any(x in s.lower() for x in ('sample course pack','demo material','not copied from','included to demonstrate','source note')): continue
        target=None
        # Cloze targets must be salient source terms, not arbitrary long words or grammatical fillers.
        salient=set(concepts_for(s,limit=12))
        for w in words[2:]:
            if len(w)>5 and w.lower() in salient and w.lower() not in stop_words and w.lower() not in {'therefore','important','between','throughout','external','newtons'}:
                target=w; break
        if not target: continue
        qid=hashlib.sha256(('mcq|'+digest).encode()).hexdigest()
        if qid in used: continue
        distractors=[]
        for _,display,topic in vocab:
            if display.lower()!=target.lower() and display.lower() not in s.lower() and topic==r['topic']:
                distractors.append(display)
            if len(distractors)==3: break
        if len(distractors)<3:
            for _,display,_topic in vocab:
                if display.lower()!=target.lower() and display.lower() not in s.lower() and display not in distractors:
                    distractors.append(display)
                if len(distractors)==3: break
        # Keep only evidence-derived distractors; a two-option item is preferable to fabricated or nonsensical choices.
        if len(distractors)<1: continue
        masked=re.sub(r'\b'+re.escape(target)+r'\b','________',s,count=1,flags=re.I)
        opts=distractors+[target]; opts=sorted(opts,key=lambda x:hashlib.md5((qid+x).encode()).hexdigest())
        pool.append({'id':qid,'type':'mcq','question':f'Complete the statement from the source: “{masked}”','options':opts,'answer':target,'keywords':[],'topic':topic_for(s),'source':r['source'],'locator':r['locator'],'explanation':s})
    # Mix assessment formats when source evidence supports them; weakest topics lead within each format.
    groups={kind:sorted([q for q in pool if q['type']==kind],key=lambda q:(mastery.get(q['topic'],0.5),q['id'])) for kind in ('numerical','short_answer','mcq')}
    if count>=3:
        for kind in ('numerical','short_answer','mcq'):
            if groups[kind] and len(questions)<count: questions.append(groups[kind].pop(0))
    cycle=('mcq','short_answer','numerical'); idx=0
    while len(questions)<count and any(groups.values()):
        kind=cycle[idx%len(cycle)]; idx+=1
        if groups[kind]: questions.append(groups[kind].pop(0))
    for q in questions:
        q['mastery_before']=round(mastery.get(q['topic'],0.5),3)
        q['selection_reason']=('Baseline: no learner responses are recorded for this topic yet.' if q['topic'] not in mastery else 'Prioritized within its question format because this topic has a comparatively lower estimated mastery.')
        con=connect(); con.execute('INSERT OR REPLACE INTO quiz_history(digest,question,topic,payload) VALUES(?,?,?,?)',(q['id'],q['question'],q['topic'],json.dumps(q,ensure_ascii=False))); con.commit(); con.close()
    return questions

def get_stored_question(question_id: str):
    con=connect()
    row=con.execute('SELECT payload FROM quiz_history WHERE digest=?',(question_id,)).fetchone()
    con.close()
    if not row or not row['payload']:
        return None
    try: q=json.loads(row['payload'])
    except Exception: return None
    return q if q.get('id')==question_id and 'answer' in q else None

def record_stored_answer(question_id: str, answer: str):
    q=get_stored_question(question_id)
    if not q:
        raise ValueError('Question not found or no longer available. Generate a new practice set.')
    return record_answer(q, answer)

def _canonical_unit(text: str) -> str:
    unit = clean_text(text).lower().replace('²', '^2').replace('³', '^3')
    unit = re.sub(r'\s+', '', unit)
    replacements = {
        'meterspersecondsquared':'m/s^2', 'metrespersecondsquared':'m/s^2',
        'meterpersecondsquared':'m/s^2', 'metrepersecondsquared':'m/s^2',
        'meters/second^2':'m/s^2', 'metres/second^2':'m/s^2',
        'newtons':'n', 'newton':'n', 'kilograms':'kg', 'kilogram':'kg',
        'meters':'m', 'metres':'m', 'meter':'m', 'metre':'m',
    }
    for source, target in replacements.items():
        unit = unit.replace(source, target)
    return unit

def record_answer(q, answer):
    submitted=clean_text(answer)
    qtype=q.get('type','mcq')
    if qtype=='short_answer':
        keywords=q.get('keywords',[])
        matched=[k for k in keywords if k.lower() in submitted.lower()]
        coverage=len(matched)/max(1,len(keywords))
        correct=coverage>=0.5
    elif qtype=='numerical':
        m=re.search(r'-?\d+(?:\.\d+)?',submitted)
        expected_value = q.get('numeric_value')
        if expected_value is None:
            expected_match = re.search(r'-?\d+(?:\.\d+)?', q['answer'])
            expected_value = float(expected_match.group(0)) if expected_match else float('nan')
        expected_unit = re.sub(r'^\s*-?\d+(?:\.\d+)?\s*', '', clean_text(q.get('answer', '')))
        numeric_ok = bool(m) and abs(float(m.group(0))-float(expected_value))<1e-8
        unit_ok = not expected_unit or _canonical_unit(expected_unit) in _canonical_unit(submitted)
        correct = numeric_ok and unit_ok
        keywords=[]; matched=[]; coverage=1.0 if correct else 0.0
    else:
        correct=submitted.lower()==clean_text(q['answer']).lower(); keywords=[]; matched=[]; coverage=1.0 if correct else 0.0
    con=connect(); con.execute('INSERT OR IGNORE INTO quiz_history(digest,question,topic) VALUES(?,?,?)',(q['id'],q['question'],q['topic']))
    row=con.execute('SELECT alpha,beta FROM mastery WHERE topic=?',(q['topic'],)).fetchone()
    alpha,beta=(row['alpha'],row['beta']) if row else (2.0,2.0)
    if correct: alpha += 1
    else: beta += 1
    con.execute('INSERT INTO mastery(topic,alpha,beta,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(topic) DO UPDATE SET alpha=excluded.alpha,beta=excluded.beta,updated_at=CURRENT_TIMESTAMP',(q['topic'],alpha,beta))
    con.execute('INSERT INTO attempts(topic,question,correct) VALUES(?,?,?)',(q['topic'],q['question'],int(correct)))
    con.commit(); con.close()
    post=posterior_summary(alpha,beta)
    return {'correct':correct,'answer':q['answer'],'explanation':q.get('explanation','Source-derived answer.'),'source':q.get('source','Unknown source'),'locator':q.get('locator','Unknown location'),'mastery':post['mean'],'mastery_interval_low':post['interval_low'],'mastery_interval_high':post['interval_high'],'posterior_sd':post['posterior_sd'],'key_concepts':keywords,'matched_concepts':matched,'coverage':round(coverage,2),'question_type':qtype,'grading_note':('Keyword coverage heuristic; this is not semantic grading.' if qtype=='short_answer' else 'Exact source-derived key comparison.' if qtype=='mcq' else 'Numeric-value check; unit equivalence is not fully validated.')}

def concept_summary():
    con=connect(); rows=con.execute('SELECT source,locator,concepts,prerequisites FROM chunks ORDER BY id').fetchall(); con.close()
    counts={}; links=[]
    for r in rows:
        try: concepts=json.loads(r['concepts'])
        except Exception: concepts=[]
        for c in concepts:
            counts[c]=counts.get(c,0)+1
        try: rels=json.loads(r['prerequisites'])
        except Exception: rels=[]
        for rel in rels:
            links.append({**rel,'source':r['source'],'locator':r['locator']})
    return {'concepts':[{'name':k,'passages':v} for k,v in sorted(counts.items(),key=lambda x:(-x[1],x[0]))[:18]],'prerequisites':links[:20]}

def clear_data():
    con=connect()
    for table in ('chunks','attempts','mastery','quiz_history'): con.execute(f'DELETE FROM {table}')
    con.commit(); con.close()

def evaluation():
    con=connect(); n=con.execute('SELECT COUNT(*) FROM chunks').fetchone()[0]; topics=con.execute('SELECT COUNT(DISTINCT topic) FROM chunks').fetchone()[0]
    attempts=con.execute('SELECT COUNT(*) FROM attempts').fetchone()[0]; correct=con.execute('SELECT COALESCE(SUM(correct),0) FROM attempts').fetchone()[0]
    con.close()
    return {'indexed_chunks':n,'topic_count':topics,'quiz_attempts':attempts,'observed_accuracy':round(correct/attempts,3) if attempts else None,
            'evaluation_note':'Live counters from this local session. These are not a benchmark score. Use the included evaluation script for reproducible retrieval and refusal tests.'}
