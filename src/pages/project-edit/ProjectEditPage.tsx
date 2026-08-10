import {
  ArrowLeft,
  Save,
  AlertTriangle,
  Sparkles,
  Send,
  Zap,
  X,
  Wand2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import React, { Suspense, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useProject } from '@/core/hooks/useProject';
import { AuditReviewPanel } from '@/features/audit/AuditReviewPanel';
import CostDashboard from '@/features/cost/components/CostDashboard';
import {
  HOT_MANGA_TEMPLATES,
  generateAiCustomTemplate,
  MangaTemplate,
} from '@/features/storyboard/constants/manga-templates';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { toast } from '@/shared/components/ui/toast';
import { RoleType, WorkflowStage, AuditReviewRecord, WorkflowEngine } from '@novella/core';
import { MangaButton } from '@novella/ui';

import { StepContentSwitcher } from './components/StepContentSwitcher';
import { StepNavigation } from './components/StepNavigation';
import { ProjectEditProvider } from './context/ProjectEditContext';
import { useProjectExport } from './hooks/useProjectExport';
import { useProjectLoader } from './hooks/useProjectLoader';

const ProjectEdit = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [aiKeyword, setAiKeyword] = useState<string>('');
  const [showCostModal, setShowCostModal] = useState(false);
  const [showAuditPanel, setShowAuditPanel] = useState(false);

  const [activeRole, setActiveRole] = useState<RoleType>('writer');
  const [stage, setStage] = useState<WorkflowStage>('Draft');
  const [auditHistory, setAuditHistory] = useState<AuditReviewRecord[]>([]);

  const { project, error, currentStep, setCurrentStep } = useProject();
  const { exportPreset, exportSettings } = useProjectExport();
  const { data: loaderData } = useProjectLoader(projectId);

  const handleBack = () => navigate(-1);

  const handleApplyTemplate = (tpl: MangaTemplate) => {
    setSelectedGenre(tpl.key);
    setName(tpl.defaultName);
    setDescription(tpl.defaultDesc);
    toast.success(`已应用「${tpl.title}」热门模板！`);
  };

  return (
    <div className="space-y-4">
      {/* 顶部 Header Toolbar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] backdrop-blur-xl shadow-lg flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleBack}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回
          </Button>
          <div className="h-4 w-[1px] bg-[var(--border)]" />
          <h2 className="text-base font-bold text-[var(--foreground)]">
            {name || 'Novella 剧本分镜拆解编辑器'}
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--neon-cyan-bg)] text-[var(--neon-cyan)] border border-[var(--neon-cyan-border)] font-mono font-bold">
            {stage}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => toast.success('工程设置已自动保存！')}
            className="bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/80 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            保存修改
          </Button>
        </div>
      </div>

      {/* 预设模板灵感区 */}
      <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[var(--neon-cyan)]" />
            灵感模板库与 AI 预设生成
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HOT_MANGA_TEMPLATES.map((tpl) => (
            <div
              key={tpl.key}
              onClick={() => handleApplyTemplate(tpl)}
              className="p-3.5 rounded-xl bg-[var(--accent)] border border-[var(--border)] hover:border-[var(--neon-cyan)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-[var(--foreground)] group-hover:text-[var(--neon-cyan)] transition-colors">
                  {tpl.title}
                </span>
                <span className="text-[10px] text-[var(--neon-cyan)] font-mono">{tpl.category}</span>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2">{tpl.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 步骤导航与编辑内容 */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] backdrop-blur-xl shadow-xl space-y-4">
        <StepNavigation
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
        />
        <StepContentSwitcher currentStep={currentStep} />
      </div>
    </div>
  );
};

export const ProjectEditPage = () => {
  const { projectId } = useParams();
  const { data: loaderData } = useProjectLoader(projectId);

  const projectMetadata = useMemo(
    () => ({
      name: loaderData?.name || 'Novella AI 漫剧工程',
      description: loaderData?.description || '',
      exportPreset: loaderData?.exportPreset || ('16:9' as const),
      exportSettings: loaderData?.exportSettings || {},
    }),
    [loaderData]
  );

  return (
    <ProjectEditProvider projectMetadata={projectMetadata} initialData={loaderData}>
      <ProjectEdit />
    </ProjectEditProvider>
  );
};

export default ProjectEditPage;
