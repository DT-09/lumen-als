import type { VesperWorkspace } from "./types";

export interface LairPulse {
  questions: number;
  concepts: number;
  investigations: number;
  projects: number;
  resources: number;
  connections: number;
  masteryEvidence: number;
  uncertainConcepts: number;
  overdueRecall: number;
  openInvestigations: number;
  totalRecords: number;
}

export interface EchoSignal {
  id: string;
  mode: "discover" | "understand" | "investigate" | "create" | "reflect";
  title: string;
  detail: string;
  action: string;
  href: string;
  reason: string;
}

export interface LairMission {
  title: string;
  updatedAt: string;
  completed: boolean;
}

const MISSION_KEY = "vesper.lair.mission.v1";
const DAY = 86_400_000;
const timestamp = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function deriveLairPulse(workspace: VesperWorkspace): LairPulse {
  const masteryEvidence = workspace.concepts.filter(
    concept => concept.status === "understood" && concept.confidence >= 3
  ).length;
  const uncertainConcepts = workspace.concepts.filter(
    concept => concept.status === "uncertain" || concept.status === "unseen" || concept.confidence <= 1
  ).length;
  const overdueRecall = workspace.recall.filter(item => timestamp(item.dueAt) <= Date.now()).length;
  const openInvestigations = workspace.investigations.filter(item => item.status !== "complete").length;

  return {
    questions: workspace.questions.length,
    concepts: workspace.concepts.length,
    investigations: workspace.investigations.length,
    projects: workspace.projects.length,
    resources: workspace.resources.length,
    connections: workspace.connections.length,
    masteryEvidence,
    uncertainConcepts,
    overdueRecall,
    openInvestigations,
    totalRecords:
      workspace.questions.length +
      workspace.concepts.length +
      workspace.connections.length +
      workspace.paths.length +
      workspace.investigations.length +
      workspace.resources.length +
      workspace.projects.length +
      workspace.journal.length +
      workspace.recall.length
  };
}

/**
 * ECHO is deterministic local guidance. It reads learner-authored records and
 * ranks concrete next actions. It does not call an AI model, browse the web,
 * validate sources, or certify mastery.
 */
export function deriveEchoSignals(workspace: VesperWorkspace): EchoSignal[] {
  const pulse = deriveLairPulse(workspace);
  const candidates: Array<EchoSignal & { priority: number }> = [];
  const push = (signal: EchoSignal, priority: number) => candidates.push({ ...signal, priority });
  const questionsWithoutStructure = workspace.questions.filter(question =>
    !workspace.paths.some(path => path.questionId === question.id) &&
    !workspace.concepts.some(concept => concept.questionId === question.id)
  );
  const investigationsWithoutObservations = workspace.investigations.filter(
    investigation => investigation.status !== "complete" && investigation.observations.length === 0
  );
  const projectsWithoutEvidence = workspace.projects.filter(project =>
    !workspace.resources.some(resource =>
      resource.contribution.toLowerCase().includes(project.title.toLowerCase()) ||
      project.description.toLowerCase().includes(resource.title.toLowerCase())
    )
  );
  const overdue = workspace.recall.filter(item => timestamp(item.dueAt) <= Date.now());

  if (pulse.questions === 0) {
    push({
      id: "first-question", mode: "discover",
      title: "Give curiosity a precise starting point",
      detail: "Capture a question, phenomenon or problem. Record what prompted it and what a useful answer would let you explain or do.",
      action: "Open Echolocation", href: "/workspace/questions",
      reason: "There are no learner-defined questions in the workspace."
    }, 100);
  }

  if (questionsWithoutStructure.length > 0) {
    const question = questionsWithoutStructure[0];
    push({
      id: "structure-" + question.id, mode: "understand",
      title: "Give a question its first learning route",
      detail: "Identify the concepts, mathematical tools and assumptions beneath this question. Keep the route editable as your understanding changes.",
      action: "Build a Flight Path", href: "/workspace/paths",
      reason: "“" + question.title + "” has no linked path or concept yet."
    }, 92);
  }

  if (pulse.uncertainConcepts > 0) {
    const concept = workspace.concepts.find(item =>
      item.status === "uncertain" || item.status === "unseen" || item.confidence <= 1
    );
    if (concept) push({
      id: "repair-" + concept.id, mode: "understand",
      title: "Repair an uncertain concept",
      detail: "Try to explain the idea without notes. Mark the exact step that breaks down, then revise the explanation with an example or derivation.",
      action: "Open Mastery Studio", href: "/workspace/studio",
      reason: "“" + concept.title + "” is recorded as uncertain or low-confidence."
    }, 96);
  }

  if (overdue.length > 0) {
    const item = overdue.sort((a, b) => timestamp(a.dueAt) - timestamp(b.dueAt))[0];
    push({
      id: "recall-" + item.id, mode: "reflect",
      title: "Reconstruct an idea due for review",
      detail: "Attempt recall before reopening the source. Record what you could reproduce, what failed and what needs another pass.",
      action: "Open Recall Practice", href: "/workspace/recall",
      reason: overdue.length + " recall item" + (overdue.length === 1 ? " is" : "s are") + " due."
    }, 98);
  }

  if (investigationsWithoutObservations.length > 0) {
    const investigation = investigationsWithoutObservations[0];
    push({
      id: "observe-" + investigation.id, mode: "investigate",
      title: "Move an investigation beyond its hypothesis",
      detail: "Record an observation and its source. Keep the observation separate from your interpretation, and note what would challenge the hypothesis.",
      action: "Open the Investigation Chamber", href: "/workspace/investigations",
      reason: "“" + investigation.title + "” has no observations recorded."
    }, 88);
  }

  if (pulse.questions > 0 && pulse.connections === 0) {
    push({
      id: "connect-disciplines", mode: "discover",
      title: "Find a useful connection beyond the subject boundary",
      detail: "Look for a shared mechanism, prerequisite, method or contrast. Explain why the relationship matters and where the comparison stops working.",
      action: "Explore Echo Trails", href: "/workspace/connections",
      reason: "Questions exist, but no cross-disciplinary relationship has been recorded."
    }, 72);
  }

  if (pulse.concepts > 0 && pulse.projects === 0) {
    push({
      id: "make-an-artifact", mode: "create",
      title: "Make understanding inspectable",
      detail: "Turn a concept into a derivation, model, simulation, technical explanation, experiment or prototype. Choose an output that tests your understanding.",
      action: "Open the Creation Workshop", href: "/workspace/projects",
      reason: "Concepts are recorded, but no original project has been started."
    }, 68);
  }

  if (workspace.projects.length > 0 && pulse.resources === 0) {
    push({
      id: "source-trail", mode: "investigate",
      title: "Preserve the evidence behind your work",
      detail: "Attach the papers, books, datasets or documentation that informed a project. Record what each source contributes and its limitations.",
      action: "Open Research Archive", href: "/workspace/library",
      reason: "Projects exist, but the research archive is empty."
    }, 66);
  }

  if (workspace.paths.some(path => path.steps.some(step => !step.done))) {
    const path = workspace.paths.find(item => item.steps.some(step => !step.done));
    if (path) {
      const remaining = path.steps.filter(step => !step.done).length;
      push({
        id: "continue-path-" + path.id, mode: "understand",
        title: "Continue a learning route",
        detail: "Choose the next unfinished step, check whether its prerequisites are genuinely needed, and revise the sequence if the route no longer fits.",
        action: "Open Flight Paths", href: "/workspace/paths",
        reason: "“" + path.title + "” has " + remaining + " unfinished step" + (remaining === 1 ? "" : "s") + "."
      }, 62);
    }
  }

  if (pulse.totalRecords > 0 && workspace.journal.length === 0) {
    push({
      id: "first-reflection", mode: "reflect",
      title: "Write down what changed in your thinking",
      detail: "Record one useful discovery, one unresolved uncertainty and the next action. A short field note makes it easier to resume later.",
      action: "Open Field Notes", href: "/workspace/journal",
      reason: "Work exists, but no reflection has been preserved."
    }, 48);
  }

  if (candidates.length === 0) {
    push({
      id: "review-and-refine", mode: "reflect",
      title: "Choose the next meaningful challenge",
      detail: "Review your knowledge map. Find a weak link, an unanswered question or an idea that could become a model or investigation.",
      action: "Open Knowledge Network", href: "/workspace/knowledge",
      reason: "No higher-priority gap was detected in the current local records."
    }, 30);
  }

  const seen = new Set<string>();
  return candidates
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))
    .filter(signal => {
      const key = signal.mode + ":" + signal.href;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3)
    .map(({ priority: _priority, ...signal }) => signal);
}

export function readLairMission(): LairMission | null {
  try {
    const raw = window.localStorage.getItem(MISSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LairMission>;
    if (typeof parsed.title !== "string" || !parsed.title.trim()) return null;
    return {
      title: parsed.title,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      completed: Boolean(parsed.completed)
    };
  } catch {
    return null;
  }
}

export function writeLairMission(mission: LairMission | null): void {
  try {
    if (!mission) window.localStorage.removeItem(MISSION_KEY);
    else window.localStorage.setItem(MISSION_KEY, JSON.stringify(mission));
  } catch {
    // Private browsing or storage quotas must not break the learning workspace.
  }
}
