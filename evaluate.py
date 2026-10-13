"""Reproducible, hand-authored evaluation for retrieval, refusal, citation provenance, adaptation, and quiz repetition.

This is a small software smoke benchmark, not a general benchmark or evidence of learning efficacy.
"""
import os, tempfile, json, statistics
from pathlib import Path

def main():
    with tempfile.TemporaryDirectory() as td:
        os.environ['LUMEN_DB']=str(Path(td)/'eval.sqlite3')
        import engine
        engine.DB_PATH=os.environ['LUMEN_DB']
        engine.add_document('sample_physics.pdf','pdf',[
            ('Page 2','Newton second law states that the net force on an object equals its mass multiplied by its acceleration. The relationship is written as F equals m times a. If net force increases while mass remains constant, acceleration increases. If mass increases while net force remains constant, acceleration decreases.'),
            ('Page 3','An object at rest remains at rest, and an object in motion continues at constant velocity unless a net external force acts on it. This is Newton first law. This tendency to resist a change in motion is called inertia. Mass is a measure of an object’s inertia.'),
        ])
        engine.add_document('sample_slides.pptx','slides',[
            ('Slide 4','Forces are balanced when their vector sum is zero. An object then has no acceleration and may remain at rest or continue at constant velocity.'),
        ])
        engine.add_document('sample_lecture.vtt','transcript',[
            ('Timestamp 00:00:08.000','Newton third law says action and reaction forces have equal magnitude and opposite direction, but they act on different objects.'),
        ])
        engine.add_document('sample_biology.txt','text',[
            ('Page 1','Photosynthesis converts light energy into chemical energy. Chlorophyll absorbs light in chloroplasts; water and carbon dioxide are used to produce glucose and oxygen. Cellular respiration releases usable energy from glucose, often using oxygen, in mitochondria. DNA contains genetic instructions; genes are DNA segments that influence traits.'),
        ])
        engine.add_document('sample_history.pptx','slides',[
            ('Slide 2','The printing press developed in Europe by Johannes Gutenberg around 1450 enabled faster reproduction of texts, lowered copying costs, and contributed to the spread of ideas. The Industrial Revolution began in Britain in the late eighteenth century; mechanization shifted production from handcraft to factories.'),
        ])
        cases=[
            ('Newton second law net force mass acceleration','Page 2',True),
            ('object at rest constant velocity net external force','Page 3',True),
            ('balanced forces vector sum zero','Slide 4',True),
            ('action reaction equal opposite different objects','Timestamp 00:00:08.000',True),
            ('What is inertia?','Page 3',True),
            ('What equation relates force mass and acceleration?','Page 2',True),
            ('If mass increases and net force stays constant what happens to acceleration?','Page 2',True),
            ('How does force affect acceleration if mass stays the same?','Page 2',True),
            ('Which structure contains chlorophyll and absorbs light energy?','Page 1',True),
            ('What products are made during photosynthesis?','Page 1',True),
            ('What energy change occurs during photosynthesis?','Page 1',True),
            ('Where does cellular respiration release usable energy?','Page 1',True),
            ('What contains genetic instructions and includes genes?','Page 1',True),
            ('Which molecule contains genetic instructions?','Page 1',True),
            ('Who developed the European printing press around 1450?','Slide 2',True),
            ('What did the printing press lower?','Slide 2',True),
            ('Where did the Industrial Revolution begin?','Slide 2',True),
            ('What production shift did mechanization cause?','Slide 2',True),
            ('How did the printing press change reproduction of texts?','Slide 2',True),
            ('In which century did the Industrial Revolution begin?','Slide 2',True),
            ('What is the capital of Mars and its population?','',False),
            ('Give the current price of a private company share','',False),
            ('Who invented calculus?','',False),
            ('What are the three laws of thermodynamics?','',False),
            ('What is the current exchange rate between the dollar and yen?','',False),
            ('Who won the 2026 World Cup?','',False),
            ('What medication cures every viral infection?','',False),
            ('What is the population of Atlantis today?','',False),
            ('What is the population of Newton’s second law?','',False),
            ('What is the capital of inertia?','',False),
            ('What is the price of photosynthesis?','',False),
        ]
        results=[]; reciprocal_ranks=[]; citation_checks=[]
        for q,expected_locator,supported in cases:
            retrieved=engine.retrieve(q,limit=3)
            rank=next((i+1 for i,h in enumerate(retrieved) if expected_locator and expected_locator in h['locator']),None)
            r=engine.ask(q)
            source_found=(rank is not None) if expected_locator else (not r['supported'] and not r['sources'])
            citation_ok=(all(s.get('source') and s.get('locator') for s in r.get('sources',[])) if r['supported'] else not r.get('sources'))
            citation_checks.append(citation_ok)
            if supported: reciprocal_ranks.append(1/rank if rank else 0.0)
            results.append({'query':q,'expected_supported':supported,'actual_supported':r['supported'],
                            'expected_locator':expected_locator or None,'rank_of_expected_locator_at_3':rank,
                            'source_found_at_3':source_found,'citation_provenance_check':citation_ok,
                            'pass':(r['supported']==supported and source_found and citation_ok)})
        supported_cases=[x for x in results if x['expected_supported']]
        unsupported_cases=[x for x in results if not x['expected_supported']]
        retrieval_recall=sum(x['source_found_at_3'] for x in supported_cases)/max(1,len(supported_cases))
        true_refusals=sum((not x['expected_supported']) and (not x['actual_supported']) for x in results)
        false_refusals=sum(x['expected_supported'] and (not x['actual_supported']) for x in results)
        missed_refusals=sum((not x['expected_supported']) and x['actual_supported'] for x in results)
        refusal_precision=true_refusals/max(1,true_refusals+false_refusals)
        refusal_recall=true_refusals/max(1,true_refusals+missed_refusals)
        # Synthetic learner profiles are a directionality check only, not learner outcomes.
        strong_q={'id':'sim-strong','question':'simulated strong learner','answer':'correct','topic':'SIMULATED_STRONG'}
        weak_q={'id':'sim-weak','question':'simulated learner needing support','answer':'correct','topic':'SIMULATED_SUPPORT'}
        for i in range(4): engine.record_answer({**strong_q,'id':f'strong-{i}'},'correct')
        for i in range(4): engine.record_answer({**weak_q,'id':f'weak-{i}'},'incorrect')
        con=engine.connect()
        t={r['topic']:r['alpha']/(r['alpha']+r['beta']) for r in con.execute('SELECT * FROM mastery')}
        con.close()
        strong=t.get('SIMULATED_STRONG'); weak=t.get('SIMULATED_SUPPORT')
        first=engine.make_quiz(3); second=engine.make_quiz(3)
        first_ids={q['id'] for q in first}; second_ids={q['id'] for q in second}
        repeat_count=len(first_ids & second_ids)
        summary={
          'evaluation_design':{'source_documents':5,'domains':['physics','biology','history'],'known_source_queries':len(supported_cases),'off_material_queries':len(unsupported_cases),'retrieval_cutoff_k':3,'retrieval_method':'BM25 + informative-query-term coverage'},
          'retrieval_refusal_test_count':len(results),
          'retrieval_refusal_passed':sum(x['pass'] for x in results),
          'retrieval_refusal_pass_rate':round(sum(x['pass'] for x in results)/len(results),3),
          'known_source_recall_at_3':round(retrieval_recall,3),
          'known_source_mrr_at_3':round(statistics.mean(reciprocal_ranks),3) if reciprocal_ranks else 0.0,
          'off_material_refusal_precision_on_fixture':round(refusal_precision,3),
          'off_material_refusal_recall_on_fixture':round(refusal_recall,3),
          'support_decision_confusion':{'correct_refusals':true_refusals,'incorrect_refusals':false_refusals,'missed_refusals':missed_refusals},
          'citation_provenance_checks_passed':sum(citation_checks),
          'cases':results,
          'simulated_learners':{'profile':'four correct answers vs four incorrect answers, Beta(2,2) prior','strong_profile_mastery':strong,'support_profile_mastery':weak,'directionality_pass':strong is not None and weak is not None and strong>weak},
          'question_repetition_check':{'first_set_size':len(first_ids),'second_set_size':len(second_ids),'overlapping_question_ids':repeat_count,'no_repeats_pass':repeat_count==0},
          'interpretation':'Hand-authored, small fixture with 20 in-scope and 11 out-of-scope queries across physics, biology, and history. Metrics describe this fixture only. Simulated profiles are not real learners; this is not a general benchmark, calibrated model score, or evidence of educational efficacy.'
        }
        output=json.dumps(summary,indent=2)
        (Path(__file__).with_name('evaluation_results.json')).write_text(output+'\n',encoding='utf-8')
        print(output)
        if (summary['retrieval_refusal_passed']!=summary['retrieval_refusal_test_count'] or
            not summary['simulated_learners']['directionality_pass'] or
            not summary['question_repetition_check']['no_repeats_pass'] or retrieval_recall<0.75):
            raise SystemExit(1)
if __name__=='__main__': main()
