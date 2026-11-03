from pathlib import Path
import tempfile
from fastapi.testclient import TestClient
import app, engine

ROOT=Path(__file__).parents[1]

def test_pdf_pptx_and_transcript_upload_preserve_locations():
    with tempfile.TemporaryDirectory() as td:
        engine.DB_PATH=str(Path(td)/'api.sqlite3')
        client=TestClient(app.app)
        files=['newtons_laws_sample.pdf','newtons_laws_sample.pptx','newtons_laws_sample.vtt']
        for name in files:
            path=ROOT/'sample_materials'/name
            response=client.post('/api/upload',files=[('files',(name,path.read_bytes(),'application/octet-stream'))])
            assert response.status_code==200
            assert response.json()['results'][0]['ok']
        chunks=engine.get_chunks()
        assert any(c['source']=='newtons_laws_sample.pdf' and c['locator'].startswith('Page ') for c in chunks)
        assert any(c['source']=='newtons_laws_sample.pptx' and c['locator'].startswith('Slide ') for c in chunks)
        assert any(c['source']=='newtons_laws_sample.vtt' and c['locator'].startswith('Timestamp ') for c in chunks)
        slide_text=' '.join(c['text'] for c in chunks if c['source']=='newtons_laws_sample.pptx')
        assert 'Net force: 6 N' in slide_text

def test_hosted_browser_workspaces_are_isolated(monkeypatch, tmp_path):
    monkeypatch.setenv('LUMEN_SESSION_ISOLATION', '1')
    monkeypatch.setenv('LUMEN_DATA_DIR', str(tmp_path / 'hosted-data'))
    monkeypatch.setenv('LUMEN_COOKIE_SECURE', '0')
    first = TestClient(app.app)
    second = TestClient(app.app)
    # First request creates an opaque, HttpOnly workspace cookie.
    initial = first.get('/api/state')
    assert initial.status_code == 200
    cookie = first.cookies.get('lumen_session')
    assert cookie and len(cookie) >= 40
    assert 'httponly' in initial.headers.get('set-cookie', '').lower()

    path = ROOT / 'sample_materials' / 'newtons_laws_sample.pdf'
    uploaded = first.post('/api/upload', files=[('files', (path.name, path.read_bytes(), 'application/pdf'))])
    assert uploaded.status_code == 200
    assert uploaded.json()['state']['chunks'] > 0

    # A different browser gets an independent database and cannot see the upload.
    isolated = second.get('/api/state')
    assert isolated.status_code == 200
    assert isolated.json()['chunks'] == 0
    assert second.cookies.get('lumen_session') != cookie
    reset = second.post('/api/reset')
    assert reset.status_code == 200
    assert first.get('/api/state').json()['chunks'] > 0

def test_upload_request_file_count_is_bounded():
    client = TestClient(app.app)
    payload = [('files', (f'lesson-{i}.txt', b'This is enough source text to exercise the upload count limit.', 'text/plain')) for i in range(11)]
    response = client.post('/api/upload', files=payload)
    assert response.status_code == 413

def test_home_serves_release_frontend_and_primary_views():
    client = TestClient(app.app)
    response = client.get('/')
    assert response.status_code == 200
    html = response.text
    assert 'Lumen — Learn in every direction' in html
    assert 'CHROMATIC ATLAS' in html
    assert 'id="engineNotice"' in html
    assert 'id="conceptSearch"' in html
    assert 'id="universeCanvas"' in html
    assert 'id="practiceArea"' in html
    assert 'id="mathGraph"' in html
    assert 'id="decisionTrace"' in html


def test_state_api_exposes_live_workspace_fields():
    client = TestClient(app.app)
    response = client.get('/api/state')
    assert response.status_code == 200
    data = response.json()
    assert {'sources', 'chunks', 'topics', 'concept_map', 'evaluation'} <= set(data)
    assert isinstance(data['sources'], list)
    assert isinstance(data['topics'], list)
    assert 'concepts' in data['concept_map']


def test_health_endpoint_reports_backend_identity():
    client = TestClient(app.app)
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json() == {
        'ok': True,
        'service': 'lumen-als-api',
        'version': app.app.version,
    }


def test_frontend_controls_have_real_targets():
    import re
    from html.parser import HTMLParser

    class IdCollector(HTMLParser):
        def __init__(self):
            super().__init__()
            self.ids = set()
        def handle_starttag(self, tag, attrs):
            value = dict(attrs).get('id')
            if value:
                self.ids.add(value)

    html = (ROOT / 'web' / 'index.html').read_text(encoding='utf-8')
    parser = IdCollector()
    parser.feed(html)
    script = html.split('<script>', 1)[1].split('</script>', 1)[0]
    # These controls are created dynamically when a question or session result is rendered.
    dynamic_ids = {'quizAnswer', 'quizFeedback', 'quizSubmit', 'quizSkip', 'viewUpdatedProgress', 'newPractice'}
    refs = set(re.findall(r"\$\('([^']+)'\)", script)) - dynamic_ids
    assert refs <= parser.ids
    views = set(re.findall(r'data-view="([^"]+)"', html))
    gotos = set(re.findall(r'data-goto="([^"]+)"', html))
    assert views | gotos <= {value.removeprefix('view-') for value in parser.ids if value.startswith('view-')}


def test_spaced_review_schedule_and_answer_key_privacy():
    with tempfile.TemporaryDirectory() as td:
        engine.DB_PATH=str(Path(td)/'review.sqlite3')
        question={
            'id':'review-question-1','type':'mcq','question':'Which term describes the tendency to resist a change in motion?',
            'options':['Inertia','Velocity'],'answer':'Inertia','topic':'Inertia & Motion','source':'physics.pdf',
            'locator':'Page 2','explanation':'Mass measures inertia.','keywords':[]
        }
        import json
        con=engine.connect()
        con.execute('INSERT INTO quiz_history(digest,question,topic,payload) VALUES(?,?,?,?)',
                    (question['id'],question['question'],question['topic'],json.dumps(question)))
        con.commit(); con.close()
        result=engine.record_stored_answer(question['id'],'Inertia')
        assert result['correct'] is True
        assert result['review']['interval_days']==1
        session=engine.review_session()
        assert session['scheduled_count']==1
        assert session['due_count']==0
        assert session['due_questions']==[]
        con=engine.connect()
        con.execute("UPDATE review_queue SET due_at='2000-01-01T00:00:00+00:00' WHERE question_id=?",(question['id'],))
        con.commit(); con.close()
        due=engine.review_session()
        assert due['due_count']==1
        assert len(due['due_questions'])==1
        assert 'answer' not in due['due_questions'][0]
        assert 'explanation' not in due['due_questions'][0]
        advanced=engine.record_stored_answer(question['id'],'Inertia')
        assert advanced['review']['interval_days']==3
        reset=engine.record_stored_answer(question['id'],'Velocity')
        assert reset['review']['interval_days']==1
        assert reset['review']['repetitions']==0


def test_review_api_is_available_without_a_due_queue():
    with tempfile.TemporaryDirectory() as td:
        engine.DB_PATH=str(Path(td)/'review-api.sqlite3')
        response=TestClient(app.app).get('/api/review')
        assert response.status_code==200
        assert response.json()['due_count']==0
        assert response.json()['due_questions']==[]


def test_review_endpoint_returns_due_questions_without_private_fields():
    with tempfile.TemporaryDirectory() as td:
        engine.DB_PATH=str(Path(td)/'review-endpoint.sqlite3')
        question={
            'id':'api-review-1','type':'mcq','question':'What is inertia?',
            'options':['Resistance to change in motion','Net force'],'answer':'Resistance to change in motion',
            'topic':'Inertia & Motion','source':'physics.pdf','locator':'Page 2',
            'explanation':'Mass is a measure of inertia.','keywords':[]
        }
        import json
        con=engine.connect()
        con.execute('INSERT INTO quiz_history(digest,question,topic,payload) VALUES(?,?,?,?)',
                    (question['id'],question['question'],question['topic'],json.dumps(question)))
        con.execute('INSERT INTO review_queue(question_id,due_at,interval_days,repetitions,last_correct) VALUES(?,?,?,?,?)',
                    (question['id'],'2000-01-01T00:00:00+00:00',1,0,0))
        con.commit(); con.close()
        response=TestClient(app.app).get('/api/review')
        assert response.status_code==200
        data=response.json()
        assert data['due_count']==1
        assert data['due_questions'][0]['id']==question['id']
        assert 'answer' not in data['due_questions'][0]
        assert 'explanation' not in data['due_questions'][0]
