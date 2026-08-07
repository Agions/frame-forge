/**
 * 视频脚本工作流页面 — 赛博朋克霓虹极暗全路径 SOP 闭环中心
 * 支持：角色视角 Tab 切换、角色职责卡片展开/折叠、9 阶流程卡片交互展开
 */

import {
  Zap,
  Play,
  Sparkles,
  Film,
  CheckCircle2,
  ChevronDown,
  ArrowRightLeft,
  Users,
  PenTool,
  Palette,
  Clapperboard,
  ShieldCheck,
  FolderKanban,
  Plus,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from '@/components/ui/toast';
import CreateProjectModal from '@/shared/components/project/CreateProjectModal';
import { useProjectStore } from '@/shared/stores/project-store';
import { ScriptParseResult } from '@mangav/ai-engine';
import { ScriptSourceManager } from '@mangav/storyboard';
import { MangaButton, MangaCard, StatusBadge } from '@mangav/ui';

import styles from './WorkflowPage.module.less';

interface RoleModule {
  id: string;
  role: string;
  shortRole: string;
  imageIcon: string;
  colorClass: string;
  actionClass: string;
  steps: string[];
  output: string;
  action: string;
}

const ROLE_MODULES: RoleModule[] = [
  {
    id: 'writer',
    role: '编剧 Screenwriter',
    shortRole: '编剧',
    imageIcon: '/writer_role_icon.jpg',
    colorClass: styles.roleCardCyan,
    actionClass: styles.actionCyan,
    steps: ['1. 小说/文本导入', '2. AI 角色与故事分析', '3. 剧本镜头拆解'],
    output: '标准剧本 JSON',
    action: '提交剧本质检',
  },
  {
    id: 'storyboarder',
    role: '分镜师 Storyboarder',
    shortRole: '分镜师',
    imageIcon: '/storyboarder_role_icon.jpg',
    colorClass: styles.roleCardPurple,
    actionClass: styles.actionPurple,
    steps: ['4. AI 漫画分镜绘制', '5. 角色一致性锁定'],
    output: '分镜图像 & 镜头动作参数',
    action: '提交分镜质检',
  },
  {
    id: 'producer',
    role: '制作师 Producer',
    shortRole: '制作师',
    imageIcon: '/animator_role_icon.jpg',
    colorClass: styles.roleCardPink,
    actionClass: styles.actionPink,
    steps: ['6. 镜头动效合成', '7. 多音轨 TTS 配音', '8. 硬件加速场景渲染', '9. 4K 漫剧导出'],
    output: '高精 4K 漫剧 MP4 成品',
    action: '提交成品终审',
  },
  {
    id: 'auditor',
    role: '审核员 Auditor',
    shortRole: '审核员',
    imageIcon: '/auditor_role_icon.jpg',
    colorClass: styles.roleCardGreen,
    actionClass: styles.actionGreen,
    steps: ['剧本质检与评估', '分镜画面视觉审核', '音画合成终审', '打回意见录入与批准'],
    output: '审核决策 (Pass / Reject)',
    action: '通过流转 / 驳回打回',
  },
];

interface WorkflowStep {
  key: string;
  title: string;
  description: string;
  role: string;
  roleId: string;
  badgeClass: string;
  detailInfo: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    key: 'import',
    title: '1. 小说/剧本导入',
    description: '上传 txt/md 文件或粘贴原文，AI 语义格式化解析',
    role: '编剧',
    roleId: 'writer',
    badgeClass: styles.badgeCyan,
    detailInfo: '支持 TXT / Markdown 原创小说解析，提取人物角色列表、剧情分节与话语分句。',
  },
  {
    key: 'analysis',
    title: '2. AI 角色与故事分析',
    description: '自动解析对话、角色性格与高光情节点',
    role: '编剧',
    roleId: 'writer',
    badgeClass: styles.badgeCyan,
    detailInfo: '基于 DeepSeek-V4 大模型提取人物设定 Prompt，生成角色图谱与一致性锚点卡。',
  },
  {
    key: 'script',
    title: '3. 剧本镜头拆解',
    description: '推导近景、全景、景深与运镜动作脚本',
    role: '编剧',
    roleId: 'writer',
    badgeClass: styles.badgeCyan,
    detailInfo: '结构化导出标准 Shot Grid JSON，包含摄像机推拉摇移指令与对白时间印记。',
  },
  {
    key: 'storyboard',
    title: '4. AI 漫画分镜绘制',
    description: '五大画风预设一键批量生成视听镜头',
    role: '分镜师',
    roleId: 'storyboarder',
    badgeClass: styles.badgePurple,
    detailInfo: '整合 SDXL / Midjourney 模型，生成九宫格画幅与构图图层拆分（前景/中景/背景）。',
  },
  {
    key: 'character',
    title: '5. 角色一致性锁定',
    description: 'Master Protocol 锁定角色全局面部与服装形象',
    role: '分镜师',
    roleId: 'storyboarder',
    badgeClass: styles.badgePurple,
    detailInfo: '通过 IP-Adapter & ControlNet 约束机制，确保跨分镜镜头的人物五官及造型无缝衔接。',
  },
  {
    key: 'animate',
    title: '6. 镜头动效合成',
    description: 'Pan/Zoom Keyframe 运镜与微动特效处理',
    role: '制作师',
    roleId: 'producer',
    badgeClass: styles.badgePink,
    detailInfo: '赋予 2D 分镜 2.5D 深度视差动效，叠加粒子光斑、雷电风雪等动态视觉特效。',
  },
  {
    key: 'audio',
    title: '7. 多音轨 TTS 配音',
    description: 'EdgeTTS/CosyVoice 时间轴精确对齐与音效混音',
    role: '制作师',
    roleId: 'producer',
    badgeClass: styles.badgePink,
    detailInfo: '匹配角色情绪语调，自动对齐 BGM 背景音乐、音效库 (SFX) 与人声音轨。',
  },
  {
    key: 'render',
    title: '8. 硬件加速场景渲染',
    description: '调度 VideoToolbox / NVENC 硬编管线并发处理',
    role: '制作师',
    roleId: 'producer',
    badgeClass: styles.badgePink,
    detailInfo: '榨干 GPU/NPU 算力，通过并行 Chunk 渲染技术实现秒级音画合轨编译。',
  },
  {
    key: 'export',
    title: '9. 4K 漫剧导出',
    description: 'MP4/WebM 多格式高精输出与质检归档',
    role: '制作师',
    roleId: 'producer',
    badgeClass: styles.badgePink,
    detailInfo: '导出 4K 60FPS 超清视频成品，附带多语言字幕文件与分发打包数据包。',
  },
];

const WorkflowPage = () => {
  const navigate = useNavigate();
  const [parseResult, setParseResult] = useState<ScriptParseResult | null>(null);

  // 角色视角过滤状态 ('all' | 'writer' | 'storyboarder' | 'producer' | 'auditor')
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');

  // 展开的角色卡片 ID (集合)
  const [expandedRoleCards, setExpandedRoleCards] = useState<Set<string>>(
    new Set(['writer', 'storyboarder', 'producer', 'auditor'])
  );

  // 展开的 9 阶步骤 Key (集合)
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['import']));

  // 项目 store 联动
  const store = useProjectStore();
  const activeProject = store.currentProject || (store.projects && store.projects[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleStartWorkflow = () => {
    toast.info('开启 SOP 漫剧工作台');
    setIsCreateModalOpen(true);
  };

  const handleScriptParsed = (result: ScriptParseResult) => {
    setParseResult(result);
    toast.success(
      `解析成功！获取 ${result.episodes.length} 集，共 ${result.totalShots} 个分镜镜头`
    );
  };

  const toggleRoleCard = (roleId: string) => {
    setExpandedRoleCards((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  };

  const toggleStep = (stepKey: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepKey)) next.delete(stepKey);
      else next.add(stepKey);
      return next;
    });
  };

  return (
    <div className={styles.container}>
      {/* ── 🎬 项目上下文关联 Bar ── */}
      <div className="flex items-center justify-between p-3.5 px-5 rounded-2xl bg-slate-950/80 border border-[#00f5d4]/30 backdrop-blur-xl mb-4 shadow-[0_0_24px_rgba(0,245,212,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00f5d4]/10 border border-[#00f5d4]/30 flex items-center justify-center text-[#00f5d4]">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">当前编辑项目:</span>
              <span className="text-sm font-bold text-slate-100">
                {activeProject?.name || '未选定项目 (极速草稿车间)'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30 font-mono font-bold">
                {(activeProject as any)?.stage || 'SOP 车间进行中'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              画风: {(activeProject as any)?.artStyle || '日系二次元'} · 画幅:{' '}
              {(activeProject as any)?.aspectRatio || '16:9 4K'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#00f5d4] hover:bg-[#00f5d4]/80 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(0,245,212,0.3)] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            新建漫剧项目
          </button>
        </div>
      </div>
      {/* 顶部 Workflow Header */}
      <div className={styles.header}>
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl text-[#00f5d4] flex items-center justify-center"
            style={{
              background: 'rgba(0,245,212,0.1)',
              border: '1px solid rgba(0,245,212,0.3)',
              boxShadow: '0 0 16px rgba(0,245,212,0.2)',
            }}
          >
            <Zap className="h-6 w-6 m-neon-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              SOP 漫剧角色分工与闭环工作流
              <span
                className="text-[10px] px-2 py-0.5 rounded font-mono font-bold"
                style={{
                  background: 'rgba(0,245,212,0.12)',
                  color: '#00f5d4',
                  border: '1px solid rgba(0,245,212,0.3)',
                }}
              >
                STATION v0.0.1
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              从编剧拆解到导演质检驳回闭环的 9 阶段 4 角色标准化体系
            </p>
          </div>
        </div>
        <MangaButton variant="primary" size="md" onClick={handleStartWorkflow}>
          <Play className="h-4 w-4 mr-1.5" />
          开启角色工作台
        </MangaButton>
      </div>

      {/* 角色视角切换器 Tab Bar */}
      <div className={styles.roleTabs}>
        <button
          className={`${styles.roleTab} ${styles.roleTabCyan} ${activeRoleFilter === 'all' ? styles.roleTabActive : ''}`}
          onClick={() => setActiveRoleFilter('all')}
        >
          <Users className="w-4 h-4" />
          <span>全角色视角 (All Roles)</span>
        </button>
        {ROLE_MODULES.map((mod) => {
          const isActive = activeRoleFilter === mod.id;
          let colorStyle = styles.roleTabCyan;
          if (mod.id === 'storyboarder') colorStyle = styles.roleTabPurple;
          if (mod.id === 'producer') colorStyle = styles.roleTabPink;
          if (mod.id === 'auditor') colorStyle = styles.roleTabGreen;

          return (
            <button
              key={mod.id}
              className={`${styles.roleTab} ${colorStyle} ${isActive ? styles.roleTabActive : ''}`}
              onClick={() => setActiveRoleFilter(mod.id)}
            >
              <div className={styles.roleTabIcon}>
                <img
                  src={mod.imageIcon}
                  alt={mod.shortRole}
                  className="w-full h-full object-cover"
                />
              </div>
              <span>{mod.shortRole}</span>
            </button>
          );
        })}
      </div>

      {/* 4 大角色职责矩阵展示 */}
      <div className={styles.roleMatrix}>
        <div className={styles.matrixHeader}>
          <ArrowRightLeft className="w-4 h-4 text-[#00f5d4]" />
          <span>参与角色职责与流程闭环矩阵 (点击卡片展开详情)</span>
        </div>

        <div className={styles.roleCards}>
          {ROLE_MODULES.map((mod) => {
            if (activeRoleFilter !== 'all' && activeRoleFilter !== mod.id) return null;
            const isExpanded = expandedRoleCards.has(mod.id);

            return (
              <div
                key={mod.role}
                className={`${styles.roleCard} ${mod.colorClass} ${isExpanded ? styles.expanded : ''}`}
              >
                {/* Header Row */}
                <div className={styles.roleCardHeader} onClick={() => toggleRoleCard(mod.id)}>
                  <div className={styles.roleCardAvatar}>
                    <img
                      src={mod.imageIcon}
                      alt={mod.role}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={styles.roleCardName}>{mod.role}</span>
                  <ChevronDown
                    className={`${styles.expandToggle} ${isExpanded ? styles.rotated : ''}`}
                  />
                </div>

                {/* Steps List */}
                <div className={styles.roleCardSteps}>
                  {mod.steps.map((st) => (
                    <div key={st} className={styles.roleCardStep}>
                      <span className={`${styles.stepDot} bg-[#00f5d4]`} />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>

                {/* Expandable Details */}
                <div className={`${styles.roleCardDetail} ${isExpanded ? styles.open : ''}`}>
                  <div className={styles.roleCardDetailInner}>
                    <div className={styles.roleCardOutput}>
                      <strong>核心产出:</strong> {mod.output}
                    </div>
                    <button
                      className={`${styles.roleCardAction} ${mod.actionClass}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info(`操作触发: ${mod.action}`);
                      }}
                    >
                      <span>{mod.action}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 剧本全路径解析与 AI 生成中心 */}
      <div className="mb-8">
        <ScriptSourceManager onScriptParsed={handleScriptParsed} />
      </div>

      {parseResult && (
        <MangaCard title="剧本解析结果预览" className="mb-8 border-[#00f5d4]/40">
          <div className="flex items-center justify-between p-3 bg-[#00f5d4]/10 rounded-xl border border-[#00f5d4]/30 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
              <span className="text-sm font-semibold text-slate-200">{parseResult.summary}</span>
            </div>
            <MangaButton size="sm" variant="primary" onClick={() => navigate('/project/new')}>
              进入分镜工作台编辑镜头 →
            </MangaButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {parseResult.episodes.map((ep) => (
              <div key={ep.id} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="text-xs font-bold text-[#00f5d4] block mb-1">{ep.title}</span>
                <span className="text-xs text-slate-400">
                  包含 {ep.scenes.reduce((a, b) => a + b.shots.length, 0)} 个镜头
                </span>
              </div>
            ))}
          </div>
        </MangaCard>
      )}

      {/* 9 阶工作流程卡片网格 */}
      <div className={styles.workflowCard}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00f5d4]" />
            <h3 className="text-base font-bold text-slate-100">标准化 9 阶创作与质检流水线</h3>
          </div>
          <StatusBadge status="success" label="支持驳回打回闭环" size="sm" />
        </div>

        <div className={styles.steps}>
          {WORKFLOW_STEPS.map((step, index) => {
            const isRoleMatch = activeRoleFilter === 'all' || activeRoleFilter === step.roleId;
            const isStepExpanded = expandedSteps.has(step.key);

            return (
              <div
                key={step.key}
                className={`${styles.step} ${!isRoleMatch ? styles.stepDimmed : ''} ${isStepExpanded ? styles.stepActive : ''}`}
                onClick={() => toggleStep(step.key)}
              >
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <div className={styles.stepTitle}>{step.title}</div>
                    <span className={`${styles.stepRoleBadge} ${step.badgeClass}`}>
                      {step.role}
                    </span>
                  </div>
                  <div className={styles.stepDesc}>{step.description}</div>

                  {/* Step Expanded Content */}
                  <div className={`${styles.stepExpanded} ${isStepExpanded ? styles.open : ''}`}>
                    <div className={styles.stepExpandedInner}>
                      <p>{step.detailInfo}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 行动引导底栏 */}
      <div className={styles.ctaCard}>
        <h4 className="text-base font-bold text-slate-100 mb-2">
          准备好开启角色协同漫剧制作了吗？
        </h4>
        <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
          点击「一键创建新漫剧项目」进入 MangaV Studio
          漫剧编辑器，按编剧、分镜、制作与审核角色高效创作。
        </p>
        <MangaButton variant="primary" size="lg" onClick={handleStartWorkflow}>
          <Film className="h-5 w-5 mr-2" />
          一键创建新漫剧项目
        </MangaButton>
      </div>

      {/* ── 🚀 极速赛博新建项目 Modal ── */}
      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
};

export default WorkflowPage;
