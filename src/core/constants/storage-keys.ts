/**
 * Single source of truth for storage keys used by the persistence layer.
 *
 * 集中定义项目用到的所有 localStorage / zustand-persist key；
 * 这样后续迁移、新增、废弃 key 都有统一出口，避免散落在多处导致拼写漂移。
 */
export const STORAGE_KEYS = {
  legacyProjects: 'STORAGE_KEYS.PROJECTS',
  legacyProjectsZustand: 'novella-project-storage',
  projects: 'novella:projects:v2',
  settings: 'novella:settings:v2',
  app: 'novella:app:v2',
  storyboard: 'novella:storyboard:v2',
  migrationVersion: 'novella:migration:version',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
