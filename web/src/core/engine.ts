import type { VesperWorkspace } from "./types";

export interface LairPulse {
  questions: number;
  concepts: number;
  investigations: number;
  projects: number;
  resources: number;
  connections: number;
  masteryEvidence: number;
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

export function deriveLairPulse(workspace: VesperWorkspace): LairPulse {
  const masteryEvidence = workspace.concepts.filter(
    concept => concept.status === "understood" && concept.confidence >= 3
  ).length;
  return {
    questions: workspace.questions.length,
    concepts: workspace.concepts.length,
    investigations: workspace.investigations.length,
    projects: workspace.projects.length,
    resources: workspace.resources.length,
    connections: workspace.connections.length,
    masteryEvidence,
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
 * ECHO is a deterministic, local guidance engine in this release.
 * It uses the learner's own workspace records; it does not call an AI model,
 * search the web, validate sources, or claim that a learner has mastered a topic.
 */
export function deriveEchoSignals(workspace: VesperWorkspace): EchoSignal[] {
  const signals: EchoSignal[] = [];
  const pulse = deriveLairPulse(workspace);

  if (pulse.questions === 0) {
    signals.push({
      id: "first-question",
      mode: "discover",
      title: "Give your curiosity a starting point",
      detail: "Capture a question, phenomenon or problem. You do not need a grade level or a completed prerequisite course to begin.",
      action: "Open Echolocation",
      href: "/workspace/questions",
      reason: "No investigations have been recorded yet."
    });
  } else if (pulse.concepts === 0 && workspace.paths.length === 0) {
    signals.push({
      id: "map-foundations",
      mode: "understand",
      title: "Map the ideas beneath a question",
      detail: "Choose the concepts and mathematical foundations that could help you investigate your question. Treat the route as editable, not compulsory.",
      action: "Build a Flight Path",
      href: "/workspace/paths",
      reason: "Questions exist, but no concepts or learning paths are linked yet."
    });
  }

  if (pulse.questions > 0 && pulse.investigations === 0) {
    signals.push({
      id: "test-a-claim",
      mode: "investigate",
      title: "Turn one idea into a testable inquiry",
      detail: "Write a hypothesis, decide what evidence would challenge it, and keep observations separate from interpretation.",
      action: "Open the Investigation Chamber",
      href: "/workspace/investigations",
      reason: "There are questions to pursue but no investigation records."
    });
  }

  if (pulse.connections === 0 && pulse.questions > 0) {
    signals.push({
      id: "connect-disciplines",
      mode: "discover",
      title: "Look for a useful cross-disciplinary connection",
      detail: "Find a shared mechanism, prerequisite, method or contrast. Record why the relationship matters and where it stops being useful.",
      action: "Explore Echo Trails",
      href: "/workspace/connections",
      reason: "No interdisciplinary relationships have been recorded."
    });
  }

  if (pulse.projects === 0 && (pulse.concepts > 0 || pulse.investigations > 0)) {
    signals.push({
      id: "make-an-artifact",
      mode: "create",
      title: "Convert understanding into an artefact",
      detail: "A model, simulation, research note, technical explanation or prototype makes your thinking inspectable.",
      action: "Open the Creation Workshop",
      href: "/workspace/projects",
      reason: "Learning records exist, but no original output has been started."
    });
  }

  if (pulse.resources === 0 && (pulse.investigations > 0 || pulse.projects > 0)) {
    signals.push({
      id: "source-trail",
      mode: "reflect",
      title: "Preserve the evidence trail",
      detail: "Add the books, papers, datasets or lectures that informed your work. Record their contribution and limitations.",
      action: "Open Research Archive",
      href: "/workspace/library",
      reason: "Research or project work exists without saved source records."
    });
  }

  if (signals.length < 3) {
    signals.push({
      id: "review-and-refine",
      mode: "reflect",
      title: "Make the next return easier",
      detail: "Write down what changed in your understanding, what remains uncertain and the smallest useful next action.",
      action: "Open Field Notes",
      href: "/workspace/journal",
      reason: "Reflection helps preserve context between sessions."
    });
  }

  return signals.slice(0, 3);
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
