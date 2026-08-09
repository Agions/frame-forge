import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { AudioTrackConfig } from '@/core/audio/types/audio';
import type { CompositionProject } from '@/core/audio/types/composition';
import type { ProjectData } from '@/core/project/types/project';
import type { StoryAnalysis, Character } from '@/core/script/types/novel';
import { tauriService } from '@/core/services';
import type { ScriptImportMetadata } from '@/features/storyboard/components/NovelImporter';

/** Page-local extension of canonical ProjectData with strongly-typed fields. */
export interface ProjectEditData extends ProjectData {
  name: string;
  content?: string;
  script?: string;
  novelMetadata?: ScriptImportMetadata;
}

/** 项目加载结果 — 用于初始化 ProjectEditProvider 的 state。 */
export interface ProjectLoadResult {
  name: string;
  description: string;
  content?: string;
  novelMetadata?: ScriptImportMetadata;
  storyAnalysis?: StoryAnalysis;
  storyboardFrames?: unknown[];
  storyboardComments?: unknown[];
  storyboardVersions?: unknown[];
  audioConfig?: AudioTrackConfig;
  characters?: Character[];
  composition?: CompositionProject;
  script?: string;
  exportPreset?: '9:16' | '16:9' | '1:1';
  exportSettings?: Record<string, unknown>;
  /** 根据 URL 参数或项目数据推断的初始 step */
  initialStep: number;
  /** URL 中的 frameId 参数（如有） */
  frameId?: string;
}

/**
 * 封装项目加载逻辑的 hook。
 * 仅负责读取原始数据 + 解析，返回 ProjectEditData。
 * 初始 state 注入由 ProjectEditProvider 完成。
 */
export function useProjectLoader(projectId: string | undefined): {
  loading: boolean;
  error: string | null;
  data: ProjectLoadResult | null;
} {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProjectLoadResult | null>(null);

  useEffect(() => {
    if (!projectId || data) return;

    setLoading(true);
    tauriService
      .readProjectFile(projectId)
      .then((projectText) => {
        const project = JSON.parse(projectText) as ProjectEditData;

        const search = new URLSearchParams(location.search);
        const frameId = search.get('frameId');
        const stepValue = search.get('step');

        let initialStep = 0;
        if (frameId) {
          initialStep = 3;
        } else if (stepValue) {
          const nextStep = Number(stepValue);
          if (Number.isInteger(nextStep) && nextStep >= 0 && nextStep <= 8) {
            initialStep = nextStep;
          }
        } else if (project.script) {
          initialStep = 2;
        } else if (project.content) {
          initialStep = 1;
        }

        setData({
          name: project.name,
          description: project.description ?? '',
          content: project.content,
          novelMetadata: project.novelMetadata,
          storyAnalysis: project.storyAnalysis,
          storyboardFrames: project.storyboardFrames,
          storyboardComments: project.storyboardComments,
          storyboardVersions: project.storyboardVersions,
          audioConfig: project.audioConfig,
          characters: project.characters,
          composition: project.composition,
          script: project.script,
          exportPreset: project.exportPreset,
          exportSettings: project.exportSettings,
          initialStep,
          frameId: frameId ?? undefined,
        });

        setError(null);
      })
      .catch(() => {
        // Fallback: Read from Zustand project store
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { useProjectStore } = require('@/shared/stores/project-store');
        const storeState = useProjectStore.getState();
        const fallbackProject = storeState.projects.find((p: any) => p.id === projectId) || storeState.currentProject;

        if (fallbackProject) {
          const search = new URLSearchParams(location.search);
          const frameId = search.get('frameId');
          const stepValue = search.get('step');
          let initialStep = 0;
          if (frameId) {
            initialStep = 3;
          } else if (stepValue) {
            initialStep = Number(stepValue);
          } else if (fallbackProject.script || fallbackProject.novelText) {
            initialStep = 2;
          }

          setData({
            name: fallbackProject.name || '未命名漫剧工程',
            description: fallbackProject.description ?? '',
            content: fallbackProject.content || fallbackProject.novelText,
            novelMetadata: fallbackProject.novelMetadata,
            storyAnalysis: fallbackProject.storyAnalysis,
            storyboardFrames: fallbackProject.storyboardFrames || fallbackProject.parsedScenes,
            storyboardComments: fallbackProject.storyboardComments,
            storyboardVersions: fallbackProject.storyboardVersions,
            audioConfig: fallbackProject.audioConfig,
            characters: fallbackProject.characters,
            composition: fallbackProject.composition,
            script: fallbackProject.script || fallbackProject.novelText,
            exportPreset: fallbackProject.exportPreset || '16:9',
            exportSettings: fallbackProject.exportSettings,
            initialStep,
            frameId: frameId ?? undefined,
          });
          setError(null);
        } else {
          setError('加载项目失败，请确认项目文件是否存在');
          setData(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId, location.search, data]);

  return { loading, error, data };
}
