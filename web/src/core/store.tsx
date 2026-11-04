import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { VesperWorkspace, Question, LearningPath, Investigation, Resource, Project, JournalEntry, RecallItem, Concept } from "./types";

const STORAGE_KEY = "vesper.workspace.v1";
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID ? crypto.randomUUID() : "v-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
const blank = (): VesperWorkspace => ({ version: 1, profile: { name: "" }, questions: [], concepts: [], paths: [], sessions: [], investigations: [], resources: [], projects: [], journal: [], recall: [] });

function migrate(raw: unknown): VesperWorkspace {
  const value = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  if (value.version === 1) return { ...blank(), ...value } as VesperWorkspace;
  const old = value as any;
  const next = blank();
  next.profile.name = old.profile?.name || "";
  next.questions = (old.questions || []).map((x: any) => ({ id: x.id || uid(), createdAt: x.createdAt || now(), updatedAt: x.updatedAt || x.createdAt || now(), title: x.title || x.question || "Untitled question", motivation: x.why || "", field: x.area || "", known: x.known || "", scope: x.answer || "", status: x.status || "active" }));
  next.paths = (old.routes || []).map((x: any) => ({ id: x.id || uid(), createdAt: x.createdAt || now(), updatedAt: now(), title: x.title || "Untitled path", objective: x.goal || "", questionId: x.questionId, steps: (x.steps || []).map((s: any) => typeof s === "string" ? ({ id: uid(), createdAt: now(), updatedAt: now(), title: s, description: "", done: false }) : ({ id: uid(), createdAt: now(), updatedAt: now(), title: s.text || s.title || "Concept", description: "", done: !!s.done })), status: "active" }));
  next.investigations = (old.investigations || []).map((x: any) => ({ ...x, id: x.id || uid(), createdAt: x.createdAt || now(), updatedAt: x.updatedAt || now(), observations: x.observations || [], status: x.status || "active" }));
  next.resources = old.resources || [];
  next.projects = (old.works || []).map((x: any) => ({ ...x, kind: x.type || "Project", question: x.question || "", description: x.description || "", status: x.status || "active" }));
  next.journal = old.journal || [];
  next.recall = old.recall || [];
  return next;
}

type StoreApi = {
  data: VesperWorkspace;
  addQuestion: (x: Omit<Question, "id" | "createdAt" | "updatedAt">) => void;
  addConcept: (x: Omit<Concept, "id" | "createdAt" | "updatedAt">) => void;
  addPath: (x: Omit<LearningPath, "id" | "createdAt" | "updatedAt">) => void;
  updatePath: (id: string, patch: Partial<LearningPath>) => void;
  addInvestigation: (x: Omit<Investigation, "id" | "createdAt" | "updatedAt" | "observations">) => void;
  addObservation: (id: string, x: Omit<Investigation["observations"][number], "id" | "createdAt" | "updatedAt">) => void;
  addResource: (x: Omit<Resource, "id" | "createdAt" | "updatedAt">) => void;
  addProject: (x: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  addJournal: (x: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void;
  addRecall: (x: Omit<RecallItem, "id" | "createdAt" | "updatedAt">) => void;
  updateRecall: (id: string, patch: Partial<RecallItem>) => void;
  setName: (name: string) => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  clear: () => void;
};
const StoreContext = createContext<StoreApi | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<VesperWorkspace>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("vesper-workspace-v3"); return raw ? migrate(JSON.parse(raw)) : blank(); }
    catch { return blank(); }
  });
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (error) { console.error("Vesper could not persist workspace data", error); } }, [data]);
  const add = useCallback(<T extends { id: string; createdAt: string; updatedAt: string }>(key: keyof VesperWorkspace, value: Omit<T, "id" | "createdAt" | "updatedAt">) => {
    const stamp = now(); setData(prev => ({ ...prev, [key]: [...(prev[key] as T[]), { ...value, id: uid(), createdAt: stamp, updatedAt: stamp }] }));
  }, []);
  const api = useMemo<StoreApi>(() => ({
    data,
    addQuestion: x => add("questions", x),
    addConcept: x => add("concepts", x),
    addPath: x => add("paths", { ...x, steps: x.steps.map(s => ({ ...s, id: s.id || uid(), createdAt: now(), updatedAt: now() })) }),
    updatePath: (id, patch) => setData(p => ({ ...p, paths: p.paths.map(x => x.id === id ? { ...x, ...patch, updatedAt: now() } : x) })),
    addInvestigation: x => add("investigations", { ...x, observations: [] }),
    addObservation: (id, x) => setData(p => ({ ...p, investigations: p.investigations.map(v => v.id === id ? { ...v, observations: [...v.observations, { ...x, id: uid(), createdAt: now(), updatedAt: now() }], updatedAt: now() } : v) })),
    addResource: x => add("resources", x),
    addProject: x => add("projects", x),
    addJournal: x => add("journal", x),
    addRecall: x => add("recall", x),
    updateRecall: (id, patch) => setData(p => ({ ...p, recall: p.recall.map(x => x.id === id ? { ...x, ...patch, updatedAt: now() } : x) })),
    setName: name => setData(p => ({ ...p, profile: { name } })),
    exportData: () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "vesper-workspace-" + new Date().toISOString().slice(0, 10) + ".json"; a.click(); URL.revokeObjectURL(a.href); },
    importData: async file => { const parsed = migrate(JSON.parse(await file.text())); setData(parsed); },
    clear: () => setData(blank())
  }), [data, add]);
  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}
export function useWorkspace() { const value = useContext(StoreContext); if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider"); return value; }