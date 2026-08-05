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
import { RoleType, WorkflowStage, AuditReviewRecord, WorkflowEngine } from '@mangav/core';
import { MangaButton } from '@mangav/ui';

import { StepContentSwitcher } from './components/StepContentSwitcher';
import { StepNavigation } from './components/StepNavigation';
import { ProjectEditProvider } from './context/ProjectEditContext';
import { useProjectExport } from './hooks/useProjectExport';
import { useProjectLoader } from './hooks/useProjectLoader';
import styles from './ProjectEdit.module.less';

const ProjectEdit = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [aiKeyword, setAiKeyword] = useState<string>('');
  const [showCostModal, setShowCostModal] = useState(false);
  const [showAuditPanel, setShowAuditPanel] = useState(false);

  // 角色与流程闭环状态
  const [activeRole, setActiveRole] = useState<RoleType>('writer');
  const [stage, setStage] = useState<WorkflowStage>('Draft');
  const [auditHistory, setAuditHistory] = useState<AuditReviewRecord[]>([]);

  const { project, error, currentStep, setCurrentStep } = useProject();
  const { exportPreset, exportSettings } = useProjectExport();
  const { data: loaderData } = useProjectLoader(projectId);

  const handleBack = () => navigate(-1);

  const projectMetadata = useMemo(
    () => ({
      name: name || '未命名漫剧项目',
      description,
      exportPreset,
      exportSettings,
    }),
    [name, description, exportPreset, exportSettings]
  );

  const handleApplyTemplate = (tpl: MangaTemplate) => {
    setSelectedGenre(tpl.key);
    setName(tpl.defaultName);
    setDescription(tpl.defaultDesc);
    toast.success(`已应用「${tpl.title}」热门模板！`);
  };

  const handleGenerateCustomAiTemplate = () => {
    if (!aiKeyword.trim()) {
      toast.error('请输入 AI 灵感关键词');
      return;
    }
    const customTpl = generateAiCustomTemplate(aiKeyword);
    setSelectedGenre(customTpl.key);
    setName(customTpl.defaultName);
    setDescription(customTpl.defaultDesc);
    toast.success(`✨ 已基于「${aiKeyword}」生成 AI 漫剧模板！`);
    setAiKeyword('');
  };

  // 审核处理：通过
  const handleAuditApprove = (comment: string) => {
    const nextStage = WorkflowEngine.getNextStage(stage) || 'Completed';
    const record: AuditReviewRecord = {
      id: `audit-${Date.now()}`,
      stage,
      targetRole: activeRole,
      auditorName: '导演 / 审核员',
      status: 'approved',
      comment,
      timestamp: Date.now(),
    };
    setAuditHistory((prev) => [...prev, record]);
    setStage(nextStage);
  };

  // 审核处理：驳回打回
  const handleAuditReject = (comment: string) => {
    const rejectStage = WorkflowEngine.getRejectStage(stage) || stage;
    const record: AuditReviewRecord = {
      id: `audit-${Date.now()}`,
      stage,
      targetRole: activeRole,
      auditorName: '导演 / 审核员',
      status: 'rejected',
      comment,
      timestamp: Date.now(),
    };
    setAuditHistory((prev) => [...prev, record]);
    setStage(rejectStage);
  };

  const handleSubmitForReview = () => {
    let next: WorkflowStage = stage;
    if (activeRole === 'writer') {
      next = 'ScriptPendingReview';
      toast.success('剧本拆解完毕，已提交导演质检审核！');
    } else if (activeRole === 'storyboarder') {
      next = 'StoryboardPendingReview';
      toast.success('分镜与角色一致性确认完毕，已提交分镜质检！');
    } else if (activeRole === 'animator') {
      next = 'ProductionPendingReview';
      toast.success('音画合成与渲染完毕，已提交成品终审！');
    }
    setStage(next);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertTriangle className="h-16 w-16 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-100">项目数据加载未就绪</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <Button variant="outline" onClick={handleBack}>
          返回上一页
        </Button>
      </div>
    );
  }

  return (
    <ProjectEditProvider projectMetadata={projectMetadata} initialData={loaderData}>
      <div className={styles.container}>
        {/* 1. 顶部 Header (极简设计) */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 m-0">
                <Sparkles className="w-4 h-4 text-[#00f5d4]" />
                {project ? `编辑漫剧: ${project.name}` : '创建新漫剧项目'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 算力消耗预估微型 Badge */}
            <button
              onClick={() => setShowCostModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
              style={{
                background: 'rgba(0,245,212,0.06)',
                border: '1px solid rgba(0,245,212,0.25)',
                color: '#00f5d4',
              }}
              title="点击查看算力成本明细"
            >
              <Zap className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>算力消耗: ~$0.05</span>
            </button>

            {/* 质检审核控制台折叠开关 */}
            <button
              onClick={() => setShowAuditPanel((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
              style={{
                background: 'rgba(180,79,255,0.08)',
                border: '1px solid rgba(180,79,255,0.3)',
                color: '#b44fff',
              }}
            >
              <span>导演质检面板</span>
              {showAuditPanel ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {activeRole !== 'auditor' && (
              <MangaButton
                variant="outline"
                size="sm"
                onClick={handleSubmitForReview}
                className="gap-1.5 text-xs"
              >
                <Send className="h-3.5 w-3.5" />
                提交成果
              </MangaButton>
            )}

            <MangaButton
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success('项目已保存');
              }}
              className="gap-1.5"
            >
              <Save className="h-4 w-4" />
              保存进度
            </MangaButton>
          </div>
        </div>

        {/* 可折叠收纳的质检控制台 */}
        {showAuditPanel && (
          <div className="mb-4">
            <AuditReviewPanel
              currentStage={stage}
              activeRole={activeRole}
              auditHistory={auditHistory}
              onApprove={handleAuditApprove}
              onReject={handleAuditReject}
              onRequestReview={handleSubmitForReview}
            />
          </div>
        )}

        {/* 2. 中间一体化快速立项卡片 (极简 10 热门模板 + AI 生成) */}
        {!project && (
          <Card className={styles.card}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00f5d4]" />
                选择热门漫剧主题模板 或 使用 AI 一键灵感填充
              </span>

              {/* AI 灵感自定义模板输入框 */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="例如：打工人在修仙界做烧烤..."
                  value={aiKeyword}
                  onChange={(e) => setAiKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomAiTemplate()}
                  className="h-8 text-xs bg-slate-950 border-slate-800 w-56 focus:border-[#00f5d4]"
                />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleGenerateCustomAiTemplate}
                  className="h-8 text-xs gap-1 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  AI 生成
                </Button>
              </div>
            </div>

            {/* 10 个热门爆款主题网格 */}
            <div className={styles.presetGrid}>
              {HOT_MANGA_TEMPLATES.map((tpl) => {
                const Icon = tpl.icon;
                const isActive = selectedGenre === tpl.key;
                return (
                  <div
                    key={tpl.key}
                    onClick={() => handleApplyTemplate(tpl)}
                    className={`${styles.presetCard} ${isActive ? styles.presetCardActive : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="p-1 rounded text-[#00f5d4]"
                        style={{ background: 'rgba(0,245,212,0.1)' }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-200">{tpl.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{tpl.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* 项目名称与梗概输入（简练双行） */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/80">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  漫剧项目名称 *
                </label>
                <Input
                  placeholder="例如：《破苍穹·异火重临》"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs font-medium bg-slate-950 border-slate-800 text-slate-200 focus:border-[#00f5d4]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  项目描述 / 剧情梗概
                </label>
                <Input
                  placeholder="简要描述故事剧情主线（应用于 AI 分镜画幅生成推演）..."
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs font-medium bg-slate-950 border-slate-800 text-slate-200 focus:border-[#00f5d4]"
                />
              </div>
            </div>
          </Card>
        )}

        {/* 3. 步骤导航指示器 & SOP 工作视口 */}
        <StepNavigation
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          projectId={project?.id}
        />

        <div className={styles.stepsContent}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-[#00f5d4] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <StepContentSwitcher currentStep={currentStep} />
          </Suspense>
        </div>

        {/* 算力消耗弹窗 */}
        {showCostModal && (
          <div className={styles.costModalOverlay} onClick={() => setShowCostModal(false)}>
            <div className={styles.costModalContent} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                  <Zap className="w-4 h-4 text-[#00f5d4]" />
                  <span>项目算力成本与预算看板</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCostModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-4">
                    <div className="w-6 h-6 border-2 border-[#00f5d4] border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <CostDashboard projectId={project?.id} />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </ProjectEditProvider>
  );
};

export default ProjectEdit;
