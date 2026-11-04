const API_BASE = (window.STEMPROOF_API_ORIGIN || "").replace(/\/$/,"");
const ACCESS_KEY_NAME = "stemproof_access_key";
function apiHeaders(extra={}) {
 const token=sessionStorage.getItem(ACCESS_KEY_NAME);
 return {...extra,...(token?{Authorization:"Bearer "+token}:{})};
}
const sampleItems=[
{id:"ALG-001",subject:"mathematics",type:"equation",prompt:"Solve 2x + 3 = 11.",expression:"2*x+3=11",variable:"x",expected_answer:"4"},
{id:"ALG-002",subject:"mathematics",type:"equation",prompt:"Solve 3x - 6 = 0.",expression:"3*x-6=0",variable:"x",expected_answer:"3"},
{id:"ALG-003",subject:"mathematics",type:"expression",prompt:"Expand (x + 1)².",expression:"(x+1)^2",expected_answer:"x^2+2*x+1"},
{id:"PHY-001",subject:"physics",type:"newton2",prompt:"A 3 kg object experiences a net force of 12 N. Find acceleration.",values:{force:12,mass:3},expected_answer:"4"},
{id:"PHY-002",subject:"physics",type:"kinematics",prompt:"Initial velocity 5 m/s, acceleration 2 m/s² for 3 s. Find final velocity.",values:{u:5,a:2,t:3,target:"v"},expected_answer:"11"},
{id:"ALG-004",subject:"mathematics",type:"equation",prompt:"Solve x² = 9.",expression:"x^2=9",variable:"x",expected_answer:"3"}
];
let currentAudit=null;
const $=s=>document.querySelector(s);
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function postJSON(path,body){const r=await fetch(API_BASE+path,{method:"POST",headers:apiHeaders({"Content-Type":"application/json"}),body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw Error(d.detail||"Request failed");return d;}
function statusTag(s){return s==="verified"?"good":s==="defect"?"bad":"review";}
function renderAudit(a){
 currentAudit=a;const root=$("#auditResults");if(!root)return;root.classList.remove("hidden");
 const s=a.summary;$("#auditSummary").innerHTML=`<div class="eyebrow">AUDIT ${esc(a.audit_id)}</div><h2>Verification results</h2><div class="stats"><div class="stat"><b>${a.item_count}</b><span>ITEMS CHECKED</span></div><div class="stat"><b>${s.verified}</b><span>VERIFIED BY RULE</span></div><div class="stat"><b>${s.defect}</b><span>DEFECTS FLAGGED</span></div><div class="stat"><b>${s.needs_review}</b><span>HUMAN REVIEW</span></div></div><div class="notice">A verified result applies only to its stated rule. It is not a general guarantee of question quality.</div><div class="actions"><button class="btn" type="button" data-export="pdf">PDF report ↓</button><button class="btn light" type="button" data-export="csv">CSV export ↓</button><button class="btn light" type="button" data-export="json">JSON evidence ↓</button><button class="btn light" type="button" id="deleteAudit">Delete audit</button></div>`;
 $("#findingList").innerHTML=a.findings.map(f=>`<article class="finding"><div class="findingtop"><span class="tag ${statusTag(f.status)}">${esc(f.status.replace("_"," "))}</span><span class="tag">${esc(f.severity)}</span><span class="mono muted small">${esc(f.item_id)}</span></div><h3>${esc(f.title)}</h3><p class="muted small">${esc(f.explanation)}</p><div class="evidence">${esc(JSON.stringify(f.evidence,null,2))}</div><div class="findingactions"><button class="btn light" data-review="${esc(f.item_id)}" data-decision="approved">Approve</button><button class="btn light" data-review="${esc(f.item_id)}" data-decision="rejected">Reject</button><button class="btn light" data-review="${esc(f.item_id)}" data-decision="corrected">Corrected</button></div><div class="muted small" id="review-${esc(f.item_id)}"></div></article>`).join("");
 $("#findingList").querySelectorAll("[data-review]").forEach(b=>b.addEventListener("click",()=>reviewFinding(b.dataset.review,b.dataset.decision)));
 root.querySelectorAll("[data-export]").forEach(b=>b.addEventListener("click",()=>downloadReport(a.audit_id,b.dataset.export)));
 const del=root.querySelector("#deleteAudit");del?.addEventListener("click",()=>deleteAudit(a.audit_id));
 root.scrollIntoView({behavior:"smooth",block:"start"});
}
async function runSample(){try{const a=await postJSON("/api/audits/preview",{items:sampleItems});renderAudit(a);if($("#auditError"))$("#auditError").textContent="";}catch(e){if($("#auditError"))$("#auditError").textContent=e.message;}}
async function uploadFile(file){const fd=new FormData();fd.append("file",file);const r=await fetch(API_BASE+"/api/audits",{method:"POST",headers:apiHeaders(),body:fd});const a=await r.json();if(!r.ok)throw Error(a.detail||"Upload failed");renderAudit(a);}
async function downloadReport(id,format){try{const r=await fetch(API_BASE+"/api/audits/"+id+"/report."+format,{headers:apiHeaders()});if(!r.ok)throw Error((await r.json()).detail||"Export failed");const blob=await r.blob(),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="stemproof-"+id+"."+format;a.click();URL.revokeObjectURL(url);}catch(e){if($("#auditError"))$("#auditError").textContent=e.message;}}
async function deleteAudit(id){if(!confirm("Permanently delete this audit record?"))return;try{const r=await fetch(API_BASE+"/api/audits/"+id,{method:"DELETE",headers:apiHeaders()});const d=await r.json();if(!r.ok)throw Error(d.detail||"Delete failed");currentAudit=null;$("#auditResults").classList.add("hidden");$("#auditError").textContent="Audit deleted.";}catch(e){$("#auditError").textContent=e.message;}}
async function reviewFinding(item,decision){if(!currentAudit)return;const note=prompt("Reviewer note (optional):")||"";try{const a=await postJSON("/api/audits/"+currentAudit.audit_id+"/reviews",{item_id:item,decision,note});currentAudit=a;const el=$("#review-"+CSS.escape(item));if(el)el.textContent="Recorded: "+decision; }catch(e){alert(e.message)}}
document.addEventListener("DOMContentLoaded",()=>{
 const menu=$(".menu"),links=$(".navlinks");menu?.addEventListener("click",()=>{const open=links.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
 const keyInput=$("#accessKey"),saveKey=$("#saveAccessKey");if(keyInput&&sessionStorage.getItem(ACCESS_KEY_NAME))keyInput.value=sessionStorage.getItem(ACCESS_KEY_NAME);saveKey?.addEventListener("click",()=>{const value=keyInput?.value.trim()||"";if(value)sessionStorage.setItem(ACCESS_KEY_NAME,value);else sessionStorage.removeItem(ACCESS_KEY_NAME);$("#keyStatus").textContent=value?"Access key stored for this browser tab.":"Access key cleared.";});
 const sampleButton=$("#runSample");sampleButton?.addEventListener("click",runSample);
 const form=$("#uploadForm");form?.addEventListener("submit",async e=>{e.preventDefault();const file=$("#questionFile")?.files?.[0];if(!file)return;try{await uploadFile(file);$("#auditError").textContent="";}catch(err){$("#auditError").textContent=err.message;}});
 const contact=$("#contactForm");contact?.addEventListener("submit",e=>{e.preventDefault();const data=new FormData(contact);const brief=["STEMPROOF EVALUATION REQUEST","Name: "+data.get("name"),"Organisation: "+data.get("organisation"),"Work email: "+data.get("email"),"Question bank: "+data.get("bank"),"Notes: "+data.get("notes")].join("\n");$("#requestBrief").value=brief;$("#briefWrap").classList.remove("hidden");$("#copyBrief").onclick=async()=>{try{await navigator.clipboard.writeText(brief);$("#copyStatus").textContent="Copied. Paste this into your chosen business email.";}catch{$("#copyStatus").textContent="Select and copy the text manually.";}};});
});
