from __future__ import annotations
import csv,io,json,os,re,uuid
from datetime import datetime,timezone
from pathlib import Path
from threading import Lock
from typing import Any
from fastapi import FastAPI,File,HTTPException,UploadFile
from fastapi.responses import JSONResponse,Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,Field
from verifier import audit_items
from reports import build_pdf

DATA_DIR=Path(os.environ.get("STEMPROOF_DATA_DIR","./data")); DATA_DIR.mkdir(parents=True,exist_ok=True)
LOCK=Lock()
app=FastAPI(title="STEMPROOF Verification API",version="1.0.0",description="Evidence-first verification for mathematics and physics assessments")\norigins=[x.strip() for x in os.environ.get("STEMPROOF_CORS_ORIGINS","http://127.0.0.1:8080,http://localhost:8080").split(",") if x.strip()]\napp.add_middleware(CORSMiddleware,allow_origins=origins,allow_methods=["GET","POST"],allow_headers=["Content-Type"])

def save(record):
    aid=uuid.uuid4().hex[:12]; record={**record,"audit_id":aid,"created_at":datetime.now(timezone.utc).isoformat(),"reviews":{}}
    with LOCK: (DATA_DIR/f"{aid}.json").write_text(json.dumps(record,indent=2),encoding="utf-8")
    return record

def get(aid):
    if not re.fullmatch(r"[a-f0-9]{12}",aid or ""): raise HTTPException(404,"Audit not found.")
    p=DATA_DIR/f"{aid}.json"
    if not p.exists(): raise HTTPException(404,"Audit not found.")
    return json.loads(p.read_text(encoding="utf-8"))

def run(items):
    if not isinstance(items,list) or not items or len(items)>1000 or any(not isinstance(x,dict) for x in items):
        raise HTTPException(400,"Provide 1–1,000 question objects.")
    return save(audit_items(items))

def parse_file(name,raw):
    if len(raw)>8*1024*1024: raise HTTPException(413,"Maximum upload size is 8 MB.")
    try:
        if Path(name).suffix.lower()==".json":
            obj=json.loads(raw.decode("utf-8-sig")); items=obj.get("items",[]) if isinstance(obj,dict) else obj
        elif Path(name).suffix.lower()==".csv":
            items=list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig"))))
            for item in items:
                for k in ("values","options","units"):
                    if isinstance(item.get(k),str) and item[k].strip():
                        try: item[k]=json.loads(item[k])
                        except json.JSONDecodeError:
                            if k=="options": item[k]=[x.strip() for x in item[k].split(";") if x.strip()]
        else: raise HTTPException(400,"Upload .json or .csv.")
    except UnicodeDecodeError: raise HTTPException(400,"File must be UTF-8.")
    except json.JSONDecodeError as e: raise HTTPException(400,f"Invalid JSON: {e.msg}.")
    return items

class Preview(BaseModel): items:list[dict[str,Any]]=Field(min_length=1,max_length=1000)
class Review(BaseModel):
    item_id:str=Field(min_length=1,max_length=100)
    decision:str
    note:str=Field(default="",max_length=2000)

@app.get("/api/health")
def health(): return {"ok":True,"service":"stemproof-verification-api","version":app.version}
@app.post("/api/audits")
async def upload(file:UploadFile=File(...)): return run(parse_file(file.filename or "items.json",await file.read()))
@app.post("/api/audits/preview")
def preview(req:Preview): return run(req.items)
@app.get("/api/audits/{audit_id}")
def read(audit_id:str): return get(audit_id)
@app.post("/api/audits/{audit_id}/reviews")
def review(audit_id:str,req:Review):
    record=get(audit_id)
    if req.decision not in {"approved","rejected","corrected","deferred"}: raise HTTPException(400,"Invalid review decision.")
    if not any(f["item_id"]==req.item_id for f in record["findings"]): raise HTTPException(404,"Finding not found.")
    record["reviews"][req.item_id]={"decision":req.decision,"note":req.note,"reviewed_at":datetime.now(timezone.utc).isoformat()}
    with LOCK: (DATA_DIR/f"{audit_id}.json").write_text(json.dumps(record,indent=2),encoding="utf-8")
    return record
@app.get("/api/audits/{audit_id}/report.json")
def json_report(audit_id:str):
    return JSONResponse(get(audit_id),headers={"Content-Disposition":f'attachment; filename="stemproof-{audit_id}.json"'})
@app.get("/api/audits/{audit_id}/report.csv")
def csv_report(audit_id:str):
    r=get(audit_id); out=io.StringIO(); fields=["item_id","status","severity","title","explanation","rule","evidence"]
    w=csv.DictWriter(out,fieldnames=fields); w.writeheader()
    for f in r["findings"]:
        f=dict(f); f["evidence"]=json.dumps(f.get("evidence",{}),ensure_ascii=False); w.writerow({k:f.get(k,"") for k in fields})
    return Response(out.getvalue(),media_type="text/csv",headers={"Content-Disposition":f'attachment; filename="stemproof-{audit_id}.csv"'})
@app.get("/api/audits/{audit_id}/report.pdf")
def pdf_report(audit_id:str):
    return Response(build_pdf(get(audit_id)),media_type="application/pdf",headers={"Content-Disposition":f'attachment; filename="stemproof-{audit_id}.pdf"'})
app.mount("/",StaticFiles(directory=str(Path(__file__).parent/"web"),html=True),name="site")
