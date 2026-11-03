import pytest
from verifier import parse_math,verify_item,audit_items

def it(kind,**kw):
    d={"id":"T1","subject":"math","type":kind,"prompt":"test question","expected_answer":"4"}; d.update(kw); return d

def test_equation_correct(): assert verify_item(it("equation",expression="2*x+3=11",variable="x")).status=="verified"
def test_equation_wrong(): assert verify_item(it("equation",expression="3*x-6=0",variable="x",expected_answer="3")).status=="defect"
def test_multiple_solution_requires_complete_set():
    one=verify_item(it("equation",expression="x^2=9",variable="x",expected_answer="3"))
    both=verify_item(it("equation",expression="x^2=9",variable="x",expected_answer=["-3","3"]))
    assert one.status=="needs_review" and both.status=="verified"
def test_symbolic_equivalence(): assert verify_item(it("expression",expression="(x+1)^2",expected_answer="x^2+2*x+1")).status=="verified"
def test_newton2(): assert verify_item(it("newton2",values={"force":12,"mass":3})).status=="verified"
def test_kinematics(): assert verify_item(it("kinematics",values={"u":5,"a":2,"t":3,"target":"v"},expected_answer="11")).status=="verified"
def test_mcq_only_needs_review(): assert verify_item(it("mcq",options=["a","b"],correct_option="A",expected_answer="A")).status=="needs_review"
def test_unsupported_not_passed(): assert verify_item(it("essay")).status=="needs_review"
@pytest.mark.parametrize("s",["__import__('os').system('whoami')","x.__class__","open('/etc/passwd')","[x for x in (1,2)]","2**1000"])
def test_reject_unsafe_math(s):
    with pytest.raises(ValueError): parse_math(s)
def test_audit_summary():
    r=audit_items([it("equation",id="A",expression="x=4",variable="x"),it("equation",id="B",expression="x=4",variable="x",expected_answer="9"),it("essay",id="C")])
    assert r["summary"]=={"verified":1,"defect":1,"needs_review":1}
def test_duplicate_ids_are_reviewed():
    r=audit_items([it("equation",expression="x=4",variable="x"),it("equation",expression="x=4",variable="x")])
    assert r["summary"]["needs_review"]==2
def test_api_upload_review_and_exports(tmp_path,monkeypatch):
    import app
    monkeypatch.setattr(app,"DATA_DIR",tmp_path)
    from fastapi.testclient import TestClient
    c=TestClient(app.app)
    r=c.post("/api/audits/preview",json={"items":[it("equation",expression="x=4",variable="x")]})
    assert r.status_code==200
    aid=r.json()["audit_id"]
    assert c.post(f"/api/audits/{aid}/reviews",json={"item_id":"T1","decision":"approved","note":"checked"}).status_code==200
    assert c.get(f"/api/audits/{aid}/report.json").status_code==200
    assert c.get(f"/api/audits/{aid}/report.csv").status_code==200
    assert c.get(f"/api/audits/{aid}/report.pdf").status_code==200

def test_identity_equation_is_not_misreported_as_no_solution():
    assert verify_item(it("equation",expression="x=x",variable="x")).status=="needs_review"

def test_variable_denominator_expression_requires_domain_review():
    assert verify_item(it("expression",expression="(x^2-1)/(x-1)",expected_answer="x+1")).status=="needs_review"

def test_root_serves_multi_page_product():
    from fastapi.testclient import TestClient
    import app
    c=TestClient(app.app)
    home=c.get("/")
    assert home.status_code==200 and "STEMPROOF" in home.text
    assert c.get("/platform.html").status_code==200
    assert c.get("/audit.html").status_code==200
    assert c.get("/pilot.html").status_code==200
    assert c.get("/api/health").json()["service"]=="stemproof-verification-api"
