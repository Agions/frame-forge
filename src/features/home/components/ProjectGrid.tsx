import {
  Video,
  Plus,
  Edit3,
  Trash2,
  Play,
  ImageIcon,
  FolderOpen,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';
import React, { useCallback, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CreateProjectModal from '@/shared/components/project/CreateProjectModal';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/toast';
import { useProjectStore } from '@/shared/stores/project-store';
import type { ProjectData } from '@/shared/types';
import { formatDate } from '@/shared/utils/format-ui';

interface ProjectGridProps {
  projects: ProjectData[];
  loading: boolean;
  onRefresh?: () => void;
}

interface ProjectCardProps {
  project: ProjectData;
  onView: (id: string) => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
  onOpenWorkflow: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const ProjectCard = memo(function ProjectCard({
  project,
  onView,
  onEdit,
  onOpenWorkflow,
  onDelete,
}: ProjectCardProps) {
  const currentStage = (project as any).stage || project.status || 'Stage 3';

  return (
    <div
      key={project.id}
      onClick={() => onView(project.id)}
      className="studio-card group relative cursor-pointer overflow-hidden p-3.5 flex flex-col justify-between space-y-3"
    >
      {/* 16:9 高清 4K 视频/动漫缩略图预览区 (纯中文) */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center shadow-inner">
        {project.thumbnail ? (
          <img
            alt={project.name}
            src={project.thumbnail}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[var(--muted-foreground)]">
            <ImageIcon className="w-8 h-8 opacity-30 stroke-1" />
            <span className="text-[10px] font-mono tracking-widest">4K 漫剧画布</span>
          </div>
        )}

        {/* 悬浮中央发光 Play 圈 */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
            <div className="w-full h-full bg-[#080c14] rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-indigo-400 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* 快捷悬浮栏 */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => onEdit(project.id, e)}
            className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white hover:bg-indigo-600 transition-colors cursor-pointer"
            title="编辑"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => onDelete(project.id, e)}
            className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
            title="删除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 标题、进度条与元数据 标签 Pill */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-[var(--foreground)] group-hover:text-indigo-400 transition-colors truncate">
            {project.name}
          </h4>
          <span className="text-[10px] font-mono font-bold text-indigo-400">78%</span>
        </div>

        {/* 极简进度条 */}
        <div className="w-full bg-black/40 border border-white/10 rounded-full h-1.5 overflow-hidden">
          <div className="bg-indigo-500 h-full w-[78%] transition-all duration-300" />
        </div>

        {/* 纯中文元数据标签组 */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-semibold text-[var(--muted-foreground)]">
            4K 超清
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-semibold text-[var(--muted-foreground)]">
            16:9
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-mono font-bold text-indigo-400">
            阶段 3: 动画生成
          </span>
        </div>

        {/* 快捷操作按钮组 */}
        <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-white/10 text-center">
          <button
            onClick={(e) => onOpenWorkflow(project.id, e)}
            className="px-2 py-1 rounded-md bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 text-[11px] font-bold transition-all cursor-pointer"
          >
            继续创作
          </button>
          <button
            onClick={(e) => onEdit(project.id, e)}
            className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-[11px] font-medium transition-all cursor-pointer"
          >
            4K 导出
          </button>
          <button
            onClick={() => onView(project.id)}
            className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-[11px] font-medium transition-all cursor-pointer"
          >
            预览
          </button>
        </div>
      </div>
    </div>
  );
});

function ProjectGrid({ projects, loading, onRefresh }: ProjectGridProps) {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateProject = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleViewProject = useCallback(
    (id: string) => {
      const store = useProjectStore.getState();
      const targetProj = store.projects.find((p) => p.id === id);
      if (targetProj && typeof store.setCurrentProject === 'function') {
        store.setCurrentProject(targetProj);
      }
      navigate(`/project/${id}`);
    },
    [navigate]
  );

  const handleEditProject = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const store = useProjectStore.getState();
      const targetProj = store.projects.find((p) => p.id === id);
      if (targetProj && typeof store.setCurrentProject === 'function') {
        store.setCurrentProject(targetProj);
      }
      navigate(`/project/edit/${id}`);
    },
    [navigate]
  );

  const handleOpenWorkflow = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const store = useProjectStore.getState();
      const targetProj = store.projects.find((p) => p.id === id);
      if (targetProj && typeof store.setCurrentProject === 'function') {
        store.setCurrentProject(targetProj);
      }
      navigate(`/workflow`, { state: { projectId: id } });
    },
    [navigate]
  );

  const handleDeleteProject = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const store = useProjectStore.getState();
        if (typeof store.deleteProject === 'function') {
          store.deleteProject(id);
        }
        toast.success('已成功删除漫剧工程！');
        onRefresh?.();
      } catch (err) {
        console.error('Delete project failed:', err);
      }
    },
    [onRefresh]
  );

  return (
    <div className="space-y-6">
      {/* 网格 Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-base font-extrabold text-[var(--foreground)] flex items-center gap-2">
            我的漫剧工程大厅
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono font-bold">
              {projects.length} 部
            </span>
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            4K 漫剧视听工程列表与实时渲染状态
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleCreateProject}
          className="studio-btn-primary px-6 py-2.5 text-xs flex items-center gap-1.5 cursor-pointer border-0"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          新建漫剧工程
        </Button>
      </div>

      {/* 漫剧工程网格区 */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-[var(--muted-foreground)]">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-3" />
          正在加载工程列表中...
        </div>
      ) : projects.length === 0 ? (
        <div className="studio-card flex flex-col items-center justify-center py-16 text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400 shadow-xl shadow-indigo-500/20">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-[var(--foreground)] mb-1">暂无漫剧创作工程</h4>
          <p className="text-xs text-[var(--muted-foreground)] mb-6 max-w-md leading-relaxed">
            点击下方按钮开启全新的 AI 漫剧工程，导入小说剧本文本即可开始生成。
          </p>
          <Button
            size="lg"
            onClick={handleCreateProject}
            className="studio-btn-primary px-6 py-2.5 text-xs rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建漫剧工程
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={handleViewProject}
              onEdit={handleEditProject}
              onOpenWorkflow={handleOpenWorkflow}
              onDelete={handleDeleteProject}
            />
          ))}

          {/* 新建工程 Action Card (与 UI 视觉完全匹配) */}
          <div
            onClick={handleCreateProject}
            className="studio-card group cursor-pointer p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px] border-dashed border-indigo-500/30 hover:border-indigo-500/70 transition-all hover:scale-105"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-indigo-400 transition-colors">
              新建漫剧工程
            </span>
          </div>
        </div>
      )}

      {/* 新建工程 Modal */}
      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
}

export default ProjectGrid;
