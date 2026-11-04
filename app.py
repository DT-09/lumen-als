from __future__ import annotations

import csv
import hmac
import io
import json
import os
import re
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from verifier import audit_items
from reports import build_pdf

BASE_DIR = Path(__file__).parent
DATA_DIR = Path(os.environ.get("STEMPROOF_DATA_DIR", "./data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOCK = Lock()
MAX_UPLOAD_BYTES = 8 * 1024 * 1024
MAX_ITEMS = 1000
API_TOKEN = os.environ.get("STEMPROOF_API_TOKEN", "").strip()
PRODUCTION = os.environ.get("STEMPROOF_ENV", "development").lower() == "production"

if PRODUCTION and len(API_TOKEN) < 32:
    raise RuntimeError("Production requires STEMPROOF_API_TOKEN with at least 32 characters.")

app = FastAPI(
    title="STEMPROOF Verification API",
    version="1.1.0",
    description="Evidence-first verification for mathematics and physics assessments",
    docs_url=None if PRODUCTION else "/docs",
    redoc_url=None if PRODUCTION else "/redoc",
    openapi_url=None if PRODUCTION else "/openapi.json",
)
origins = [
    value.strip()
    for value in os.environ.get(
        "STEMPROOF_CORS_ORIGINS", "http://127.0.0.1:8080,http://localhost:8080"
    ).split(",")
    if value.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.middleware("http")
async def protect_api(request: Request, call_next):
    if request.url.path.startswith("/api/") and request.url.path != "/api/health" and API_TOKEN:
        supplied = request.headers.get("authorization", "")
        expected = f"Bearer {API_TOKEN}"
        if not hmac.compare_digest(supplied, expected):
            return JSONResponse(
                {"detail": "A valid STEMPROOF access key is required."},
                status_code=401,
                headers={"Cache-Control": "no-store", "WWW-Authenticate": "Bearer"},
            )
    response = await call_next(request)
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
    return response


def persist(audit_id: str, record: dict[str, Any]) -> None:
    target = DATA_DIR / f"{audit_id}.json"
    fd, temporary = tempfile.mkstemp(prefix=f".{audit_id}-", suffix=".tmp", dir=DATA_DIR)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            json.dump(record, stream, indent=2, ensure_ascii=False)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, target)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def save(record: dict[str, Any]) -> dict[str, Any]:
    audit_id = uuid.uuid4().hex[:12]
    saved = {
        **record,
        "audit_id": audit_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "reviews": {},
    }
    with LOCK:
        persist(audit_id, saved)
    return saved


def get(audit_id: str) -> dict[str, Any]:
    if not re.fullmatch(r"[a-f0-9]{12}", audit_id or ""):
        raise HTTPException(404, "Audit not found.")
    path = DATA_DIR / f"{audit_id}.json"
    with LOCK:
        if not path.is_file():
            raise HTTPException(404, "Audit not found.")
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            raise HTTPException(500, "Audit record could not be read.") from None


def run(items: Any) -> dict[str, Any]:
    if (
        not isinstance(items, list)
        or not items
        or len(items) > MAX_ITEMS
        or any(not isinstance(item, dict) for item in items)
    ):
        raise HTTPException(400, "Provide 1–1,000 question objects.")
    return save(audit_items(items))


def parse_file(name: str, raw: bytes) -> Any:
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Maximum upload size is 8 MB.")
    suffix = Path(name or "").suffix.lower()
    try:
        if suffix == ".json":
            obj = json.loads(raw.decode("utf-8-sig"))
            items = obj.get("items", []) if isinstance(obj, dict) else obj
        elif suffix == ".csv":
            items = list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig"))))
            for item in items:
                for key in ("values", "options", "units"):
                    value = item.get(key)
                    if isinstance(value, str) and value.strip():
                        try:
                            item[key] = json.loads(value)
                        except json.JSONDecodeError:
                            if key == "options":
                                item[key] = [part.strip() for part in value.split(";") if part.strip()]
        else:
            raise HTTPException(400, "Upload .json or .csv.")
    except UnicodeDecodeError:
        raise HTTPException(400, "File must be UTF-8.") from None
    except json.JSONDecodeError as error:
        raise HTTPException(400, f"Invalid JSON: {error.msg}.") from None
    return items


class Preview(BaseModel):
    items: list[dict[str, Any]] = Field(min_length=1, max_length=MAX_ITEMS)


class Review(BaseModel):
    item_id: str = Field(min_length=1, max_length=100)
    decision: str
    note: str = Field(default="", max_length=2000)


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "service": "stemproof-verification-api",
        "version": app.version,
        "authentication_required": bool(API_TOKEN),
    }


@app.post("/api/audits")
async def upload(file: UploadFile = File(...)):
    raw = await file.read(MAX_UPLOAD_BYTES + 1)
    return run(parse_file(file.filename or "items.json", raw))


@app.post("/api/audits/preview")
def preview(request: Preview):
    return run(request.items)


@app.get("/api/audits/{audit_id}")
def read(audit_id: str):
    return get(audit_id)


@app.post("/api/audits/{audit_id}/reviews")
def review(audit_id: str, request: Review):
    record = get(audit_id)
    if request.decision not in {"approved", "rejected", "corrected", "deferred"}:
        raise HTTPException(400, "Invalid review decision.")
    matches = [finding for finding in record["findings"] if finding["item_id"] == request.item_id]
    if not matches:
        raise HTTPException(404, "Finding not found.")
    if len(matches) != 1:
        raise HTTPException(409, "This item ID is duplicated. Assign unique IDs before recording a review.")
    record["reviews"][request.item_id] = {
        "decision": request.decision,
        "note": request.note,
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
    }
    with LOCK:
        persist(audit_id, record)
    return record


@app.delete("/api/audits/{audit_id}")
def delete_audit(audit_id: str):
    get(audit_id)
    with LOCK:
        (DATA_DIR / f"{audit_id}.json").unlink(missing_ok=True)
    return {"deleted": True, "audit_id": audit_id}


@app.get("/api/audits/{audit_id}/report.json")
def json_report(audit_id: str):
    return JSONResponse(
        get(audit_id),
        headers={"Content-Disposition": f'attachment; filename="stemproof-{audit_id}.json"'},
    )


@app.get("/api/audits/{audit_id}/report.csv")
def csv_report(audit_id: str):
    record = get(audit_id)
    output = io.StringIO()
    fields = ["item_id", "status", "severity", "title", "explanation", "rule", "evidence"]
    writer = csv.DictWriter(output, fieldnames=fields)
    writer.writeheader()
    for finding in record["findings"]:
        row = dict(finding)
        row["evidence"] = json.dumps(row.get("evidence", {}), ensure_ascii=False)
        writer.writerow({key: row.get(key, "") for key in fields})
    return Response(
        output.getvalue(),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="stemproof-{audit_id}.csv"'},
    )


@app.get("/api/audits/{audit_id}/report.pdf")
def pdf_report(audit_id: str):
    return Response(
        build_pdf(get(audit_id)),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="stemproof-{audit_id}.pdf"'},
    )


app.mount("/", StaticFiles(directory=str(BASE_DIR / "web"), html=True), name="site")
