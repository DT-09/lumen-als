import os, tempfile
from pathlib import Path
import engine

def setup_function():
    td=tempfile.TemporaryDirectory(); setup_function.tmp=td
    engine.DB_PATH=str(Path(td.name)/'test.sqlite3')
    engine.connect().close()

def teardown_function(): setup_function.tmp.cleanup()

def test_source_grounded_retrieval():
    engine.add_document('physics.txt','text',[('Page 1','Newton second law states net force equals mass multiplied by acceleration. This is expressed as force equals mass times acceleration.')])
    r=engine.ask('Newton second law force mass acceleration')
    assert r['supported'] is True
    assert r['sources'][0]['locator']=='Page 1'

def test_off_material_refusal():
    engine.add_document('physics.txt','text',[('Page 1','Newton second law states net force equals mass multiplied by acceleration.')])
    r=engine.ask('What is the capital of Mars and its population?')
    assert r['supported'] is False

def test_mastery_updates():
    q={'id':'q1','question':'fill this','answer':'mass','topic':'Physics'}
    r=engine.record_answer(q,'mass')
    assert r['correct'] is True
    assert r['mastery']>0.5

def test_chunking():
    chunks=engine.split_chunks('First sentence is useful. Second sentence is also useful. Third sentence matters.')
    assert len(chunks)==1
    assert 'Second sentence' in chunks[0]

def test_quiz_questions_are_source_tagged_and_not_repeated():
    engine.add_document('lesson.txt','text',[
        ('Page 1','Newton’s first law. An object remains at rest or continues moving at constant velocity unless a net external force acts on it. The second law states that net force equals mass multiplied by acceleration. If net force increases while mass remains constant, acceleration increases.'),
        ('Page 2','Action and reaction forces have equal magnitude and opposite direction, but they act on different objects. A swimmer pushes water backward, and the water pushes the swimmer forward.')
    ])
    q1=engine.make_quiz(3)
    assert q1
    assert all(q['source']=='lesson.txt' and q['locator'].startswith('Page') for q in q1)
    ids={q['id'] for q in q1}
    q2=engine.make_quiz(3)
    assert ids.isdisjoint({q['id'] for q in q2})

def test_mastery_moves_down_after_wrong_answer():
    q={'id':'q2','question':'fill this','answer':'mass','topic':'Physics'}
    r=engine.record_answer(q,'force')
    assert r['correct'] is False
    assert r['mastery']<0.5

def test_short_answer_keyword_grading():
    q={'id':'sa1','question':'Explain force','answer':'Net force equals mass times acceleration.','topic':'Physics','type':'short_answer','keywords':['force','mass','acceleration']}
    r=engine.record_answer(q,'Net force equals mass times acceleration')
    assert r['correct'] is True
    assert r['coverage']==1.0

def test_numerical_answer_grading():
    q={'id':'num1','question':'Calculate acceleration','answer':'3 m/s²','numeric_value':3.0,'topic':'Physics','type':'numerical'}
    assert engine.record_answer(q,'3 m/s^2')['correct'] is True
    assert engine.record_answer({**q,'id':'num2'},'4 m/s^2')['correct'] is False
    assert engine.record_answer({**q,'id':'num3'},'3 bananas')['correct'] is False
    assert engine.record_answer({**q,'id':'num4'},'3 meters per second squared')['correct'] is True

def test_tutor_keeps_full_scientific_claim():
    engine.add_document('physics.txt','text',[('Page 1','Newton’s second law states that net force equals mass multiplied by acceleration. This relationship is written as F equals m times a.')])
    r=engine.ask('What does Newton second law say about force mass acceleration?')
    assert r['supported'] is True
    assert 'Newton’s second law states' in r['answer']

def test_mixed_assessment_types_when_source_supports_them():
    engine.add_document('worked_example.txt','text',[
        ('Page 1','Newton’s second law states that the net force on an object equals its mass multiplied by its acceleration. The relationship is written as F equals m times a. A 2 kg cart experiences a net horizontal force of 6 N. Using F = m × a, acceleration equals F divided by m: a = 6 N / 2 kg = 3 m/s². If the net force increases while mass remains constant, acceleration increases. If mass increases while net force remains constant, acceleration decreases. A force is not required to keep an object moving at constant velocity; a net force is required to change velocity.')
    ])
    questions=engine.make_quiz(8)
    types={q['type'] for q in questions}
    assert {'mcq','short_answer','numerical'}.issubset(types)

def test_explicit_prerequisite_extraction():
    links=engine.prerequisites_for('Before applying the second law, first understand net force.')
    assert links and links[0]['prerequisite']=='net force'
    assert links[0]['topic']=='the second law'


def test_bm25_prefers_relevant_source_for_paraphrase():
    engine.add_document('physics.txt','text',[
        ('Page 1','Newton second law states net force equals mass multiplied by acceleration. If mass increases while net force remains constant, acceleration decreases.'),
        ('Page 2','An object at rest remains at rest unless a net external force acts on it. This tendency to resist a change in motion is called inertia.')
    ])
    hits=engine.retrieve('How does force affect acceleration if mass stays the same?',limit=2)
    assert hits and hits[0]['locator']=='Page 1'
    assert hits[0]['query_coverage']>=0.5

def test_posterior_interval_is_bounded_and_wide_with_little_evidence():
    p=engine.posterior_summary(2,2)
    assert p['mean']==0.5
    assert 0 <= p['interval_low'] < p['mean'] < p['interval_high'] <= 1
    assert p['interval_high']-p['interval_low']>0.7

def test_quiz_api_does_not_expose_answer_key():
    import app as api_app
    engine.add_document('physics.txt','text',[
        ('Page 1','Newton’s first law states that an object remains at rest or continues moving at constant velocity unless a net external force acts on it. Newton’s second law states net force equals mass multiplied by acceleration. If net force increases while mass remains constant, acceleration increases.'),
        ('Page 2','Action and reaction forces have equal magnitude and opposite direction, but they act on different objects. A swimmer pushes water backward, and the water pushes the swimmer forward.')
    ])
    response=api_app.api_quiz(api_app.QuizRequest(count=3))
    assert response['questions']
    for q in response['questions']:
        assert 'answer' not in q and 'keywords' not in q and 'explanation' not in q and 'numeric_value' not in q
        stored=engine.get_stored_question(q['id'])
        assert stored and 'answer' in stored
    stored=engine.get_stored_question(response['questions'][0]['id'])
    result=api_app.api_answer(api_app.AnswerRequest(question_id=stored['id'],answer=stored['answer']))
    assert result['correct'] is True


def test_topic_labels_prefer_academic_concepts_over_incidental_words():
    assert engine.topic_for('Newton’s second law states that net force equals mass multiplied by acceleration.') == 'Force & Acceleration'
    assert engine.topic_for('An object at rest remains at rest and this tendency is called inertia, under Newton’s first law.') == 'Inertia & Motion'
    assert engine.topic_for('Action and reaction forces have equal magnitude and opposite direction on different objects.') == 'Action–Reaction'
    assert engine.topic_for('Forces are balanced when their vector sum is zero.') == 'Net Force'


def test_topic_overview_does_not_force_one_law_label_on_mixed_material():
    assert engine.topic_for("Newton’s first law describes inertia. Newton’s second law relates force, mass, and acceleration.") == "Newton's Laws Overview"
    assert engine.topic_for("Action–reaction forces act on different objects.") == 'Action–Reaction'

def test_concept_index_filters_incidental_documentation_words():
    terms=engine.concepts_for('The diagram demonstrates calculated acceleration for the chosen cart. The force determines acceleration.')
    assert 'demonstrates' not in terms and 'calculated' not in terms and 'diagram' not in terms


def test_sentence_level_assessment_topics_are_more_specific_than_mixed_chunk():
    assert engine.topic_for('If mass increases while net force remains constant, acceleration decreases.') == 'Force & Acceleration'
    assert engine.topic_for('Mass measures inertia, while weight is the gravitational force acting on an object.') == 'Mass, Weight & Inertia'


def test_retrieval_normalizes_common_question_wording_variants():
    engine.add_document('biology.txt', 'text', [
        ('Page 1', 'Photosynthesis converts light energy into chemical energy. Chlorophyll absorbs light in chloroplasts; water and carbon dioxide are used to produce glucose and oxygen.')
    ])
    result = engine.ask('What products are made during photosynthesis?')
    assert result['supported'] is True
    assert result['sources']
    assert 'produce glucose and oxygen' in result['answer']


def test_api_rejects_oversized_answer_payload():
    import pytest
    from fastapi import HTTPException
    import app as api_app
    with pytest.raises(HTTPException) as err:
        api_app.api_answer(api_app.AnswerRequest(question_id='q', answer='x' * 2001))
    assert err.value.status_code == 413


def test_refusal_guard_rejects_fact_type_mismatch_with_lexical_overlap():
    engine.add_document('physics.txt', 'text', [
        ('Page 1', 'Newton second law states net force equals mass multiplied by acceleration. This tendency to resist a change in motion is called inertia.')
    ])
    engine.add_document('biology.txt', 'text', [
        ('Page 1', 'Photosynthesis converts light energy into chemical energy. Chlorophyll absorbs light in chloroplasts.')
    ])
    assert engine.ask('What is the population of Newton second law?')['supported'] is False
    assert engine.ask('What is the capital of inertia?')['supported'] is False
    assert engine.ask('What is the price of photosynthesis?')['supported'] is False
