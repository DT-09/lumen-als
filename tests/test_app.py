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
    assert 'LUMEN ALS — Adaptive Learning System' in html
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
