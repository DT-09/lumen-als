from pathlib import Path
import json
import tempfile
from fastapi.testclient import TestClient
import app
import engine

ROOT = Path(__file__).parents[1]

def test_markdown_and_transcript_upload_preserve_source_locations():
    with tempfile.TemporaryDirectory() as td:
        engine.DB_PATH = str(Path(td) / "api.sqlite3")
        client = TestClient(app.app)
        for name in ("newtons_laws_sample.md", "newtons_laws_sample.vtt"):
            path = ROOT / "sample_materials" / name
            response = client.post("/api/upload", files=[("files", (name, path.read_bytes(), "text/plain"))])
            assert response.status_code == 200
            assert response.json()["results"][0]["ok"]
        chunks = engine.get_chunks()
        assert any(c["source"].endswith(".md") and c["locator"].startswith("Line ") for c in chunks)
        assert any(c["source"].endswith(".vtt") and c["locator"].startswith("Timestamp ") for c in chunks)

def test_hosted_browser_workspaces_are_isolated(monkeypatch, tmp_path):
    monkeypatch.setenv("PACELAB_SESSION_ISOLATION", "1")
    monkeypatch.setenv("PACELAB_DATA_DIR", str(tmp_path / "hosted-data"))
    monkeypatch.setenv("PACELAB_COOKIE_SECURE", "0")
    first, second = TestClient(app.app), TestClient(app.app)
    initial = first.get("/api/state")
    assert initial.status_code == 200
    cookie = first.cookies.get("pacelab_session")
    assert cookie and len(cookie) >= 40
    assert "httponly" in initial.headers.get("set-cookie", "").lower()
    path = ROOT / "sample_materials" / "newtons_laws_sample.md"
    uploaded = first.post("/api/upload", files=[("files", (path.name, path.read_bytes(), "text/markdown"))])
    assert uploaded.status_code == 200 and uploaded.json()["state"]["chunks"] > 0
    isolated = second.get("/api/state")
    assert isolated.status_code == 200 and isolated.json()["chunks"] == 0
    assert second.cookies.get("pacelab_session") != cookie
    assert second.post("/api/reset").status_code == 200
    assert first.get("/api/state").json()["chunks"] > 0

def test_upload_request_file_count_is_bounded():
    client = TestClient(app.app)
    payload = [("files", (f"lesson-{i}.txt", b"This is enough source text to exercise the upload count limit.", "text/plain")) for i in range(11)]
    assert client.post("/api/upload", files=payload).status_code == 413

def test_home_serves_the_current_pacelab_workspace():
    html = TestClient(app.app).get("/").text
    assert "<title>PaceLab — Learn with evidence</title>" in html
    for marker in ('id="view-home"', 'id="view-universe"', 'id="view-library"', 'id="view-tutor"', 'id="view-practice"', 'id="view-review"', 'id="view-progress"', 'id="view-math"', 'id="constellation"', 'id="practiceArea"', 'id="plotCanvas"'):
        assert marker in html

def test_state_api_exposes_live_workspace_fields():
    response = TestClient(app.app).get("/api/state")
    assert response.status_code == 200
    data = response.json()
    assert {"sources", "chunks", "topics", "concept_map", "evaluation"} <= set(data)
    assert isinstance(data["sources"], list) and isinstance(data["topics"], list)
    assert "concepts" in data["concept_map"]

def test_health_endpoint_reports_backend_identity():
    response = TestClient(app.app).get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"ok": True, "service": "pacelab-api", "version": app.app.version}

def test_frontend_controls_have_real_targets():
    import re
    from html.parser import HTMLParser
    class IdCollector(HTMLParser):
        def __init__(self):
            super().__init__()
            self.ids = set()
        def handle_starttag(self, tag, attrs):
            value = dict(attrs).get("id")
            if value:
                self.ids.add(value)
    html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    parser = IdCollector()
    parser.feed(html)
    script = html.split("<script>", 1)[1].split("</script>", 1)[0]
    dynamic_ids = {"quizAnswer", "quizFeedback", "quizSubmit", "quizSkip", "viewUpdatedProgress", "newPractice", "feedback", "skipQuestion", "textAnswer", "answerChoices", "again", "submitAnswer", "freeAnswer"}
    refs = set(re.findall(r"\$\('([^']+)'\)", script)) - dynamic_ids
    assert refs <= parser.ids
    views = set(re.findall(r'data-view="([^"]+)"', html))
    gotos = set(re.findall(r'data-go="([^"]+)"', html))
    valid = {value.removeprefix("view-") for value in parser.ids if value.startswith("view-")}
    assert views | gotos <= valid

def test_spaced_review_schedule_and_answer_key_privacy():
    with tempfile.TemporaryDirectory() as td:
        engine.DB_PATH = str(Path(td) / "review.sqlite3")
        question = {"id":"review-question-1","type":"mcq","question":"Which term describes resistance to a change in motion?","options":["Inertia","Velocity"],"answer":"Inertia","topic":"Inertia & Motion","source":"physics.md","locator":"Line 2","explanation":"Mass measures inertia.","keywords":[]}
        con = engine.connect()
        con.execute("INSERT INTO quiz_history(digest,question,topic,payload) VALUES(?,?,?,?)", (question["id"],question["question"],question["topic"],json.dumps(question)))
        con.commit(); con.close()
        result = engine.record_stored_answer(question["id"], "Inertia")
        assert result["correct"] is True and result["review"]["interval_days"] == 1
        con = engine.connect()
        con.execute("UPDATE review_queue SET due_at='2000-01-01T00:00:00+00:00' WHERE question_id=?", (question["id"],))
        con.commit(); con.close()
        due = engine.review_session()
        assert due["due_count"] == 1
        assert "answer" not in due["due_questions"][0] and "explanation" not in due["due_questions"][0]
        assert engine.record_stored_answer(question["id"], "Inertia")["review"]["interval_days"] == 3
        reset = engine.record_stored_answer(question["id"], "Velocity")
        assert reset["review"]["interval_days"] == 1 and reset["review"]["repetitions"] == 0

def test_review_api_is_available_without_a_due_queue():
    with tempfile.TemporaryDirectory() as td:
        engine.DB_PATH = str(Path(td) / "review-api.sqlite3")
        response = TestClient(app.app).get("/api/review")
        assert response.status_code == 200
        assert response.json()["due_count"] == 0 and response.json()["due_questions"] == []

def test_review_endpoint_returns_due_questions_without_private_fields():
    with tempfile.TemporaryDirectory() as td:
        engine.DB_PATH = str(Path(td) / "review-endpoint.sqlite3")
        q = {"id":"api-review-1","type":"mcq","question":"What is inertia?","options":["Resistance to change in motion","Net force"],"answer":"Resistance to change in motion","topic":"Inertia & Motion","source":"physics.md","locator":"Line 2","explanation":"Mass is a measure of inertia.","keywords":[]}
        con = engine.connect()
        con.execute("INSERT INTO quiz_history(digest,question,topic,payload) VALUES(?,?,?,?)", (q["id"],q["question"],q["topic"],json.dumps(q)))
        con.execute("INSERT INTO review_queue(question_id,due_at,interval_days,repetitions,last_correct) VALUES(?,?,?,?,?)", (q["id"],"2000-01-01T00:00:00+00:00",1,0,0))
        con.commit(); con.close()
        response = TestClient(app.app).get("/api/review")
        assert response.status_code == 200
        item = response.json()["due_questions"][0]
        assert item["id"] == q["id"]
        assert "answer" not in item and "explanation" not in item
