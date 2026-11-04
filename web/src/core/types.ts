export type RecordStatus = "active" | "paused" | "complete" | "open";
export type EntityKind = "question" | "concept" | "path" | "session" | "investigation" | "observation" | "resource" | "project" | "journal" | "recall";
export interface BaseRecord { id: string; createdAt: string; updatedAt: string; }
export interface Question extends BaseRecord { title: string; motivation: string; field: string; known: string; scope: string; status: RecordStatus; }
export interface Concept extends BaseRecord { title: string; explanation: string; confidence: number; status: "unseen" | "learning" | "uncertain" | "understood"; questionId?: string; pathId?: string; }
export interface PathStep extends BaseRecord { title: string; description: string; done: boolean; conceptId?: string; }
export interface LearningPath extends BaseRecord { title: string; objective: string; questionId?: string; steps: PathStep[]; status: RecordStatus; }
export interface LearningSession extends BaseRecord { title: string; conceptId?: string; notes: string; reflection: string; }
export interface Investigation extends BaseRecord { title: string; hypothesis: string; method: string; variables: string; limitations: string; status: RecordStatus; observations: Observation[]; }
export interface Observation extends BaseRecord { text: string; interpretation: string; source: string; }
export interface Resource extends BaseRecord { title: string; author: string; kind: string; url: string; contribution: string; limitations: string; }
export interface Project extends BaseRecord { title: string; kind: string; question: string; description: string; status: RecordStatus; }
export interface JournalEntry extends BaseRecord { title: string; body: string; mood: string; }
export interface RecallItem extends BaseRecord { title: string; dueAt: string; lastResult: string; }
export interface VesperWorkspace {
  version: 1;
  profile: { name: string };
  questions: Question[];
  concepts: Concept[];
  paths: LearningPath[];
  sessions: LearningSession[];
  investigations: Investigation[];
  resources: Resource[];
  projects: Project[];
  journal: JournalEntry[];
  recall: RecallItem[];
}
export type WorkspaceCollection = Exclude<keyof VesperWorkspace, "version" | "profile">;