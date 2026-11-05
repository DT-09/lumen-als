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
  const edgeIds = new Set<string>();
  const disciplineIds = new Map<string, string>();

  const addNode = (node: KnowledgeNode) => {
    if (nodeIds.has(node.id)) return;
    nodeIds.add(node.id);
    nodes.push(node);
  };
  const addEdge = (source: string, target: string, relation: string) => {
    if (source === target || !nodeIds.has(source) || !nodeIds.has(target)) return;
    const id = source + ">" + target + ":" + relation;
    if (edgeIds.has(id)) return;
    edgeIds.add(id);
    edges.push({ id, source, target, relation });
  };

  workspace.questions.forEach(item => addNode({
    id: "question:" + item.id,
    label: item.title,
    kind: "question",
    href: "/workspace/questions/" + item.id
  }));

  workspace.concepts.forEach(item => addNode({
    id: "concept:" + item.id,
    label: item.title,
    kind: "concept",
    href: "/workspace/studio"
  }));

  workspace.paths.forEach(item => addNode({
    id: "path:" + item.id,
    label: item.title,
    kind: "path",
    href: "/workspace/paths"
  }));

  workspace.investigations.forEach(item => addNode({
    id: "investigation:" + item.id,
    label: item.title,
    kind: "investigation",
    href: "/workspace/investigations"
  }));

  workspace.projects.forEach(item => addNode({
    id: "project:" + item.id,
    label: item.title,
    kind: "project",
    href: "/workspace/projects"
  }));

  workspace.resources.forEach(item => addNode({
    id: "resource:" + item.id,
    label: item.title,
    kind: "resource",
    href: "/workspace/library"
  }));

  const getDiscipline = (label: string) => {
    const clean = label.trim() || "Unspecified";
    const key = slug(clean) || "unspecified";
    const existing = disciplineIds.get(key);
    if (existing) return existing;
    const id = "discipline:" + key;
    disciplineIds.set(key, id);
    addNode({ id, label: clean, kind: "discipline", href: "/workspace/connections" });
    return id;
  };

  workspace.connections.forEach(item => addNode({
    id: "connection:" + item.id,
    label: item.title,
    kind: "connection",
    href: "/workspace/connections"
  }));

  // Explicit record relationships only. The graph never invents semantic links.
  workspace.concepts.forEach(item => {
    if (item.questionId) addEdge("concept:" + item.id, "question:" + item.questionId, "develops");
    if (item.pathId) addEdge("concept:" + item.id, "path:" + item.pathId, "belongs to");
  });

  workspace.paths.forEach(item => {
    if (item.questionId) addEdge("path:" + item.id, "question:" + item.questionId, "supports");
    item.steps.forEach((step, index) => {
      if (step.conceptId) addEdge("path:" + item.id, "concept:" + step.conceptId, "step " + (index + 1));
    });
  });

  workspace.investigations.forEach(item => {
    if (item.questionId) addEdge("investigation:" + item.id, "question:" + item.questionId, "examines");
  });

  workspace.projects.forEach(item => {
    if (item.questionId) addEdge("project:" + item.id, "question:" + item.questionId, "produces work for");
  });

  workspace.connections.forEach(item => {
    const id = "connection:" + item.id;
    const a = getDiscipline(item.disciplineA);
    const b = getDiscipline(item.disciplineB);
    addEdge(a, id, item.relation || "connects");
    addEdge(id, b, "extends to");
    if (item.questionId) addEdge(id, "question:" + item.questionId, "informs");
  });

  const connectedQuestionCount = new Set(
    edges.flatMap(edge => {
      const matches = [edge.source, edge.target].filter(id => id.startsWith("question:"));
      return matches;
    })
  ).size;

  return { nodes, edges, connectedQuestionCount };
}
