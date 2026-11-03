from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,KeepTogether

def build_pdf(record):
    out=BytesIO(); doc=SimpleDocTemplate(out,pagesize=A4,leftMargin=17*mm,rightMargin=17*mm,topMargin=16*mm,bottomMargin=16*mm,title="STEMPROOF audit")
    styles=getSampleStyleSheet(); styles.add(ParagraphStyle(name="SmallMuted",parent=styles["BodyText"],fontSize=8,leading=11,textColor=colors.HexColor("#626b64")))
    styles.add(ParagraphStyle(name="EvidenceBox",parent=styles["Code"],fontSize=7,leading=9,backColor=colors.HexColor("#f1f0eb"),borderPadding=6,wordWrap="CJK"))
    s=record["summary"]; story=[Paragraph("STEMPROOF / VERIFICATION REPORT",styles["Title"]),Paragraph(f"Audit {record['audit_id']} · {record.get('created_at','')}",styles["SmallMuted"]),Spacer(1,7*mm),Paragraph("Assessment integrity review",styles["Heading2"]),Paragraph("Findings apply only to the specific supported checks described. Human review is required before source content is changed or published.",styles["BodyText"]),Spacer(1,5*mm)]
    t=Table([["ITEMS","VERIFIED","DEFECTS","NEEDS REVIEW"],[str(record["item_count"]),str(s["verified"]),str(s["defect"]),str(s["needs_review"])]],colWidths=[39*mm]*4)
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#202b27")),("TEXTCOLOR",(0,0),(-1,0),colors.white),("GRID",(0,0),(-1,-1),.4,colors.HexColor("#d1cec4")),("PADDING",(0,0),(-1,-1),8),("ALIGN",(0,0),(-1,-1),"CENTER")]))
    story += [t,Spacer(1,7*mm)]
    for f in record["findings"]:
        ev=str(f.get("evidence",{}))[:1600].replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
        block=[Paragraph(f"<b>{f['item_id']} · {f['status'].upper()} · {f['severity'].upper()}</b>",styles["Heading3"]),Paragraph(f["title"],styles["BodyText"]),Paragraph(f["explanation"],styles["SmallMuted"]),Paragraph(f"Rule: {f['rule']}",styles["SmallMuted"]),Paragraph(ev,styles["EvidenceBox"])]
        rev=record.get("reviews",{}).get(f["item_id"])
        if rev: block.append(Paragraph(f"Reviewer: {rev['decision']} · {rev.get('note','')}",styles["SmallMuted"]))
        block.append(Spacer(1,4*mm)); story.append(KeepTogether(block))
    story += [Paragraph("Scope and limitations",styles["Heading2"]),Paragraph("A verified answer matches a particular implemented rule. It does not prove question clarity, uniqueness, pedagogy, syllabus alignment or correctness outside the encoded model. MCQ key consistency is not independent answer verification. Unsupported items are not passed automatically.",styles["SmallMuted"])]
    doc.build(story); return out.getvalue()
