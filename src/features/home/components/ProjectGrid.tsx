import {
  Video,
  Plus,
  Edit3,
  Trash2,
  Play,
  ImageIcon,
  Sparkles,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import React, { useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import type { ProjectData } from '@/shared/types';
import { formatDate } from '@/shared/utils/format-ui';

import styles from './ProjectGrid.module.less';

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
  const currentStage = (project as any).stage || project.status || 'Draft';

  const getStagePercent = (stageName?: string) => {
    switch (stageName) {
      case 'Draft':
        return 15;
      case 'ScriptParsed':
        return 35;
      case 'StoryboardGenerated':
        return 60;
      case 'AudioSynthesized':
        return 80;
      case 'Rendering':
        return 95;
      case 'Completed':
      case 'completed':
        return 100;
      default:
        return 20;
    }
  };

  const progressPercent = getStagePercent(currentStage);

  return (
    <div
      key={project.id}
      onClick={() => onView(project.id)}
      className="group relative cursor-pointer rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-[#00f5d4]/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,245,212,0.12)] overflow-hidden flex flex-col justify-between"
    >
      {/* Thumbnail Banner */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-950/80 flex items-center justify-center">
        {project.thumbnail ? (
          <img
            alt={project.name}
            src={project.thumbnail}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-600">
            <ImageIcon className="w-10 h-10 stroke-1" />
            <span className="text-[10px] font-mono tracking-wider">MangaV 4K Canvas</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <Badge className="bg-slate-950/80 backdrop-blur-md text-[#00f5d4] border border-[#00f5d4]/30 text-[10px] px-2 py-0.5">
            4K 原生
          </Badge>
          <Badge className="bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/80 text-[10px] px-2 py-0.5 font-mono">
            {currentStage}
          </Badge>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="sm"
            onClick={(e) => onOpenWorkflow(project.id, e)}
            className="bg-[#00f5d4] hover:bg-[#00f5d4]/80 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(0,245,212,0.4)]"
          >
            <Play className="w-3.5 h-3.5 mr-1 fill-current" />
            进入 SOP 创作
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => onEdit(project.id, e)}
            className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => onDelete(project.id, e)}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-100 group-hover:text-[#00f5d4] transition-colors truncate mb-1">
            {project.name}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {project.description || '暂无描述信息，已自动绑定漫剧创作 SOP 6 步生成引擎...'}
          </p>
        </div>

        <div>
          {/* SOP Stage Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>SOP 进度</span>
              <span className="font-mono text-[#00f5d4]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-[#00f5d4] to-[#a855f7] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
            <span>更新于 {formatDate(project.updatedAt)}</span>
            <span className="text-[#00f5d4] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              查看 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

function ProjectGrid({ projects, loading, onRefresh }: ProjectGridProps) {
  const navigate = useNavigate();

  const handleCreateProject = useCallback(() => {
    navigate('/project/new');
  }, [navigate]);

  const handleViewProject = useCallback(
    (id: string) => {
      navigate(`/project/${id}`);
    },
    [navigate]
  );

  const handleEditProject = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/project/edit/${id}`);
    },
    [navigate]
  );

  const handleOpenWorkflow = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/workflow`, { state: { projectId: id } });
    },
    [navigate]
  );

  const handleDeleteProject = useCallback(
    (_id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onRefresh?.();
    },
    [onRefresh]
  );

  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00f5d4]/10 border border-[#00f5d4]/30 flex items-center justify-center text-[#00f5d4]">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              我的漫剧项目
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {projects.length} 部
              </span>
            </h3>
            <p className="text-xs text-slate-400">管理与继续编辑您的 4K 漫剧视频流程产物</p>
          </div>
        </div>

        {projects.length > 0 && (
          <Button
            size="sm"
            onClick={handleCreateProject}
            className="bg-[#00f5d4] hover:bg-[#00f5d4]/80 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(0,245,212,0.3)]"
          >
            <Plus className="h-4 w-4 mr-1" />
            新建漫剧项目
          </Button>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="w-6 h-6 border-2 border-[#00f5d4] border-t-transparent rounded-full animate-spin mr-3" />
          加载漫剧项目列表中...
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 p-8 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-[#00f5d4]/10 border border-[#00f5d4]/30 flex items-center justify-center mb-4 text-[#00f5d4] shadow-[0_0_24px_rgba(0,245,212,0.2)]">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-100 mb-1">暂无漫剧创作项目</h4>
          <p className="text-xs text-slate-400 mb-6 max-w-md leading-relaxed">
            您还没有创建任何漫剧项目。可以直接一键导入小说 TXT/MD，或开启空白项目配置画风与分辨率。
          </p>
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/workflow')}
              className="bg-[#00f5d4] hover:bg-[#00f5d4]/80 text-slate-950 font-bold text-sm shadow-[0_0_16px_rgba(0,245,212,0.4)]"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              一键导入小说剧本
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleCreateProject}
              className="border-slate-700 hover:bg-slate-800 text-slate-200 text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              新建自定义项目
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        </div>
      )}
    </div>
  );
}

export default ProjectGrid;
