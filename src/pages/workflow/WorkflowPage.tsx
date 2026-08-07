import {
  Zap,
  Play,
  Sparkles,
  Film,
  CheckCircle2,
  Users,
  PenTool,
  Palette,
  Clapperboard,
  ShieldCheck,
  FolderKanban,
  Plus,
  Music,
  Sliders,
  ChevronUp,
  ChevronDown,
  Volume2,
  Copy,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from '@/components/ui/toast';
import { AssetVaultPanel } from '@/features/asset-vault/AssetVaultPanel';
import { AuditReviewPanel } from '@/features/audit/AuditReviewPanel';
import StoryboardEditor from '@/features/storyboard/components/StoryboardEditor';
import CreateProjectModal from '@/shared/components/project/CreateProjectModal';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useProjectStore } from '@/shared/stores/project-store';
import { ScriptParseResult } from '@mangav/ai-engine';
import { ScriptSourceManager } from '@mangav/storyboard';
import { MangaButton } from '@mangav/ui';

import styles from './WorkflowPage.module.less';

const SOP_NODES = [
  {
    id: 'step-1',
    step: 'Stage 1',
    title: '剧本拆解',
    role: '编剧 (Writer)',
    color: '#00f5d4',
    status: 'ready',
  },
  {
    id: 'step-2',
    step: 'Stage 2',
    title: '漫剧资产库',
    role: '美术 (Artist)',
    color: '#a855f7',
    status: 'ready',
  },
  {
    id: 'step-3',
    step: 'Stage 3',
    title: '4K 动效分镜',
    role: '分镜 (Storyboarder)',
    color: '#ec4899',
    status: 'active',
  },
  {
    id: 'step-4',
    step: 'Stage 4',
    title: '音轨与配乐',
    role: '制作 (Producer)',
    color: '#fbbf24',
    status: 'ready',
  },
  {
    id: 'step-5',
    step: 'Stage 5',
    title: '导演质检驳回',
    role: '质检 (Auditor)',
    color: '#38bdf8',
    status: 'ready',
  },
  {
    id: 'step-6',
    step: 'Stage 6',
    title: '完工导出',
    role: '全员 (Studio)',
    color: '#34d399',
    status: 'ready',
  },
];

const ROLES = [
  { id: 'writer', name: '编剧', icon: PenTool, color: '#00f5d4' },
  { id: 'storyboarder', name: '分镜师', icon: Palette, color: '#a855f7' },
  { id: 'producer', name: '制作师', icon: Clapperboard, color: '#ec4899' },
  { id: 'auditor', name: '质检员', icon: ShieldCheck, color: '#38bdf8' },
];

export const WorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useProjectStore();
  const activeProject = store.currentProject || (store.projects && store.projects[0]);

  const [activeStepId, setActiveStepId] = useState('step-3');
  const [activeRole, setActiveRole] = useState('storyboarder');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAudioDockExpanded, setIsAudioDockExpanded] = useState(true);
  const [parseResult, setParseResult] = useState<ScriptParseResult | null>(null);

  const handleScriptParsed = (result: ScriptParseResult) => {
    setParseResult(result);
    toast.success(
      `解析成功！获取 ${result.episodes.length} 集，共 ${result.totalShots} 个分镜镜头`
    );
  };

  return (
    <div className={styles.container}>
      {/* ── 🎬 Sticky Header: 项目上下文与 4 角色 Toggle ── */}
      <div className="flex items-center justify-between p-3.5 px-5 rounded-2xl bg-slate-950/80 border border-[#00f5d4]/30 backdrop-blur-xl mb-4 shadow-[0_0_24px_rgba(0,245,212,0.1)] flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00f5d4]/10 border border-[#00f5d4]/30 flex items-center justify-center text-[#00f5d4]">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">当前编辑漫剧:</span>
              <span className="text-sm font-bold text-slate-100">
                {activeProject?.name || '未选定项目 (极速草稿车间)'}
              </span>
              <Badge className="bg-[#00f5d4]/10 text-[#00f5d4] border-[#00f5d4]/30 text-[10px]">
                {(activeProject as any)?.stage || 'Stage 3 · 分镜 4K 构建'}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              画风: {(activeProject as any)?.artStyle || '日系二次元'} · 画幅:{' '}
              {(activeProject as any)?.aspectRatio || '16:9 4K'}
            </p>
          </div>
        </div>

        {/* 4 角色 Perspective Badge Bar */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#00f5d4] text-slate-950 shadow-[0_0_12px_rgba(0,245,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {role.name}
              </button>
            );
          })}
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#00f5d4] hover:bg-[#00f5d4]/80 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(0,245,212,0.3)]"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          新建项目
        </Button>
      </div>

      {/* ── ⚡ 6-Step 霓虹连线发光节点 Track ── */}
      <div className={styles.pipelineTrack}>
        <div className={styles.pipelineConnectingLine} />
        {SOP_NODES.map((node) => {
          const isActive = activeStepId === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setActiveStepId(node.id)}
              className={`${styles.pipelineNode} ${isActive ? styles.nodeActive : ''}`}
            >
              <div
                className={styles.nodeDot}
                style={{ background: isActive ? node.color : undefined }}
              />
              <div className="text-center">
                <span className={styles.nodeTitle}>{node.title}</span>
                <div className={styles.nodeSub}>{node.step}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 🏛️ 双栏 Workspace 结构 (70% Main + 30% Right Inspector) ── */}
      <div className={styles.studioGrid}>
        {/* Left Main Workspace Area */}
        <div className={styles.mainWorkspace}>
          {activeStepId === 'step-1' && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
              <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00f5d4]" />
                Stage 1: 剧本智能拆解与镜头推导 (Writer Station)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                导入 TXT/MD 小说剧本，AI 提取情绪高光点与生成标准化镜头表达
              </p>
              <ScriptSourceManager onScriptParsed={handleScriptParsed} />
            </div>
          )}

          {activeStepId === 'step-2' && <AssetVaultPanel />}

          {activeStepId === 'step-3' && (
            <div className="space-y-4">
              <StoryboardEditor projectId={activeProject?.id || 'demo-project'} />
            </div>
          )}

          {activeStepId === 'step-4' && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
              <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                <Music className="w-4 h-4 text-[#00f5d4]" />
                Stage 4: 情感化音轨与音效合成 (Producer Station)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                绑定角色多声线 TTS、音效轨与背景音乐 BGM，实现音画精准对齐
              </p>
            </div>
          )}

          {activeStepId === 'step-5' && <AuditReviewPanel />}

          {activeStepId === 'step-6' && (
            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
              <Film className="w-12 h-12 text-[#00f5d4] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-100 mb-1">
                Stage 6: 4K 原生全量渲染与完工导出
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                支持打包输出 4K 60fps MP4 漫剧成片、独立音轨分轨文件与三视图资产包
              </p>
              <MangaButton variant="primary" size="lg">
                <Play className="w-4 h-4 mr-2 fill-current" />
                开启 4K 硬件加速渲染导出
              </MangaButton>
            </div>
          )}
        </div>

        {/* Right Inspector Drawer (30% Width) */}
        <div className={styles.inspectorDrawer}>
          {/* Active Asset Vault Quick Preview */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#00f5d4]" />
                角色一致性资产
              </span>
              <span className="text-[10px] text-[#00f5d4] font-mono">100% 锁定</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&q=80"
                  alt="林修"
                  className="w-10 h-10 rounded-lg object-cover border border-[#00f5d4]/40"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-100 block truncate">
                    林修 (主角)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">Seed: 8942105</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                  alt="苏瑶"
                  className="w-10 h-10 rounded-lg object-cover border border-[#a855f7]/40"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-100 block truncate">
                    苏瑶 (女主)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">Seed: 4321098</span>
                </div>
              </div>
            </div>
          </div>

          {/* Director Rejection Ticket Stream */}
          <AuditReviewPanel />

          {/* Model Acceleration Monitor */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#a855f7]" />
                算力与 AI 引擎状态
              </span>
              <span className="text-[10px] text-[#34d399] font-mono">NVENC 🟢</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              目前绑定: 可灵 3.0 Omni 4K 60fps / Qwen 3.8-Max
            </p>
          </div>
        </div>
      </div>

      {/* ── 🎵 底部悬浮/折叠 3 轨音频波形 Dock ── */}
      <div className={styles.audioDock}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#00f5d4]" />
            <span className="font-bold text-xs text-slate-100">
              3 轨音频波形 Preview (音画精准对齐)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              时间轴: 00:01:24 / 00:03:30
            </span>
          </div>
          <button
            onClick={() => setIsAudioDockExpanded(!isAudioDockExpanded)}
            className="text-slate-400 hover:text-white p-1"
          >
            {isAudioDockExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>

        {isAudioDockExpanded && (
          <div className="space-y-2 pt-1">
            {/* 对话轨 */}
            <div className={styles.waveTrack}>
              <span className="text-[10px] font-bold text-[#00f5d4] w-12 font-mono">💬 对话</span>
              <div className="flex-1 h-5 bg-slate-950/80 rounded border border-slate-800 overflow-hidden flex items-center px-2 gap-0.5">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#00f5d4] rounded-full"
                    style={{ height: `${(i % 5) * 20 + 20}%`, opacity: i > 25 ? 0.3 : 0.9 }}
                  />
                ))}
              </div>
            </div>

            {/* 音乐轨 */}
            <div className={styles.waveTrack}>
              <span className="text-[10px] font-bold text-[#a855f7] w-12 font-mono">🎵 BGM</span>
              <div className="flex-1 h-5 bg-slate-950/80 rounded border border-slate-800 overflow-hidden flex items-center px-2 gap-0.5">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#a855f7] rounded-full"
                    style={{ height: `${(i % 3) * 30 + 10}%`, opacity: 0.8 }}
                  />
                ))}
              </div>
            </div>

            {/* 特效轨 */}
            <div className={styles.waveTrack}>
              <span className="text-[10px] font-bold text-[#ec4899] w-12 font-mono">💥 特效</span>
              <div className="flex-1 h-5 bg-slate-950/80 rounded border border-slate-800 overflow-hidden flex items-center px-2 gap-0.5">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#ec4899] rounded-full"
                    style={{ height: `${i % 7 === 0 ? 90 : 15}%`, opacity: i % 7 === 0 ? 1 : 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 新建项目 Modal */}
      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
};

export default WorkflowPage;
