/**
 * 项目状态管理
 * 内部使用 slice 模式，外部保持原有 API 完全兼容
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { ProjectData } from '@/shared/types/project';
import { createDebouncedStorage } from '@/stores/middlewares/persistWithDebounce';
import { createCurrentProjectSlice } from '@/stores/slices/currentProjectSlice';
import { createProjectSlice } from '@/stores/slices/projectSlice';

export const INITIAL_DEMO_PROJECTS: ProjectData[] = [
  {
    id: 'proj-demo-1',
    name: '星际漫游者',
    description: '太空赛博朋克 4K 高清动画工程，包含 18 帧分镜与双声道配音音轨。',
    status: 'processing',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-demo-2',
    name: '花季学园',
    description: '唯美二次元学园漫剧，全 12 集，4K 超清 60fps 运镜插帧。',
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-demo-3',
    name: '武士传说',
    description: '国漫风武侠打斗视听工程，高保真微动视差与打斗粒子特效。',
    status: 'processing',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-demo-4',
    name: '赛博修仙',
    description: '2099 年数字元神侵入天道服务器，反抗脑机修仙财阀。',
    status: 'processing',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export interface ProjectState {
  // 项目列表
  projects: ProjectData[];

  // 当前项目
  currentProject: ProjectData | null;

  // Computed
  recentProjects: () => ProjectData[];

  // Actions
  createProject: (project: Partial<ProjectData>) => ProjectData;
  updateProject: (id: string, updates: Partial<ProjectData>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: ProjectData | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => {
      const projectSlice = createProjectSlice(set, get);
      const currentProjectSlice = createCurrentProjectSlice(set);

      return {
        // Initial state with 4 demo projects matching Gemini UI
        projects: INITIAL_DEMO_PROJECTS,
        currentProject: INITIAL_DEMO_PROJECTS[0],

        // Computed
        recentProjects: projectSlice.recentProjects,

        // Project actions
        createProject: projectSlice.createProject,
        updateProject: projectSlice.updateProject,
        deleteProject: projectSlice.deleteProject,

        // Current project
        setCurrentProject: currentProjectSlice.setCurrentProject,
      };
    },
    {
      name: 'novella-project-storage',
      storage: createJSONStorage(() => createDebouncedStorage(localStorage, 1500)),
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
);
