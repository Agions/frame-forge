/**
 * ProjectDetail 状态管理 Hook（facade）
 *
 * 拆分为：
 * - projectDetailComputed.ts (49行): 计算属性
 * - projectDetailActions.ts (210行): 操作方法
 *
 * 本文件保留状态初始化 + effect + 组合编排。
 */
import { useCallback, useEffect, useState } from 'react';

import type { ProjectData } from '@/core/project/types/project';
import type { Script, VideoSegment } from '@/core/script/types/script';
import { collaborationService } from '@/core/services';
import type { EvaluationScores, FrameComment, StoryboardVersion } from '@/core/services';
import type { StoryboardFrame } from '@/core/storyboard/types/storyboard';
import type { ScriptImportMetadata } from '@/features/storyboard/components/NovelImporter';
import { useProjectStore } from '@/stores';

import {
  useHandleApplyRenderedFrame,
  useHandleCreateScript,
  useHandleExportReviewNotes,
  useHandleExportScript,
  useHandleScriptChange,
  usePersistProjectPatch,
} from './projectDetailActions';
import {
  useExportQualityGate,
  useEvaluationSummary,
  useSelectedFrame,
  useStoryboardFrames,
} from './projectDetailComputed';

export interface UseProjectDetailOptions {
  projectId: string;
}

export interface UseProjectDetailReturn {
  // State
  loading: boolean;
  project: ProjectData | null;
  activeScript: Script | null;
  activeTab: string;
  novelMetadata: ScriptImportMetadata | null;
  selectedFrameId: string | undefined;

  // Computed
  storyboardFrames: StoryboardFrame[];
  evaluationSummary: EvaluationScores | undefined;
  exportQualityGate: ReturnType<typeof import('@/core/services').qualityGateService.evaluate>;
  selectedFrame: StoryboardFrame | null;

  // Setters
  setProject: React.Dispatch<React.SetStateAction<ProjectData | null>>;
  setActiveScript: React.Dispatch<React.SetStateAction<Script | null>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setNovelMetadata: React.Dispatch<React.SetStateAction<ScriptImportMetadata | null>>;
  setSelectedFrameId: React.Dispatch<React.SetStateAction<string | undefined>>;

  // Actions
  persistProjectPatch: (patch: Record<string, unknown>) => void;
  handleApplyRenderedFrame: (frameId: string, imageUrl: string) => void;
  handleExportReviewNotes: () => Promise<void>;
  handleCreateScript: () => void;
  handleGenerateScript: () => void;
  handleScriptChange: (segments: VideoSegment[]) => void;
  handleExportScript: () => Promise<void>;
  handleDeleteProject: () => void;
  deleteProject: (id: string) => void;
  preloadTabModules: (tabKey: string) => void;
}

export function useProjectDetail({ projectId }: UseProjectDetailOptions): UseProjectDetailReturn {
  const { projects, updateProject, deleteProject } = useProjectStore();

  // ─── 状态 ───
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [activeScript, setActiveScript] = useState<Script | null>(null);
  const [activeTab, setActiveTab] = useState('novel');
  const [novelMetadata, setNovelMetadata] = useState<ScriptImportMetadata | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | undefined>(undefined);

  // ─── 计算属性（提取到子模块） ───
  const storyboardFrames = useStoryboardFrames(project);
  const evaluationSummary = useEvaluationSummary(project);
  const exportQualityGate = useExportQualityGate(storyboardFrames, evaluationSummary);
  const selectedFrame = useSelectedFrame(storyboardFrames, selectedFrameId);

  // ─── 操作方法（提取到子模块，依赖链显式传递） ───
  const persistProjectPatch = usePersistProjectPatch(project, setProject, updateProject);
  const handleApplyRenderedFrame = useHandleApplyRenderedFrame(
    project,
    storyboardFrames,
    persistProjectPatch
  );
  const handleExportReviewNotes = useHandleExportReviewNotes(
    project,
    storyboardFrames,
    evaluationSummary
  );
  const handleCreateScript = useHandleCreateScript(
    project,
    setProject,
    setActiveScript,
    updateProject
  );
  const handleScriptChange = useHandleScriptChange(
    project,
    activeScript,
    setProject,
    setActiveScript,
    updateProject
  );
  const handleExportScript = useHandleExportScript(project, activeScript);

  // ─── 内联简单操作 ───
  const handleGenerateScript = useCallback(() => {
    // Caller should use useNavigate - this returns navigation intent
  }, []);

  const handleDeleteProject = useCallback(() => {
    if (!projectId) return;
    deleteProject(projectId);
  }, [projectId, deleteProject]);

  const preloadTabModules = useCallback((_tabKey: string) => {
    // No-op preloader for now
  }, []);

  // ─── Effects ───

  // 自动选中第一帧
  useEffect(() => {
    const timer = setTimeout(() => {
      if (storyboardFrames.length === 0) {
        setSelectedFrameId(undefined);
        return;
      }
      if (!selectedFrameId || !storyboardFrames.some((frame) => frame.id === selectedFrameId)) {
        setSelectedFrameId(storyboardFrames[0].id);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [storyboardFrames, selectedFrameId]);

  // 从 store 加载项目
  useEffect(() => {
    if (!projectId) return;
    const { currentProject: activeProject } = useProjectStore.getState();
    const targetProject =
      projects.find((p) => String(p.id) === String(projectId)) ||
      (activeProject && String(activeProject.id) === String(projectId) ? activeProject : null);

    const timer = setTimeout(() => {
      if (targetProject) {
        setProject(targetProject as ProjectData);
        if (targetProject.scripts?.length) setActiveScript(targetProject.scripts[0]);
        if (targetProject.novelMetadata)
          setNovelMetadata(targetProject.novelMetadata as ScriptImportMetadata);
        if (
          Array.isArray(targetProject.storyboardComments) ||
          Array.isArray(targetProject.storyboardVersions)
        ) {
          collaborationService.hydrate(
            targetProject.id,
            (targetProject.storyboardComments ?? []) as FrameComment[],
            (targetProject.storyboardVersions ?? []) as StoryboardVersion[]
          );
        }
      } else {
        // 提供保底，避免页面挂起为空
        setProject({
          id: projectId,
          name: `漫剧工程 (${projectId.slice(0, 8)})`,
          description: '自动恢复环境与数据上下文',
          status: 'processing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as ProjectData);
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [projectId, projects]);

  return {
    loading,
    project,
    activeScript,
    activeTab,
    novelMetadata,
    selectedFrameId,
    storyboardFrames,
    evaluationSummary,
    exportQualityGate,
    selectedFrame,
    setProject,
    setActiveScript,
    setActiveTab,
    setNovelMetadata,
    setSelectedFrameId,
    persistProjectPatch,
    handleApplyRenderedFrame,
    handleExportReviewNotes,
    handleCreateScript,
    handleGenerateScript,
    handleScriptChange,
    handleExportScript,
    handleDeleteProject,
    deleteProject,
    preloadTabModules,
  };
}
