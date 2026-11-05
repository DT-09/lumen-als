import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Atom, BookOpen, Bookmark, BrainCircuit, Check, ChevronRight, CircleHelp, Command, Compass, FlaskConical, FolderKanban, GitBranch, GraduationCap, Home, Lightbulb, Menu, Network, Plus, Search, Settings, Sparkles, StickyNote, Target, X } from "lucide-react";
import { useWorkspace } from "./core/store";
import type { LearningPath, PathStep } from "./core/types";
import { deriveEchoSignals, deriveLairPulse, readLairMission, writeLairMission, type LairMission } from "./core/engine";

const nav = [
  { group: "ORIENT", items: [
    { to: "/workspace", label: "The Lair", icon: Home },
    { to: "/workspace/questions", label: "Echolocation", icon: Lightbulb },
    { to: "/workspace/connections", label: "Echo Trails", icon: Network },
    { to: "/workspace/paths", label: "Flight Paths", icon: GitBranch },
    { to: "/workspace/knowledge", label: "Knowledge Network", icon: Compass }
  ] },
  { group: "OPERATE", items: [
    { to: "/workspace/studio", label: "Mastery Studio", icon: BookOpen },
    { to: "/workspace/investigations", label: "Investigation Chamber", icon: FlaskConical },
    { to: "/workspace/models", label: "Laboratory", icon: Atom },
    { to: "/workspace/projects", label: "Creation Workshop", icon: FolderKanban }
  ] },
  { group: "PRESERVE", items: [
    { to: "/workspace/library", label: "Research Archive", icon: Bookmark },
    { to: "/workspace/journal", label: "Field Notes", icon: StickyNote },
    { to: "/workspace/recall", label: "Recall Practice", icon: BrainCircuit }
  ] }
];
const titles: Record<string, [string, string]> = {
  "/workspace": ["The Lair", "Your personal environment for focused intellectual work."],
  "/workspace/questions": ["Echolocation", "Discover questions, phenomena and problems worth pursuing."],
  "/workspace/connections": ["Echo Trails", "Trace meaningful relationships across disciplines."],
  "/workspace/paths": ["Flight Paths", "Build an editable route through concepts and foundations."],
  "/workspace/studio": ["Mastery Studio", "Develop understanding you can explain and apply."],
  "/workspace/investigations": ["Investigation Chamber", "Examine hypotheses, observations, evidence and uncertainty."],
  "/workspace/models": ["Laboratory", "Explore systems through mathematical models and experiments."],
  "/workspace/projects": ["Creation Workshop", "Turn understanding into original, inspectable work."],
  "/workspace/library": ["Research Archive", "Preserve sources, provenance and critical annotations."],
  "/workspace/journal": ["Field Notes", "Record discoveries, doubts and changes in understanding."],
  "/workspace/knowledge": ["Knowledge Network", "See the concepts and work that make up your intellectual map."],
  "/workspace/recall": ["Recall Practice", "Reconstruct important ideas and identify what needs repair."]
};
function BatMark({ className = "" }: { className?: string }) { return <svg className={"bat-mark " + className} viewBox="0 0 100 54" role="img" aria-label="Vesper bat emblem"><path d="M3 8 C17 9 29 16 39 28 L47 12 L50 20 L53 12 L61 28 C71 16 83 9 97 8 L91 34 C83 31 77 36 70 46 L55 37 L50 51 L45 37 L30 46 C23 36 17 31 9 34 Z" fill="currentColor"/><path d="M12 16 C25 19 35 27 43 36 M88 16 C75 19 65 27 57 36" fill="none" stroke="#10110f" strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function Logo() { return <Link to="/" className="brand"><span className="brand-emblem"><BatMark/></span><span><b>VESPER</b><small>INDEPENDENT LEARNING SYSTEM</small></span></Link>; }
function Button({ children, onClick, variant = "quiet", type = "button" }: { children: React.ReactNode; onClick?: () => void; variant?: "quiet" | "primary" | "outline"; type?: "button" | "submit" }) { return <button type={type} onClick={onClick} className={"button " + variant}>{children}</button>; }
function Landing() {
  const [activeBridge,setActiveBridge]=useState("feedback");
  const bridgeExamples: Record<string,{title:string;nodes:string[];explanation:string;question:string}> = {
    feedback:{title:"How do systems correct change?",nodes:["Biology","Control engineering","Mathematics"],explanation:"Homeostasis and engineered controllers use feedback to regulate changing conditions. Compare sensors, response delay, gain and stability; the mechanisms are not identical.",question:"What makes a feedback system stable—or causes it to oscillate?"},
    resonance:{title:"Why do systems respond at certain frequencies?",nodes:["Physics","Music & acoustics","Engineering"],explanation:"Mechanical vibration, musical sound and structural response can be studied through frequency, energy transfer and resonance, while each field adds its own boundary conditions.",question:"How does a system's natural frequency shape its response to an external force?"},
    entropy:{title:"How can uncertainty be measured?",nodes:["Thermodynamics","Information theory","Computing"],explanation:"Entropy has precise but distinct meanings in physical and informational settings. Comparing their mathematics is useful only when the underlying definitions stay clear.",question:"What does entropy quantify in each setting—and what does it not tell us?"}
  };

  return <div className="landing">
    <header className="site-header"><Logo/><nav><a href="#method">The method</a><a href="#environment">The environment</a><a href="#principles">Principles</a></nav><Link className="button primary" to="/workspace">Enter Vesper <ArrowUpRight size={15}/></Link></header>
    <main>
      <section className="landing-hero">
        <div className="hero-grid"></div><div className="hero-contour contour-a"></div><div className="hero-contour contour-b"></div>
        <div className="hero-copy"><div className="eyebrow">A NOCTURNAL ENVIRONMENT FOR INDEPENDENT LEARNING</div><h1>Explore without ceilings.<br/><em>Understand the connected.</em></h1><p>A focused intellectual environment for independent learners. Follow curiosity across disciplines, develop mastery, investigate difficult questions and create original work—without grade ceilings or prescribed academic routes.</p><div className="hero-actions"><Link className="button primary large" to="/workspace">Enter the workspace <ArrowUpRight size={16}/></Link><a className="text-link" href="#method">Explore the method <ArrowDownRight size={15}/></a></div><div className="hero-caption"><span>01 — FIRST PRINCIPLES</span><span>02 — INVESTIGATION</span><span>03 — APPLICATION</span></div></div>
        <div className="hero-visual" aria-hidden="true"><div className="visual-ring ring-one"></div><div className="visual-ring ring-two"></div><div className="visual-ring ring-three"></div><div className="bat-hero-core"><BatMark/><span>VESPER / STEM</span></div><span className="orbit-label label-one">PHYSICS</span><span className="orbit-label label-two">SYSTEMS</span><span className="orbit-label label-three">MATHEMATICS</span><span className="orbit-label label-four">BIOLOGY</span><div className="signal-line signal-one"></div><div className="signal-line signal-two"></div></div>
        <div className="hero-bottom"><span>SCIENCE</span><span>TECHNOLOGY · ENGINEERING · MATHEMATICS</span><span>LEARN BY UNDERSTANDING</span></div>
      </section>
      <section className="manifesto section-wrap" id="method"><div className="section-index">01 / THE IDEA</div><div><h2>STEM is not a pile of facts.<br/><em>It is a way to understand systems.</em></h2><p>Vesper connects the full process of STEM self-education: foundations, mathematical reasoning, scientific evidence, computational thinking, experimentation, modelling and technical creation. The aim is not to finish content. It is to develop the ability to reason and work independently.</p></div></section>
      <section className="method-section section-wrap"><div className="section-index">02 / THE LEARNING CYCLE</div><div className="method-content"><h2>One connected process.<br/><em>Many ways to think.</em></h2><div className="cycle-grid">{[{n:"01",t:"Discover",d:"Capture a question worth pursuing.",i:"01"},{n:"02",t:"Structure",d:"Map concepts and prerequisites.",i:"02"},{n:"03",t:"Understand",d:"Explain, connect and practise.",i:"03"},{n:"04",t:"Investigate",d:"Examine claims and evidence.",i:"04"},{n:"05",t:"Model",d:"Explore systems and relationships.",i:"05"},{n:"06",t:"Create",d:"Make something original.",i:"06"},{n:"07",t:"Retain",d:"Return, reconstruct and refine.",i:"07"}].map(x=><div className="cycle-item" key={x.n}><span>{x.n}</span><b>{x.t}</b><p>{x.d}</p><small>STAGE {x.i}</small></div>)}</div></div></section>
      <section className="environment-section" id="environment"><div className="section-wrap"><div className="section-index">03 / THE ENVIRONMENT</div><div className="environment-heading"><h2>Every discipline connects.<br/>Every discovery has context.</h2><p>Begin with STEM. Follow a useful connection into computing, design, economics, philosophy or the natural world. Keep questions, concepts, evidence, models and original work in one coherent body of knowledge.</p></div><div className="environment-grid"><div className="environment-card card-large"><span>01 / THINK</span><Lightbulb/><h3>Questions & paths</h3><p>Turn curiosity into a navigable structure of concepts, dependencies and open questions.</p><div className="mini-graph"><i/><i/><i/><i/><i/><b/><b/><b/></div></div><div className="environment-card"><span>02 / UNDERSTAND</span><BookOpen/><h3>Learning studio</h3><p>Build explanations, keep working notes and test recall.</p></div><div className="environment-card"><span>03 / INVESTIGATE</span><FlaskConical/><h3>Investigation lab</h3><p>Record hypotheses, observations, interpretations and limitations.</p></div><div className="environment-card"><span>04 / EXPLORE</span><Atom/><h3>Model bench</h3><p>Change parameters. Observe behaviour. Record what changes.</p></div><div className="environment-card"><span>05 / MAKE</span><FolderKanban/><h3>Creation workshop</h3><p>Develop research, models, technical explanations and projects.</p></div><div className="environment-card"><span>06 / CONNECT</span><Network/><h3>Knowledge graph</h3><p>See how your understanding, sources and original work relate.</p></div></div></div></section>
      <section className="bridge-section section-wrap" id="connections">
        <div className="section-index">04 / THINK ACROSS DISCIPLINES</div>
        <div className="bridge-content">
          <div className="bridge-heading">
            <small>THE VESPER DIFFERENCE</small>
            <h2>One question.<br/><em>More than one lens.</em></h2>
            <p>Vesper does not keep learning inside subject boundaries. Explore how a useful idea travels between fields—and where the comparison has limits.</p>
            <div className="bridge-tabs" role="tablist" aria-label="Interdisciplinary examples">
              <button className={activeBridge==="feedback"?"selected":""} onClick={()=>setActiveBridge("feedback")}>Feedback loops</button>
              <button className={activeBridge==="resonance"?"selected":""} onClick={()=>setActiveBridge("resonance")}>Resonance</button>
              <button className={activeBridge==="entropy"?"selected":""} onClick={()=>setActiveBridge("entropy")}>Entropy</button>
            </div>
          </div>
          <div className="bridge-demo" aria-live="polite">
            <div className="bridge-demo-top"><span>CONNECTION STUDY / {activeBridge==="feedback"?"01":activeBridge==="resonance"?"02":"03"}</span><span>EXAMPLE · NOT A UNIVERSAL EQUIVALENCE</span></div>
            <h3>{bridgeExamples[activeBridge].title}</h3>
            <div className="bridge-nodes">
              {bridgeExamples[activeBridge].nodes.map((node,i)=><div className={"bridge-node node-"+i} key={node}><span>0{i+1}</span><b>{node}</b></div>)}
            </div>
            <div className="bridge-explanation"><small>WHAT CONNECTS THEM</small><p>{bridgeExamples[activeBridge].explanation}</p></div>
            <div className="bridge-question"><small>QUESTION TO PURSUE</small><b>{bridgeExamples[activeBridge].question}</b></div>
            <Link to="/workspace/connections" className="text-link">Explore and record your own connections <ArrowUpRight size={14}/></Link>
          </div>
        </div>
      </section>
      <section className="principles section-wrap" id="principles"><div className="section-index">04 / DESIGN PRINCIPLES</div><div className="principle-content"><h2>Quiet in appearance.<br/><em>Serious in purpose.</em></h2><div className="principle-list"><div><b>01</b><span>Substance over activity</span><p>Progress reflects work and understanding, not streaks or time spent.</p></div><div><b>02</b><span>Evidence over assertion</span><p>Keep observations, interpretations and limitations distinct.</p></div><div><b>03</b><span>Connection over silos</span><p>Every record can relate to the wider learning process.</p></div><div><b>04</b><span>Learner agency</span><p>Your questions, priorities and conclusions remain yours.</p></div></div></div></section>
      <section className="closing"><div className="closing-mark">v.</div><p>BUILD THE ABILITY TO LEARN INDEPENDENTLY.</p><h2>Start with the fundamentals.</h2><Link className="button primary large" to="/workspace">Enter Vesper <ArrowUpRight size={16}/></Link></section>
    </main>
    <footer className="site-footer"><Logo/><span>AN INTEGRATED ENVIRONMENT FOR INDEPENDENT LEARNING SYSTEM</span><span>© VESPER</span></footer>
  </div>;
}
function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [nightVision, setNightVision] = useState(() => localStorage.getItem("vesper.night-vision") === "on");
  const location = useLocation();
  const { data } = useWorkspace();
  useEffect(() => { localStorage.setItem("vesper.night-vision", nightVision ? "on" : "off"); }, [nightVision]);
  const filtered = nav.map(g => ({ ...g, items: g.items.filter(x => x.label.toLowerCase().includes(search.toLowerCase())) })).filter(g => g.items.length);
  const title = titles[location.pathname] || ["The Lair", "Your work, connected."];
  return <div className={"app-shell " + (nightVision ? "night-vision" : "")}>
    <aside className={"app-sidebar " + (open ? "open" : "")}>
      <div className="app-brand"><Logo/><button className="mobile-close" onClick={() => setOpen(false)}><X size={17}/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar"><BatMark/></div><div><b>{data.profile.name || "The Lair"}</b><small>PERSONAL RESEARCH ENVIRONMENT</small></div><ChevronRight size={14}/></div>
      <div className="side-search"><Search size={15}/><input placeholder="Find a chamber…" value={search} onChange={e => setSearch(e.target.value)}/><kbd>⌘ K</kbd></div>
      <nav className="app-nav">{filtered.map(group=><div className="nav-group" key={group.group}><small>{group.group}</small>{group.items.map(item=><NavLink key={item.to} to={item.to} end={item.to === "/workspace"} onClick={() => setOpen(false)} className={({isActive}) => isActive ? "active" : ""}><item.icon size={16}/><span>{item.label}</span></NavLink>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="storage-indicator"><span></span><div><b>LOCAL-FIRST ENGINE</b><small>Saved in this browser</small></div></div><Link to="/workspace/settings"><Settings size={15}/> Settings & data</Link><Link to="/"><Compass size={15}/> Vesper website</Link></div>
    </aside>
    {open&&<button className="side-scrim" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
    <main className="app-main">
      <header className="app-topbar">
        <button className="mobile-menu" onClick={()=>setOpen(true)}><Menu size={19}/></button>
        <div className="breadcrumb">VESPER <span>/</span> {title[0].toUpperCase()}</div>
        <div className="top-actions"><button className={"top-action night-toggle "+(nightVision?"enabled":"")} onClick={()=>setNightVision(v=>!v)}><span className="night-indicator"/>{nightVision?"Night vision on":"Night vision"} <ArrowUpRight size={13}/></button><button className="top-action" onClick={()=>document.dispatchEvent(new Event("vesper:export"))}>Export <ArrowUpRight size={14}/></button><div className="avatar-mini">{(data.profile.name || "V").slice(0,1).toUpperCase()}</div></div>
      </header>
      <div className="app-content">{children}</div>
    </main>
  </div>;
}
function PageHead({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc: string; action?: React.ReactNode }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>; }
function Empty({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) { return <div className="empty-state"><div className="empty-symbol"><Sparkles size={20}/></div><h3>{title}</h3><p>{desc}</p>{action}</div>; }
function Modal({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) { return <div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><motion.div className="modal-panel" initial={{opacity:0,y:14,scale:.98}} animate={{opacity:1,y:0,scale:1}}><div className="modal-title"><div><small>VESPER / NEW RECORD</small><h2>{title}</h2></div><button className="icon-btn" onClick={close}><X size={18}/></button></div>{children}</motion.div></div>; }
function Field({ label, name, placeholder, area=false, required=false }: { label: string; name: string; placeholder?: string; area?: boolean; required?: boolean }) { return <label className="field"><span>{label}</span>{area?<textarea name={name} placeholder={placeholder} required={required}/>:<input name={name} placeholder={placeholder} required={required}/>}</label>; }
function useModalForm(title: string, onSave: (form: FormData)=>void, fields: React.ReactNode) {
  const [show,setShow] = useState(false);
  const modal = show ? <Modal title={title} close={()=>setShow(false)}><form className="record-form" onSubmit={e=>{e.preventDefault();onSave(new FormData(e.currentTarget));setShow(false);}}>{fields}<div className="modal-actions"><Button variant="quiet" onClick={()=>setShow(false)}>Cancel</Button><Button type="submit" variant="primary">Save record <ArrowUpRight size={14}/></Button></div></form></Modal> : null;
  return { open: ()=>setShow(true), modal };
}
function RecordList({ rows, icon, emptyTitle, emptyDesc }: { rows: {id:string;title:string;meta:string;detail?:string}[]; icon: React.ReactNode; emptyTitle: string; emptyDesc: string }) {
  if (!rows.length) return <Empty title={emptyTitle} desc={emptyDesc}/>;
  return <div className="record-list">{rows.map(row=><div className="record-row" key={row.id}><div className="record-icon">{icon}</div><div className="record-copy"><b>{row.title}</b><small>{row.meta}</small>{row.detail&&<p>{row.detail}</p>}</div><ChevronRight size={16}/></div>)}</div>;
}
function Overview() {
  const { data, addQuestion } = useWorkspace();
  const navigate = useNavigate();
  const pulse = deriveLairPulse(data);
  const signals = deriveEchoSignals(data);
  const [draft, setDraft] = useState("");
  const [field, setField] = useState("Open inquiry");
  const [mission, setMission] = useState<LairMission | null>(() => readLairMission());
  useEffect(() => { writeLairMission(mission); }, [mission]);
  const capture = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    addQuestion({ title: draft.trim(), motivation: "Captured from the Lair echolocation console.", field, known: "", scope: "", status: "active" });
    setDraft("");
    navigate("/workspace/questions");
  };
  const recent = [
    ...data.questions.map(x => ({ id:x.id, title:x.title, kind:"QUESTION", date:x.updatedAt, href:"/workspace/questions/"+x.id })),
    ...data.projects.map(x => ({ id:x.id, title:x.title, kind:"PROJECT", date:x.updatedAt, href:"/workspace/projects" })),
    ...data.investigations.map(x => ({ id:x.id, title:x.title, kind:"INVESTIGATION", date:x.updatedAt, href:"/workspace/investigations" }))
  ].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  return <>
    <section className="lair-welcome">
      <div className="lair-welcome-copy">
        <div className="lair-kicker"><span className="lair-pulse-dot"/> VESPER / THE LAIR <span>PERSONAL RESEARCH ENVIRONMENT</span></div>
        <h1>Enter the unknown.<br/><em>Understand the connected.</em></h1>
        <p>A focused environment for independent learning, investigation and original work. No grade ceilings. No disciplinary walls. Your next step is yours to choose.</p>
        <div className="lair-principles"><span>01 / CURIOSITY</span><span>02 / EVIDENCE</span><span>03 / CREATION</span></div>
      </div>
      <div className="lair-sonar" aria-hidden="true">
        <div className="sonar-ring sonar-a"/><div className="sonar-ring sonar-b"/><div className="sonar-ring sonar-c"/>
        <div className="sonar-center"><BatMark/><small>ECHO / ACTIVE</small></div>
        <i className="sonar-point point-a"/><i className="sonar-point point-b"/><i className="sonar-point point-c"/>
        <span className="sonar-label sonar-label-a">DISCOVER</span><span className="sonar-label sonar-label-b">CONNECT</span><span className="sonar-label sonar-label-c">CREATE</span>
      </div>
    </section>

    <section className="lair-console">
      <div className="lair-section-head"><div><small>ECHOLOCATION CONSOLE / 01</small><h2>What has your attention?</h2><p>Begin with a question, phenomenon or problem. Advanced topics are welcome.</p></div><span>OPEN ENTRY</span></div>
      <form className="lair-capture" onSubmit={capture}>
        <Lightbulb size={19}/>
        <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="e.g. How does quantum entanglement change our idea of locality?" aria-label="Your question" />
        <select value={field} onChange={e=>setField(e.target.value)} aria-label="Discipline">
          {["Open inquiry","Physics","Mathematics","Biology","Computer science","Engineering","Chemistry","Earth science","Philosophy","Interdisciplinary"].map(x=><option key={x}>{x}</option>)}
        </select>
        <button className="button primary" type="submit" disabled={!draft.trim()}>Capture signal <ArrowUpRight size={14}/></button>
      </form>
    </section>

    <section className="lair-mission-grid">
      <article className="mission-panel">
        <div className="lair-section-head compact"><div><small>FLIGHT PLAN / ACTIVE OBJECTIVE</small><h2>Give this session a purpose.</h2></div><Target size={19}/></div>
        {mission ? <div className="mission-active">
          <div><span className="mission-status">{mission.completed?"OBJECTIVE COMPLETED":"CURRENT OBJECTIVE"}</span><h3>{mission.title}</h3><small>LAST UPDATED · {new Date(mission.updatedAt).toLocaleString()}</small></div>
          <div className="mission-actions"><button className="button outline" onClick={()=>setMission({...mission,completed:!mission.completed,updatedAt:new Date().toISOString()})}>{mission.completed?"Reopen":"Mark complete"}</button><button className="icon-btn" aria-label="Clear objective" onClick={()=>setMission(null)}><X size={15}/></button></div>
        </div> : <form className="mission-form" onSubmit={e=>{e.preventDefault();const form=e.currentTarget;const input=new FormData(form).get("objective");if(typeof input==="string"&&input.trim())setMission({title:input.trim(),updatedAt:new Date().toISOString(),completed:false});form.reset();}}>
          <input name="objective" placeholder="e.g. Derive the time-independent Schrödinger equation" aria-label="Session objective" required/>
          <button className="button outline" type="submit">Set objective <ArrowRight size={14}/></button>
        </form>}
        <p className="mission-footnote">A useful objective protects attention. It does not restrict a worthwhile discovery.</p>
      </article>
      <article className="echo-panel">
        <div className="echo-panel-head"><span className="echo-orb"><Sparkles size={15}/></span><div><small>ECHO / CONTEXTUAL INTELLIGENCE</small><b>Signals from your workspace</b></div><span className="local-tag">LOCAL ENGINE</span></div>
        {signals.slice(0,2).map(signal=><div className="echo-signal" key={signal.id}><div><small>{signal.mode.toUpperCase()} · SUGGESTED NEXT STEP</small><b>{signal.title}</b><p>{signal.detail}</p></div><Link to={signal.href} aria-label={signal.action}><ArrowUpRight size={16}/></Link></div>)}
        <p className="echo-disclosure">ECHO currently uses transparent, rule-based local guidance. It does not yet call a live AI model or verify external sources.</p>
      </article>
    </section>

    <section className="lair-outcomes">
      <div className="lair-section-head"><div><small>THE VESPER TRIAD / 02</small><h2>Three forms of intellectual growth.</h2><p>Learn deeply. Make something. Investigate what is not yet understood.</p></div><span>MASTERY · PROJECTS · RESEARCH</span></div>
      <div className="outcome-grid">
        <Link to="/workspace/studio" className="outcome-card mastery"><span className="outcome-number">01</span><BookOpen/><small>UNDERSTAND</small><h3>Mastery</h3><p>Develop concepts, reasoning and the ability to explain and apply what you know.</p><b>{pulse.concepts} concepts <ArrowUpRight size={13}/></b></Link>
        <Link to="/workspace/projects" className="outcome-card projects"><span className="outcome-number">02</span><FolderKanban/><small>BUILD</small><h3>Projects</h3><p>Turn ideas into models, software, experiments, designs and original artefacts.</p><b>{pulse.projects} projects <ArrowUpRight size={13}/></b></Link>
        <Link to="/workspace/investigations" className="outcome-card research"><span className="outcome-number">03</span><FlaskConical/><small>DISCOVER</small><h3>Research</h3><p>Develop questions, evaluate sources, examine evidence and record uncertainty.</p><b>{pulse.investigations} investigations · {pulse.resources} sources <ArrowUpRight size={13}/></b></Link>
      </div>
    </section>

    <section className="lair-lower-grid">
      <div className="lair-recent">
        <div className="lair-section-head compact"><div><small>ECHO TRAILS / RECENT ACTIVITY</small><h2>Return to your work.</h2></div><Link to="/workspace/journal">Field notes <ArrowUpRight size={13}/></Link></div>
        {recent.length ? <div className="lair-recent-list">{recent.map(item=><Link to={item.href} key={item.kind+item.id}><span>{item.kind}</span><b>{item.title}</b><small>{new Date(item.date).toLocaleDateString()}</small><ArrowUpRight size={14}/></Link>)}</div> : <div className="lair-empty">Your trail begins with the first question you capture.</div>}
      </div>
      <div className="lair-readout">
        <div className="lair-section-head compact"><div><small>BATCAVE READOUT / 03</small><h2>Workspace signals.</h2></div><Activity size={18}/></div>
        <div className="readout-stats"><div><b>{pulse.questions}</b><span>QUESTIONS</span></div><div><b>{pulse.connections}</b><span>CONNECTIONS</span></div><div><b>{pulse.totalRecords}</b><span>RECORDS</span></div></div>
        <div className="readout-note"><span>MASTERY EVIDENCE</span><b>{pulse.masteryEvidence} concepts marked understood</b><small>This is a learner-recorded signal, not a certification or independent assessment.</small></div>
        <Link className="text-link" to="/workspace/knowledge">Open Knowledge Network <ArrowUpRight size={14}/></Link>
      </div>
    </section>
  </>;
}
function Questions() {
  const {data,addQuestion}=useWorkspace(); const form=useModalForm("Capture a question",f=>addQuestion({title:String(f.get("title")),motivation:String(f.get("motivation")||""),field:String(f.get("field")||""),known:String(f.get("known")||""),scope:String(f.get("scope")||""),status:"active"}),<><Field name="title" label="The question" placeholder="What are you trying to understand?" required area/><Field name="motivation" label="Why it matters" placeholder="What sparked your curiosity?" area/><Field name="field" label="Field or subject" placeholder="Physics, mathematics, biology…"/><Field name="known" label="What you know so far" placeholder="Starting ideas, assumptions or prior knowledge" area/><Field name="scope" label="What a useful answer might contain" placeholder="An explanation, proof, model, investigation…" area/></>);
  return <><PageHead eyebrow="01 / CURIOSITY" title="Questions" desc="Start with something you genuinely want to understand." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Capture question</Button>}/><div className="intro-panel"><CircleHelp/><div><b>A question is a living record.</b><p>It can become a learning path, an investigation or a project. Refine it as your understanding changes.</p></div></div><RecordList rows={data.questions.slice().reverse().map(x=>({id:x.id,title:x.title,meta:[x.field||"Open inquiry",x.status.toUpperCase()].join(" · "),detail:x.motivation}))} icon={<Lightbulb size={16}/>} emptyTitle="No questions captured yet" emptyDesc="Write the question in your own words. You do not need to know the answer before you begin."/><div className="record-list">{data.questions.length>0&&data.questions.slice().reverse().map(q=><div className="detail-record" key={q.id}><div className="detail-record-top"><span>{q.field||"OPEN INQUIRY"}</span><span>{new Date(q.createdAt).toLocaleDateString()}</span></div><h3>{q.title}</h3><div className="question-record-actions"><Link to={"/workspace/questions/"+q.id}>Open question workspace <ArrowUpRight size={13}/></Link></div>{q.known&&<p><b>Starting knowledge</b> — {q.known}</p>}{q.scope&&<p><b>Useful outcome</b> — {q.scope}</p>}<div className="detail-links"><Link to="/workspace/paths">Build a learning path <ArrowUpRight size={13}/></Link><Link to="/workspace/investigations">Start an investigation <ArrowUpRight size={13}/></Link></div></div>)}</div>{form.modal}</>;
}

function QuestionWorkbench() {
 const {id=""}=useParams(); const {data}=useWorkspace(); const q=data.questions.find(x=>x.id===id);
 if(!q)return <><PageHead eyebrow="QUESTION / NOT FOUND" title="This question is unavailable." desc="It may have been removed or belong to another browser workspace."/><Link className="button outline" to="/workspace/questions">Back to questions</Link></>;
 const paths=data.paths.filter(x=>x.questionId===id), concepts=data.concepts.filter(x=>x.questionId===id), investigations=data.investigations.filter(x=>x.questionId===id), projects=data.projects.filter(x=>x.questionId===id), connections=data.connections.filter(x=>x.questionId===id);
 const stages=[{name:"Map prerequisites",count:paths.length,href:"/workspace/paths",hint:"Build a route through the concepts you need"},{name:"Build understanding",count:concepts.length,href:"/workspace/studio",hint:"Record concepts and explain them in your own words"},{name:"Connect disciplines",count:connections.length,href:"/workspace/connections",hint:"Record cross-disciplinary links that clarify the question"},{name:"Investigate evidence",count:investigations.length,href:"/workspace/investigations",hint:"State a hypothesis and examine evidence"},{name:"Create an output",count:projects.length,href:"/workspace/projects",hint:"Turn the work into a paper, model or prototype"}]; const done=stages.filter(x=>x.count>0).length;
 const linked=[...paths.map(x=>({title:x.title,type:"LEARNING PATH",detail:x.objective,href:"/workspace/paths"})),...concepts.map(x=>({title:x.title,type:"CONCEPT",detail:x.explanation,href:"/workspace/studio"})),...connections.map(x=>({title:x.title,type:"CONNECTION",detail:x.disciplineA+" ↔ "+x.disciplineB+" · "+x.relation+" · "+x.rationale,href:"/workspace/connections"})),...investigations.map(x=>({title:x.title,type:"INVESTIGATION",detail:x.hypothesis,href:"/workspace/investigations"})),...projects.map(x=>({title:x.title,type:"PROJECT",detail:x.description,href:"/workspace/projects"}))];
 return <><div className="workbench-back"><Link to="/workspace/questions"><ArrowDownRight size={14}/> ALL QUESTIONS</Link><span>QUESTION WORKSPACE / {q.field||"OPEN INQUIRY"}</span></div><section className="question-workbench-hero"><div className="eyebrow">ACTIVE INQUIRY · CREATED {new Date(q.createdAt).toLocaleDateString()}</div><h1>{q.title}</h1>{q.motivation&&<p className="workbench-motivation">{q.motivation}</p>}<div className="workbench-meta">{q.known&&<div><small>STARTING KNOWLEDGE</small><p>{q.known}</p></div>}{q.scope&&<div><small>USEFUL OUTCOME</small><p>{q.scope}</p></div>}</div></section><div className="workbench-progress"><div><small>INQUIRY DEVELOPMENT</small><b>{done} / 5 stages have linked work</b></div><div className="workbench-progress-track"><span style={{width:(done/5*100)+"%"}}/></div><p>This tracks linked records, not mastery or research quality. Choose the next stage that would reduce uncertainty.</p></div><div className="section-line"><div><small>THE INVESTIGATION CYCLE</small><h2>Build the work around the question</h2></div><span>{linked.length} LINKED RECORDS</span></div><div className="workbench-stages">{stages.map((x,i)=><article className={"workbench-stage "+(x.count?"has-work":"")} key={x.name}><div className="workbench-stage-index">0{i+1}</div><div><small>{x.count?x.count+" LINKED RECORD"+(x.count===1?"":"S"):"NOT STARTED"}</small><h3>{x.name}</h3><p>{x.hint}</p></div><Link to={x.href}>Open <ArrowUpRight size={13}/></Link></article>)}</div><div className="section-line"><div><small>LINKED WORK</small><h2>Everything in context</h2></div></div><div className="workbench-linked">{linked.map((x,i)=><Link className="workbench-linked-item" to={x.href} key={x.type+x.title+i}><small>{x.type}</small><b>{x.title}</b><p>{x.detail}</p><ArrowUpRight size={14}/></Link>)}{!linked.length&&<Empty title="This inquiry has no linked work yet." desc="Start by mapping prerequisites. Then connect concepts, evidence and outputs back to this question." action={<Link className="button primary" to="/workspace/paths">Build its first learning path <ArrowUpRight size={14}/></Link>}/>}</div><div className="workbench-footer-note"><CircleHelp/><p><b>Keep the question alive.</b> Revise its scope as new evidence appears. A good investigation may change the question rather than simply confirm an answer.</p></div></>;
}

function Paths() {
  const {data,addPath,updatePath}=useWorkspace();
  const form=useModalForm("Build a learning path",f=>{const lines=String(f.get("steps")).split("\n").map(x=>x.trim()).filter(Boolean);const steps:PathStep[]=lines.map((title,i)=>({id:"step-"+i,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),title,description:"",done:false}));addPath({title:String(f.get("title")),objective:String(f.get("objective")||""),questionId:String(f.get("questionId")||"")||undefined,steps,status:"active"});},<><Field name="title" label="Path title" placeholder="e.g. Foundations of orbital mechanics" required/><Field name="objective" label="Learning objective" placeholder="What should you be able to explain or do?" area/><label className="field"><span>Starting question</span><select name="questionId"><option value="">Independent path</option>{data.questions.map(q=><option value={q.id}>{q.title}</option>)}</select></label><Field name="steps" label="Concepts or steps · one per line" placeholder={"Prerequisites first\nCore concepts\nAdvanced application\nDemonstration"} area required/></>);
  return <><PageHead eyebrow="02 / STRUCTURE" title="Learning paths" desc="A route is a working model of what you need to understand, not a prescribed course." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> New path</Button>}/><div className="path-list">{data.paths.map(path=><div className="path-card" key={path.id}><div className="path-card-head"><div><small>LEARNING ROUTE</small><h3>{path.title}</h3><p>{path.objective||"No objective recorded yet."}</p></div><span className="status-pill">{path.status}</span></div><div className="path-progress"><span style={{width:(path.steps.filter(x=>x.done).length/Math.max(1,path.steps.length)*100)+"%"}}/></div><div className="path-steps">{path.steps.map((step,i)=><label className={"path-step "+(step.done?"done":"")} key={step.id}><input type="checkbox" checked={step.done} onChange={e=>updatePath(path.id,{steps:path.steps.map(x=>x.id===step.id?{...x,done:e.target.checked}:x)})}/><span>{String(i+1).padStart(2,"0")}</span><b>{step.title}</b></label>)}</div><small className="path-foot">{path.steps.filter(x=>x.done).length} OF {path.steps.length} STEPS COMPLETED · CHECKING A STEP RECORDS PROGRESS, NOT MASTERY</small></div>)}</div>{!data.paths.length&&<Empty title="Map the knowledge you need." desc="Create a sequence of concepts and prerequisites. You can revise the route as you learn." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Build a path</Button>}/>}{form.modal}</>;
}
function Studio() {
  const {data,addConcept,addJournal,addRecall}=useWorkspace();
  const form=useModalForm("Add a concept",f=>addConcept({title:String(f.get("title")),explanation:String(f.get("explanation")||""),confidence:Number(f.get("confidence")||2),status:"learning",questionId:String(f.get("questionId")||"")||undefined}),<><Field name="title" label="Concept" placeholder="Name the idea" required/><label className="field"><span>Connect to a question</span><select name="questionId"><option value="">No linked question</option>{data.questions.map(q=><option key={q.id} value={q.id}>{q.title}</option>)}</select></label><Field name="explanation" label="Explain it in your own words" placeholder="Definition, mechanism, example and connection…" area/><label className="field"><span>Current confidence</span><select name="confidence"><option value="1">1 — Unclear</option><option value="2">2 — Developing</option><option value="3">3 — Mostly understood</option><option value="4">4 — Can explain and apply</option></select></label></>);
  return <><PageHead eyebrow="03 / UNDERSTANDING" title="Learning studio" desc="Build an explanation. Close the source. Reconstruct the idea." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Add concept</Button>}/><div className="studio-banner"><div><small>THE PRACTICE</small><h2>Understanding is something<br/><em>you should be able to demonstrate.</em></h2><p>Write an explanation from memory. Find the gap. Return to the source only after you have tried to reconstruct the idea.</p></div><BookOpen size={42}/></div><div className="section-line"><div><small>YOUR CONCEPTS</small><h2>Concept workspace</h2></div><span>{data.concepts.length} CONCEPTS</span></div><RecordList rows={data.concepts.map(x=>({id:x.id,title:x.title,meta:x.status.toUpperCase()+" · CONFIDENCE "+x.confidence+"/4",detail:x.explanation}))} icon={<BookOpen size={16}/>} emptyTitle="No concepts in your studio" emptyDesc="Add a concept you are actively trying to understand."/><div className="section-line"><div><small>QUICK ACTIONS</small><h2>Turn understanding into practice</h2></div></div><div className="quick-grid"><button onClick={()=>{const title=prompt("Which concept should you revisit?");if(title)addRecall({title,dueAt:new Date(Date.now()+86400000).toISOString(),lastResult:"Not reviewed yet"});}}><BrainCircuit/><b>Queue for recall</b><span>Reconstruct it later</span></button><button onClick={()=>{const title=prompt("Name this reflection");const body=prompt("What changed in your understanding?");if(title&&body)addJournal({title,body,mood:"Reflection"});}}><StickyNote/><b>Write a reflection</b><span>Record a change in thinking</span></button></div>{form.modal}</>;
}
function Investigations() {
  const {data,addInvestigation,addObservation}=useWorkspace(); const [active,setActive]=useState<string|null>(null);
  const form=useModalForm("Create an investigation",f=>addInvestigation({title:String(f.get("title")),hypothesis:String(f.get("hypothesis")),method:String(f.get("method")||""),variables:String(f.get("variables")||""),limitations:String(f.get("limitations")||""),status:"active",questionId:String(f.get("questionId")||"")||undefined}),<><Field name="title" label="Research question" placeholder="What will you examine?" required area/><label className="field"><span>Driving question</span><select name="questionId"><option value="">Independent investigation</option>{data.questions.map(q=><option key={q.id} value={q.id}>{q.title}</option>)}</select></label><Field name="hypothesis" label="Hypothesis and rationale" placeholder="I expect… because…" required area/><Field name="method" label="Method or evidence plan" placeholder="How will you examine it?" area/><Field name="variables" label="Variables or evidence criteria" placeholder="What changes? What remains fixed?" area/><Field name="limitations" label="Limitations and uncertainty" placeholder="What could mislead the result?" area/></>);
  const obs=useModalForm("Record an observation",f=>{if(active)addObservation(active,{text:String(f.get("text")),interpretation:String(f.get("interpretation")||""),source:String(f.get("source")||"")});},<><Field name="text" label="Observation" placeholder="What did you actually observe?" required area/><Field name="interpretation" label="Interpretation" placeholder="What might this mean?" area/><Field name="source" label="Source or method" placeholder="Where did this observation come from?"/></>);
  return <><PageHead eyebrow="04 / INQUIRY" title="Investigations" desc="Keep what you observed separate from what you think it means." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> New investigation</Button>}/><div className="integrity-note"><Activity/><div><b>Evidence discipline</b><p>Record observations, interpretations and limitations separately. Vesper does not verify sources or certify conclusions.</p></div></div>{data.investigations.map(x=><div className="investigation-card" key={x.id}><div className="detail-record-top"><span>INVESTIGATION</span><span>{x.observations.length} OBSERVATIONS</span></div><h3>{x.title}</h3><div className="hypothesis"><small>HYPOTHESIS</small><p>{x.hypothesis}</p></div><div className="investigation-meta"><div><small>METHOD</small><p>{x.method||"Not recorded"}</p></div><div><small>LIMITATIONS</small><p>{x.limitations||"Not recorded"}</p></div></div><div className="observation-list">{x.observations.map(o=><div key={o.id}><b>{o.text}</b><p>{o.interpretation}</p><small>{o.source}</small></div>)}</div><Button onClick={()=>{setActive(x.id);obs.open();}}><Plus size={14}/> Add observation</Button></div>)}{!data.investigations.length&&<Empty title="Start an inquiry." desc="Define a question, state a hypothesis and decide what evidence could support or challenge it." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Create investigation</Button>}/>}{form.modal}{obs.modal}</>;
}
function Models() {
  const [mass,setMass]=useState(1);const [stiffness,setStiffness]=useState(4);const [damping,setDamping]=useState(.25);
  const omega=Math.sqrt(stiffness/mass);const period=2*Math.PI/omega;const decay=damping/(2*mass);const damped=Math.sqrt(Math.max(0,omega*omega-decay*decay));
  const points=Array.from({length:70},(_,i)=>{const t=i/6;const y=Math.exp(-decay*t)*Math.cos(damped*t);return [i*4,55-y*42];});
  const path=points.map((p,i)=>(i?"L":"M")+p[0]+","+p[1]).join(" ");
  return <><PageHead eyebrow="05 / EXPLORE" title="Model bench" desc="Change a system's parameters. Observe the behaviour. Ask what the model leaves out."/><div className="model-card"><div className="model-head"><div><small>INTERACTIVE MODEL / 001</small><h2>Damped harmonic oscillator</h2><p>A simplified mass–spring–damper system. Adjust the parameters and compare its response.</p></div><span className="model-tag">ILLUSTRATIVE MODEL</span></div><div className="model-layout"><div className="model-visual"><svg viewBox="0 0 300 115" role="img" aria-label="Spring and mass diagram"><path d="M25 18 H275" stroke="currentColor" opacity=".25"/><path d="M150 18 V28 l-10 6 20 9-20 9 20 9-10 6 V72" fill="none" stroke="#c9a66b" strokeWidth="2"/><rect x="118" y="72" width="64" height="29" rx="4" fill="#c9a66b" opacity=".9"/><text x="150" y="91" textAnchor="middle" fill="#171612" fontSize="11">m</text><path d="M75 18 V35 l-8 5 16 7-16 7 16 7-8 5 V72" fill="none" stroke="#8da59a" strokeWidth="2"/><path d="M40 72 H260" stroke="currentColor" opacity=".35"/><path d="M75 72 H118 M182 72 H225" stroke="currentColor" opacity=".3"/><text x="150" y="12" textAnchor="middle" fill="currentColor" fontSize="8">FIXED SUPPORT</text></svg><div className="model-controls"><label>Mass <b>{mass.toFixed(1)} kg</b><input type="range" min=".5" max="5" step=".1" value={mass} onChange={e=>setMass(Number(e.target.value))}/></label><label>Spring stiffness <b>{stiffness.toFixed(1)} N/m</b><input type="range" min="1" max="15" step=".5" value={stiffness} onChange={e=>setStiffness(Number(e.target.value))}/></label><label>Damping <b>{damping.toFixed(2)} Ns/m</b><input type="range" min="0" max="2" step=".05" value={damping} onChange={e=>setDamping(Number(e.target.value))}/></label></div></div><div className="response-panel"><div className="response-title"><span>DISPLACEMENT RESPONSE</span><small>MODEL TIME · 0–11.5 S</small></div><svg viewBox="0 0 280 120" preserveAspectRatio="none" className="response-chart"><path d="M0 60 H280 M0 20 H280 M0 100 H280" stroke="currentColor" opacity=".12" strokeDasharray="3 4"/><path d={path} fill="none" stroke="#c9a66b" strokeWidth="2"/></svg><div className="model-metrics"><div><small>UNDAMPED NATURAL FREQUENCY</small><b>{omega.toFixed(2)} <i>rad/s</i></b></div><div><small>UNDAMPED PERIOD</small><b>{period.toFixed(2)} <i>s</i></b></div><div><small>DAMPING REGIME</small><b>{decay<omega?"Underdamped":"Overdamped"}</b></div></div></div></div><div className="model-footnote">This is a simplified mathematical model, not a physical measurement. It assumes linear stiffness and viscous damping; real systems may violate these assumptions.</div></div><div className="integrity-note"><CircleHelp/><div><b>Model literacy</b><p>Try changing one parameter at a time. Record a prediction before moving the slider, then compare it with the model response.</p></div></div></>;
}
function Projects() {
  const {data,addProject}=useWorkspace();const form=useModalForm("Start a project",f=>addProject({title:String(f.get("title")),kind:String(f.get("kind")),question:String(f.get("question")||""),description:String(f.get("description")||""),status:"active",questionId:String(f.get("questionId")||"")||undefined}),<><Field name="title" label="Project title" placeholder="Name the work" required/><label className="field"><span>Output type</span><select name="kind"><option>Research paper</option><option>Mathematical model</option><option>Simulation / code</option><option>Technical explanation</option><option>Data analysis</option><option>Other</option></select></label><Field name="question" label="Driving question" placeholder="What question does this project address?" area/><label className="field"><span>Driving question</span><select name="questionId"><option value="">Independent project</option>{data.questions.map(q=><option key={q.id} value={q.id}>{q.title}</option>)}</select></label><Field name="description" label="Scope and intended output" placeholder="What will exist when this is complete?" area/></>);
  return <><PageHead eyebrow="06 / CREATION" title="Projects" desc="Make something that can be inspected, questioned and improved." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> New project</Button>}/><div className="project-types"><div><BookOpen/><b>Research</b><span>Papers, reports, arguments</span></div><div><Atom/><b>Computational</b><span>Models, simulations, code</span></div><div><Target/><b>Applied</b><span>Prototypes, explanations, designs</span></div></div><RecordList rows={data.projects.slice().reverse().map(x=>({id:x.id,title:x.title,meta:x.kind+" · "+x.status.toUpperCase(),detail:x.description}))} icon={<FolderKanban size={16}/>} emptyTitle="No projects started" emptyDesc="Create an output that grows from a question, concept or investigation."/>{form.modal}</>;
}
function Library() {
  const {data,addResource}=useWorkspace();const form=useModalForm("Add a resource",f=>addResource({title:String(f.get("title")),author:String(f.get("author")||""),kind:String(f.get("kind")),url:String(f.get("url")||""),contribution:String(f.get("contribution")||""),limitations:String(f.get("limitations")||"")}),<><Field name="title" label="Title" placeholder="Source title" required/><Field name="author" label="Author or organisation" placeholder="Author / publisher"/><label className="field"><span>Source type</span><select name="kind"><option>Research paper</option><option>Book</option><option>Dataset</option><option>Lecture</option><option>Documentation</option><option>Other</option></select></label><Field name="url" label="URL" placeholder="https://…"/><Field name="contribution" label="What does it contribute?" placeholder="Claim, method, evidence or useful context" area/><Field name="limitations" label="Limitations or questions" placeholder="What should be treated cautiously?" area/></>);
  return <><PageHead eyebrow="07 / SOURCES" title="Resource library" desc="Keep provenance attached to the ideas and work it informs." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Add resource</Button>}/><div className="integrity-note"><Bookmark/><div><b>A reference is not a verification.</b><p>Record the source's contribution and limitations. Vesper does not independently validate external publications or datasets.</p></div></div><div className="resource-list">{data.resources.map(x=><div className="resource-row" key={x.id}><div><small>{x.kind.toUpperCase()}</small><h3>{x.title}</h3><p>{x.author}</p>{x.contribution&&<p>{x.contribution}</p>}{x.limitations&&<small>LIMITATION: {x.limitations}</small>}</div>{x.url&&<a href={x.url} target="_blank" rel="noreferrer" className="icon-btn"><ArrowUpRight size={16}/></a>}</div>)}</div>{!data.resources.length&&<Empty title="Build your research shelf." desc="Save papers, books, datasets and references. Annotate why each source matters and where its limits lie." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Add resource</Button>}/>}{form.modal}</>;
}
function Journal() {
  const {data,addJournal}=useWorkspace();const form=useModalForm("Write a journal entry",f=>addJournal({title:String(f.get("title")),body:String(f.get("body")),mood:String(f.get("mood")||"Reflection")}),<><Field name="title" label="Entry title" placeholder="What changed in your thinking?" required/><Field name="body" label="Reflection" placeholder="What did you learn? What surprised you? What remains unclear?" required area/><label className="field"><span>Entry type</span><select name="mood"><option>Discovery</option><option>Reflection</option><option>Open question</option><option>Research note</option></select></label></>);
  return <><PageHead eyebrow="08 / REFLECTION" title="Field journal" desc="A record of intellectual movement: discoveries, doubts and revisions." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> New entry</Button>}/><div className="journal-list">{data.journal.slice().reverse().map(x=><article className="journal-entry" key={x.id}><small>{x.mood.toUpperCase()} · {new Date(x.createdAt).toLocaleDateString()}</small><h3>{x.title}</h3><p>{x.body}</p></article>)}</div>{!data.journal.length&&<Empty title="Leave a trace of your thinking." desc="Record a discovery, a failed assumption or a question that deserves another look." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Write entry</Button>}/>}{form.modal}</>;
}

const connectionSeeds = [
  { title: "Feedback loops", a: "Biology", b: "Control engineering", relation: "analogous to", why: "Homeostasis and engineered controllers both use feedback to regulate a changing system. Compare the role of sensors, response delay, gain and stability.", prompt: "How do living organisms and engineered systems maintain stability?" },
  { title: "Network effects", a: "Graph theory", b: "Economics", relation: "applies to", why: "The same network structure can describe communication links and the spread of value through markets. The mathematics is shared; the mechanisms and assumptions are not.", prompt: "How does network structure change the behaviour of a connected population?" },
  { title: "Oscillation and resonance", a: "Physics", b: "Music and acoustics", relation: "explains", why: "Resonance links mechanical systems, sound production and room acoustics through frequency response and energy transfer.", prompt: "Why do some systems respond strongly at particular frequencies?" },
  { title: "Information and entropy", a: "Thermodynamics", b: "Computer science", relation: "analogous to", why: "Entropy appears in distinct formal settings. Compare the mathematical role of uncertainty while keeping physical entropy and information entropy conceptually separate.", prompt: "What does entropy measure in physical and informational systems?" },
  { title: "Optimisation under constraints", a: "Mathematics", b: "Operations research", relation: "applies to", why: "Optimisation turns a goal, constraints and decision variables into a formal problem. The same framework appears in engineering design, logistics and resource allocation.", prompt: "How can a system find a best feasible outcome when resources are limited?" }
];
function Connections() {
  const { data, addConnection } = useWorkspace();
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [a, setA] = useState("Physics");
  const [b, setB] = useState("Mathematics");
  const [relation, setRelation] = useState("explains");
  const [why, setWhy] = useState("");
  const [prompt, setPrompt] = useState("");
  const [saved, setSaved] = useState("");
  const add = (item: typeof connectionSeeds[number]) => {
    if (data.connections.some(x => x.title.toLowerCase() === item.title.toLowerCase())) { setSaved("That connection is already in your map."); return; }
    addConnection({ title:item.title, disciplineA:item.a, disciplineB:item.b, relation:item.relation, rationale:item.why, question:item.prompt });
    setSaved("Connection added to your knowledge map.");
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !why.trim()) return;
    addConnection({ title:title.trim(), disciplineA:a, disciplineB:b, relation, rationale:why.trim(), question:prompt.trim(), questionId:saved.startsWith("LINK:")?saved.slice(5)||undefined:undefined });
    setTitle(""); setWhy(""); setPrompt(""); setSaved("Your connection has been saved.");
  };
  const visible = filter === "All" ? data.connections : data.connections.filter(x => x.disciplineA === filter || x.disciplineB === filter);
  const disciplines = ["All", "Physics", "Mathematics", "Biology", "Computing", "Engineering", "Economics", "Design", "Philosophy", "Music and acoustics", "Thermodynamics", "Control engineering", "Graph theory", "Operations research", "Computer science"];
  return <>
    <PageHead eyebrow="02 / INTERDISCIPLINARY EXPLORATION" title="Follow the connection." desc="A concept becomes more powerful when you understand where else it applies—and where the analogy stops."/>
    <div className="connection-intro"><div className="connection-intro-copy"><small>THE VESPER METHOD</small><h2>Do not stop at the border<br/><em>of a discipline.</em></h2><p>Connections are not decorative lines. Each one should explain a shared mechanism, a useful application, a prerequisite or a meaningful contrast. Record the reason, not just the association.</p></div><div className="connection-orbit" aria-hidden="true"><span>STEM</span><i className="orbit-a">SYSTEMS</i><i className="orbit-b">IDEAS</i><i className="orbit-c">METHODS</i></div></div>
    <div className="section-line"><div><small>STARTER INVESTIGATIONS</small><h2>Connections worth exploring</h2></div><span>EXAMPLES · NOT UNIVERSAL EQUIVALENCES</span></div>
    <div className="connection-seeds">{connectionSeeds.map((x,i)=><article className="connection-card" key={x.title}><div className="connection-card-top"><span>0{i+1} / CROSS-DISCIPLINE</span><span>{x.relation.toUpperCase()}</span></div><h3>{x.title}</h3><div className="discipline-pair"><span>{x.a}</span><b>↔</b><span>{x.b}</span></div><p>{x.why}</p><div className="connection-question">QUESTION TO PURSUE <b>{x.prompt}</b></div><button className="button outline" onClick={()=>add(x)}><Plus size={14}/> Add to my map</button></article>)}</div>
    <div className="section-line"><div><small>YOUR KNOWLEDGE SYSTEM</small><h2>Saved connections</h2></div><span>{data.connections.length} LINKS RECORDED</span></div>
    <div className="connection-toolbar"><label className="field"><span>Filter by discipline</span><select value={filter} onChange={e=>setFilter(e.target.value)}>{disciplines.map(d=><option key={d}>{d}</option>)}</select></label><span>Saved locally in this browser</span></div>
    {visible.length ? <div className="connection-saved-list">{visible.map(x=><article className="connection-saved" key={x.id}><div className="connection-saved-nodes"><span>{x.disciplineA}</span><b>{x.relation}</b><span>{x.disciplineB}</span></div><div><h3>{x.title}</h3><p>{x.rationale}</p>{x.question&&<small>INQUIRY · {x.question}</small>}</div></article>)}</div> : <Empty title="Your map begins with a meaningful link." desc="Add one of the cross-disciplinary examples above, or define a connection of your own."/>}
    <div className="section-line"><div><small>CONTRIBUTE YOUR OWN THINKING</small><h2>Record a connection</h2></div></div>
    <form className="connection-form" onSubmit={submit}>
      <label className="field"><span>Connection title</span><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Phase transitions and network cascades" required/></label>
      <label className="field"><span>Attach to a question (optional)</span><select value={saved.startsWith("LINK:")?saved.slice(5):""} onChange={e=>setSaved("LINK:"+e.target.value)}><option value="">No linked question</option>{data.questions.map(q=><option key={q.id} value={q.id}>{q.title}</option>)}</select></label><div className="connection-form-grid"><label className="field"><span>Discipline one</span><select value={a} onChange={e=>setA(e.target.value)}>{disciplines.slice(1).map(d=><option key={d}>{d}</option>)}</select></label><label className="field"><span>Discipline two</span><select value={b} onChange={e=>setB(e.target.value)}>{disciplines.slice(1).map(d=><option key={d}>{d}</option>)}</select></label><label className="field"><span>Relationship</span><select value={relation} onChange={e=>setRelation(e.target.value)}>{["prerequisite","explains","applies to","analogous to","contrasts with","derived from","extends"].map(r=><option key={r}>{r}</option>)}</select></label></div>
      <label className="field"><span>Why does this connection matter?</span><textarea value={why} onChange={e=>setWhy(e.target.value)} placeholder="Describe the shared mechanism, application, dependency or difference. State where the comparison has limits." required/></label>
      <label className="field"><span>Question this connection helps investigate (optional)</span><input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="What new question becomes possible?"/></label>
      <div className="connection-form-actions"><span>{saved}</span><button className="button primary" type="submit"><Plus size={14}/> Save connection</button></div>
    </form>
  </>;
}

function Knowledge() {
  const {data}=useWorkspace();const nodes=[...data.questions.map(x=>({title:x.title,type:"QUESTION"})),...data.concepts.map(x=>({title:x.title,type:"CONCEPT"})),...data.paths.map(x=>({title:x.title,type:"PATH"})),...data.investigations.map(x=>({title:x.title,type:"INQUIRY"})),...data.projects.map(x=>({title:x.title,type:"PROJECT"})),...data.resources.map(x=>({title:x.title,type:"SOURCE"})),...data.connections.map(x=>({title:x.title,type:"CONNECTION"}))];
  return <><PageHead eyebrow="09 / CONNECTIONS" title="Knowledge graph" desc="A map of the questions, concepts, investigations and work you have recorded."/><div className="graph-panel"><div className="graph-toolbar"><span>WORKSPACE RELATIONSHIPS</span><span>{nodes.length} RECORDS</span></div>{nodes.length?<div className="graph-cloud">{nodes.map((x,i)=><div className={"graph-node node-"+(i%5)} key={x.type+x.title}><small>{x.type}</small><b>{x.title}</b></div>)}</div>:<Empty title="Your knowledge map is waiting." desc="Create questions, concepts, paths, investigations and projects. They will appear here as your workspace grows."/>}<div className="graph-legend"><span><i className="q"/> QUESTIONS</span><span><i className="c"/> CONCEPTS</span><span><i className="p"/> PROJECTS</span><span><i/> CONNECTIONS</span><span>CONNECTION RECORDS INCLUDE DISCIPLINES, RELATION TYPE AND RATIONALE</span></div><Link className="button outline" to="/workspace/connections">Explore and edit connections <ArrowUpRight size={14}/></Link></div></>;
}
function Recall() {
  const {data,addRecall,updateRecall}=useWorkspace();const form=useModalForm("Queue a concept for recall",f=>addRecall({title:String(f.get("title")),dueAt:String(f.get("dueAt")||new Date(Date.now()+86400000).toISOString().slice(0,10)),lastResult:"Not reviewed"}),<><Field name="title" label="Concept to revisit" placeholder="Name the idea" required/><Field name="dueAt" label="Next review date" placeholder="YYYY-MM-DD"/></>);
  return <><PageHead eyebrow="10 / RETENTION" title="Recall practice" desc="Try to reconstruct the idea before you return to the source." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Queue concept</Button>}/><div className="recall-list">{data.recall.map(x=><div className="recall-row" key={x.id}><div><small>NEXT REVISIT · {new Date(x.dueAt).toLocaleDateString()}</small><h3>{x.title}</h3><p>{x.lastResult}</p></div><Button onClick={()=>{const result=prompt("What could you recall? What needs repair?");if(result)updateRecall(x.id,{lastResult:result,dueAt:new Date(Date.now()+3*86400000).toISOString()});}}>Record recall</Button></div>)}</div>{!data.recall.length&&<Empty title="Choose an idea worth revisiting." desc="Schedule a concept, attempt to reconstruct it later, and record what you remembered." action={<Button variant="primary" onClick={form.open}><Plus size={15}/> Queue concept</Button>}/>}{form.modal}</>;
}
function SettingsPage() {
  const {data,setName,exportData,importData,clear}=useWorkspace();const [name,setLocalName]=useState(data.profile.name);const [message,setMessage]=useState("");
  return <><PageHead eyebrow="WORKSPACE / SETTINGS" title="Settings & data" desc="Your workspace belongs to you. Keep a backup and understand where data lives."/><div className="settings-grid"><form className="settings-card" onSubmit={e=>{e.preventDefault();setName(name);setMessage("Profile saved.");}}><small>PROFILE</small><h3>Workspace identity</h3><label className="field"><span>Display name</span><input value={name} onChange={e=>setLocalName(e.target.value)} placeholder="Optional"/></label><Button type="submit" variant="primary">Save profile</Button>{message&&<p>{message}</p>}</form><div className="settings-card"><small>PORTABILITY</small><h3>Export or restore</h3><p>Download a JSON backup or restore a previous Vesper workspace.</p><div className="settings-actions"><Button variant="primary" onClick={exportData}>Export workspace <ArrowUpRight size={14}/></Button><label className="button outline">Import backup<input type="file" accept="application/json,.json" hidden onChange={e=>{const f=e.target.files?.[0];if(f)importData(f).then(()=>setMessage("Workspace restored.")).catch(()=>setMessage("This file could not be imported."));}}/></label></div>{message&&<p>{message}</p>}</div><div className="settings-card full"><small>STORAGE MODEL</small><h3>Local-first by design</h3><p>In this release, your workspace is stored in this browser. There are no accounts, cloud sync, collaboration or server-side learner profiles. Clearing browser data can erase your work. Export backups regularly. Exported JSON files are not encrypted; store them carefully.</p><Button variant="outline" onClick={()=>{if(confirm("Delete all Vesper workspace data from this browser? This cannot be undone unless you exported a backup."))clear();}}>Clear local workspace</Button></div></div></>;
}
function WorkspaceRouter() {
  return <Shell><AnimatePresence mode="wait"><motion.div key={useLocation().pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.16}}><Routes><Route index element={<Overview/>}/><Route path="questions" element={<Questions/>}/><Route path="questions/:id" element={<QuestionWorkbench/>}/><Route path="connections" element={<Connections/>}/><Route path="paths" element={<Paths/>}/><Route path="studio" element={<Studio/>}/><Route path="investigations" element={<Investigations/>}/><Route path="models" element={<Models/>}/><Route path="projects" element={<Projects/>}/><Route path="library" element={<Library/>}/><Route path="journal" element={<Journal/>}/><Route path="knowledge" element={<Knowledge/>}/><Route path="recall" element={<Recall/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="*" element={<Overview/>}/></Routes></motion.div></AnimatePresence></Shell>;
}
export default function App() {
  const {exportData}=useWorkspace();
  useEffect(()=>{const fn=()=>exportData();document.addEventListener("vesper:export",fn);return()=>document.removeEventListener("vesper:export",fn);},[exportData]);
  return <Routes><Route path="/" element={<Landing/>}/><Route path="/workspace/*" element={<WorkspaceRouter/>}/><Route path="*" element={<Landing/>}/></Routes>;
}