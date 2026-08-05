/**
 * Single source of truth for storage keys used by the persistence layer.
 *
 * 集中定义项目用到的所有 localStorage / zustand-persist key；
 * 这样后续迁移、新增、废弃 key 都有统一出口，避免散落在多处导致拼写漂移。
 */
export const STORAGE_KEYS = {
  legacyProjects: 'STORAGE_KEYS.PROJECTS',
  legacyProjectsZustand: 'mangav-project-storage',
  projects: 'mangav:projects:v2',
  settings: 'mangav:settings:v2',
  app: 'mangav:app:v2',
  storyboard: 'mangav:storyboard:v2',
  migrationVersion: 'mangav:migration:version',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
