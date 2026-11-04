from fastapi.testclient import TestClient

import app


def test_api_requires_bearer_token_when_configured(tmp_path, monkeypatch):
    monkeypatch.setattr(app, "DATA_DIR", tmp_path)
    monkeypatch.setattr(app, "API_TOKEN", "x" * 40)
    client = TestClient(app.app)
    assert client.get("/api/health").status_code == 200
    assert client.post("/api/audits/preview", json={"items": [{"id": "A"}]}).status_code == 401
    response = client.post(
        "/api/audits/preview",
        headers={"Authorization": "Bearer " + "x" * 40},
        json={"items": [{"id": "A", "type": "unknown", "prompt": "Q", "expected_answer": "A"}]},
    )
    assert response.status_code == 200


def test_audit_delete_requires_token_and_removes_record(tmp_path, monkeypatch):
    monkeypatch.setattr(app, "DATA_DIR", tmp_path)
    monkeypatch.setattr(app, "API_TOKEN", "y" * 40)
    client = TestClient(app.app)
    headers = {"Authorization": "Bearer " + "y" * 40}
    created = client.post(
        "/api/audits/preview",
        headers=headers,
        json={"items": [{"id": "A", "type": "unknown", "prompt": "Q", "expected_answer": "A"}]},
    )
    audit_id = created.json()["audit_id"]
    assert client.delete(f"/api/audits/{audit_id}").status_code == 401
    assert client.delete(f"/api/audits/{audit_id}", headers=headers).json()["deleted"] is True
    assert client.get(f"/api/audits/{audit_id}", headers=headers).status_code == 404


def test_duplicate_item_ids_cannot_receive_ambiguous_review(tmp_path, monkeypatch):
    monkeypatch.setattr(app, "DATA_DIR", tmp_path)
    monkeypatch.setattr(app, "API_TOKEN", "")
    client = TestClient(app.app)
    created = client.post(
        "/api/audits/preview",
        json={"items": [
            {"id": "DUP", "type": "unknown", "prompt": "Q1", "expected_answer": "A"},
            {"id": "DUP", "type": "unknown", "prompt": "Q2", "expected_answer": "B"},
        ]},
    )
    audit_id = created.json()["audit_id"]
    response = client.post(
        f"/api/audits/{audit_id}/reviews",
        json={"item_id": "DUP", "decision": "approved"},
    )
    assert response.status_code == 409
