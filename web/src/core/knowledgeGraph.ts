import type { VesperWorkspace } from "./types";

export type KnowledgeNodeKind =
  | "question" | "concept" | "path" | "investigation"
  | "project" | "resource" | "connection" | "discipline";

export interface KnowledgeNode {
  id: string;
  label: string;
  kind: KnowledgeNodeKind;
  href: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  connectedQuestionCount: number;
}

const slug = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function buildKnowledgeGraph(workspace: VesperWorkspace): KnowledgeGraph {
  const nodes: KnowledgeNode[] = [];
  const edges: KnowledgeEdge[] = [];
  const nodeIds = new Set<string>();
  const disciplineIds = new Map<string, string>();

  const addNode = (node: KnowledgeNode) => {
    if (nodeIds.has(node.id)) return;
    nodeIds.add(node.id);
    nodes.push(node);
  };
  const addEdge = (source: string, target: string, relation: string) => {
    if (source === target || !nodeIds.has(source) || !nodeIds.has(target)) return;
    const id = source + ">" + target + ":" + relation;
    if (!edges.some(edge => edge.id === id)) edges.push({ id, source, target, relation });
  };
  const questionHref = (id?: string) => id ? "/workspace/questions/" + id : "";

  workspace.questions.forEach(item => addNode({
    id: "question:" + item.id, label: item.title, kind: "question",
    href: questionHref(item.id)
  }));
  workspace.concepts.forEach(item => {
    const id = "concept:" + item.id;
    addNode({ id, label: item.title, kind: "concept", href: "/workspace/studio" });
    if (item.questionId) addEdge(id, "question:" + item.questionId, "develops");
  });
  workspace.paths.forEach(item => {
    const id = "path:" + item.id;
    addNode({ id, label: item.title, kind: "path", href: "/workspace/paths" });
    if (item.questionId) addEdge(id, "question:" + item.questionId, "supports");
  });
  workspace.investigations.forEach(item => {
    const id = "investigation:" + item.id;
    addNode({ id, label: item.title, kind: "investigation", href: "/workspace/investigations" });
    if (item.questionId) addEdge(id, "question:" + item.questionId, "examines");
  });
  workspace.projects.forEach(item => {
    const id = "project:" + item.id;
    addNode({ id, label: item.title, kind: "project", href: "/workspace/projects" });
    if (item.questionId) addEdge(id, "question:" + item.questionId, "produces work for");
  });
  workspace.resources.forEach(item => addNode({
    id: "resource:" + item.id, label: item.title, kind: "resource", href: "/workspace/library"
  }));

  const getDiscipline = (label: string) => {
    const key = slug(label) || "unspecified";
    const existing = disciplineIds.get(key);
    if (existing) return existing;
    const id = "discipline:" + key;
    disciplineIds.set(key, id);
    addNode({ id, label, kind: "discipline", href: "/workspace/connections" });
    return id;
  };

  workspace.connections.forEach(item => {
    const id = "connection:" + item.id;
    addNode({ id, label: item.title, kind: "connection", href: "/workspace/connections" });
    const a = getDiscipline(item.disciplineA);
    const b = getDiscipline(item.disciplineB);
    addEdge(a, id, item.relation || "connects");
    addEdge(id, b, "extends to");
    if (item.questionId) addEdge(id, "question:" + item.questionId, "informs");
  });

  const connectedQuestionCount = new Set(
    edges.map(edge => edge.target).filter(id => id.startsWith("question:"))
  ).size;

  return { nodes, edges, connectedQuestionCount };
}
