import {
  Home,
  Workflow,
  Plus,
  Zap,
  Sun,
  Moon,
  Laptop,
  Settings,
  RefreshCw,
  HelpCircle,
  BookOpen,
  Info,
  X,
  Sparkles,
  Layers,
  Cpu,
  Film,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import React, { PropsWithChildren, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from '@/app/providers/ThemeContext';
import CreateProjectModal from '@/shared/components/project/CreateProjectModal';
import { Button } from '@/shared/components/ui/button';
import { AutoUpdaterModal } from '@/shared/components/updater/AutoUpdaterModal';
import { WorkflowEngine } from '@mangav/core';

import styles from './AppLayout.module.less';
import { AppLayoutProps } from './types';

const STAGES = [
  { key: 'Draft', label: '① 草稿导入' },
  { key: 'ScriptParsed', label: '② 剧本拆解' },
  { key: 'StoryboardGenerated', label: '③ 分镜构建' },
  { key: 'AudioSynthesized', label: '④ 音轨合成' },
  { key: 'Rendering', label: '⑤ 硬件渲染' },
  { key: 'Completed', label: '⑥ 完工导出' },
];

const NAV_ITEMS = [
  { key: 'home', path: '/', icon: Home, label: '首页概览', exact: true },
  { key: 'workflow', path: '/workflow', icon: Workflow, label: 'SOP 创作车间', exact: false },
  { key: 'settings', path: '/settings', icon: Settings, label: '系统设置', exact: false },
];

// 6 阶精炼 SOP 步骤描述（避免过多冗余内容）
const SOP_STAGES_DOC = [
  {
    step: 'Stage 1',
    title: '草稿与剧本导入',
    stageKey: 'Draft',
    desc: '粘贴 txt/md 文本小说，AI 语义格式化段落，自动提取人物列表与高光剧情点。',
  },
  {
    step: 'Stage 2',
    title: 'AI 剧本分镜拆解',
    stageKey: 'ScriptParsed',
    desc: '推导近景/全景/特写镜头与视角标注，生成结构化镜头台词与画面 Prompt 规则。',
  },
  {
    step: 'Stage 3',
    title: '角色一致性与画幅绘制',
    stageKey: 'StoryboardGenerated',
    desc: '通过 Master Reference 协议锁定角色发型、五官与着装，批量绘制高清漫画分镜。',
  },
  {
    step: 'Stage 4',
    title: '多音轨 TTS 语音合成',
    stageKey: 'AudioSynthesized',
    desc: 'EdgeTTS/CosyVoice 情感配音，毫秒级对齐角色对话轨、背景音乐轨与音效轨。',
  },
  {
    step: 'Stage 5',
    title: '硬件加速场景渲染',
    stageKey: 'Rendering',
    desc: '调度 VideoToolbox / NVENC 硬件压制引擎，合成 Pan/Zoom 运镜与微动视差。',
  },
  {
    step: 'Stage 6',
    title: '4K 完工与平台分发',
    stageKey: 'Completed',
    desc: '输出 4K MP4 高精视频与 SRT 多语言字幕包，支持 B站/抖音一键预设规格打包。',
  },
];

const AppLayout = ({ children, header, sidebar, footer }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Modals & Menu State
  const [isUpdaterOpen, setIsUpdaterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const helpRef = useRef<HTMLDivElement>(null);

  // Close help menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setIsHelpMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activePath = location.pathname;

  const currentStage = activePath.includes('edit')
    ? 'StoryboardGenerated'
    : activePath.includes('workflow')
      ? 'ScriptParsed'
      : activePath.includes('new')
        ? 'Draft'
        : 'Draft';

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return activePath === item.path;
    return activePath.startsWith(item.path) && item.path !== '/';
  };

  return (
    <div className={styles.appLayout}>
      {/* ── Top Cyberpunk Studio Header ── */}
      {header || (
        <header className={styles.topHeader}>
          {/* Brand */}
          <div className={styles.brandSection}>
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <img
                  src="/mangav_brand_logo.jpg"
                  alt="MangaV Logo"
                  className="w-7 h-7 rounded-lg shadow-xl border border-[rgba(0,245,212,0.4)] group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 0 12px rgba(0,245,212,0.3), 0 0 24px rgba(0,245,212,0.15)',
                  }}
                />
                <div className="absolute inset-0 rounded-lg border border-[rgba(0,245,212,0.6)] opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
              </div>
              <img
                src="/mangav_brand_text.jpg"
                alt="MangaV 漫织 AI"
                className="h-5 object-contain"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,212,0.4))' }}
              />
              <span className={styles.versionBadge}>v0.0.1 PRO</span>
            </div>
          </div>

          {/* 6-Stage SOP Progress Indicator */}
          <div className={styles.stageBarContainer}>
            {STAGES.map((s) => {
              const active = currentStage === s.key;
              return (
                <div
                  key={s.key}
                  className={`${styles.stageItem} ${active ? styles.activeStage : ''}`}
                  onClick={() => {
                    if (s.key === 'Draft') navigate('/project/new');
                    else if (s.key === 'ScriptParsed') navigate('/workflow');
                    else if (s.key === 'StoryboardGenerated') navigate('/workflow');
                  }}
                >
                  <span className={styles.stageDot} />
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className={styles.topActions}>
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#00f5d4] hover:bg-[#00f5d4]/80 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(0,245,212,0.3)] cursor-pointer mr-1"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              新建漫剧
            </Button>
            {/* Help Dropdown Menu (Mac / System Navigation Help) */}
            <div className={styles.helpDropdownContainer} ref={helpRef}>
              <button
                onClick={() => setIsHelpMenuOpen((prev) => !prev)}
                title="帮助、说明与使用文档"
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: 'rgba(0,245,212,0.06)',
                  border: '1px solid rgba(0,245,212,0.25)',
                  color: '#00f5d4',
                  boxShadow: '0 0 8px rgba(0,245,212,0.15)',
                }}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>帮助 Help</span>
              </button>

              {isHelpMenuOpen && (
                <div className={styles.helpMenu}>
                  <button
                    className={styles.helpMenuItem}
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      setShowDocsModal(true);
                    }}
                  >
                    <BookOpen className="w-4 h-4 text-[#00f5d4]" />
                    <span>📖 操作使用文档</span>
                  </button>
                  <button
                    className={styles.helpMenuItem}
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      setShowAboutModal(true);
                    }}
                  >
                    <Info className="w-4 h-4 text-[#b44fff]" />
                    <span>ℹ️ 项目说明 (SOP)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Check Update */}
            <button
              onClick={() => setIsUpdaterOpen(true)}
              title="检查 GitHub Release 最新推送版本"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              style={{
                background: 'rgba(0,245,212,0.04)',
                border: '1px solid rgba(0,245,212,0.15)',
                color: 'rgba(0,245,212,0.8)',
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>检查更新</span>
            </button>

            {/* HW Badge */}
            <div className={styles.hwBadge}>
              <Zap className="w-3.5 h-3.5" />
              <span>硬件加速</span>
            </div>

            {/* New Project CTA */}
            <button
              onClick={() => navigate('/project/new')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,245,212,0.2) 0%, rgba(180,79,255,0.2) 100%)',
                border: '1px solid rgba(0,245,212,0.5)',
                color: '#00f5d4',
                boxShadow: '0 0 12px rgba(0,245,212,0.2)',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              新建漫剧
            </button>
          </div>
        </header>
      )}

      {/* ── Main Row: Dock + Content ── */}
      <div className={styles.mainRow}>
        {sidebar || (
          <aside className={styles.dockSidebar}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <div
                  key={item.key}
                  title={item.label}
                  className={`${styles.dockItem} ${active ? styles.activeDock : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className={styles.dockIcon}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={styles.dockLabel}>{item.label}</span>
                </div>
              );
            })}

            <div className={styles.dockSpacer} />

            <div
              title="系统设置"
              className={`${styles.dockItem} ${activePath === '/settings' ? styles.activeDock : ''}`}
              onClick={() => navigate('/settings')}
            >
              <div className={styles.dockIcon}>
                <Settings className="w-5 h-5" />
              </div>
              <span className={styles.dockLabel}>系统设置</span>
            </div>
          </aside>
        )}

        {/* Central Content Viewport */}
        <main className={styles.contentViewport}>{children}</main>
      </div>

      {/* ── Cyberpunk Status Bar ── */}
      {footer || (
        <footer className={styles.statusBar}>
          <div className={styles.statusLeft}>
            <span className={styles.statusIndicator} />
            <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>漫织 AI 引擎就绪</span>
            <span className={styles.statusDivider}>│</span>
            <span>FFmpeg 硬件加速启用</span>
          </div>

          <div className={styles.statusRight}>
            <span>Qwen 3.8-Max / DeepSeek-V4 / GPT-5.6</span>
            <span className={styles.statusDivider}>│</span>
            <span>UTF-8</span>
            <span className={styles.statusDivider}>│</span>
            <span style={{ color: 'var(--neon-cyan)' }}>● LIVE</span>
          </div>
        </footer>
      )}

      {/* Auto Updater Modal */}
      <AutoUpdaterModal isOpen={isUpdaterOpen} onClose={() => setIsUpdaterOpen(false)} />

      {/* ── 📖 操作使用文档 Modal ── */}
      {showDocsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDocsModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
                <BookOpen className="w-5 h-5 text-[#00f5d4]" />
                <span>MangaV 漫织 AI · 操作使用文档</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDocsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <h4 className={styles.docsSectionTitle}>
                  <Sparkles className="w-4 h-4" />
                  快速入门指引 (4 步搞定漫剧制作)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[#00f5d4] font-bold block">1. 剧本文本导入</span>
                    <p className="text-[11px] text-slate-400">
                      点击「新建漫剧」，导入 TXT / Markdown 小说文本，AI 智能拆解人物性格与对白。
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[#b44fff] font-bold block">2. 角色一致性锁定</span>
                    <p className="text-[11px] text-slate-400">
                      在分镜绘制阶段生成角色 Reference 锚点卡，防范跨镜头五官与造型漂移。
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[#ff2d78] font-bold block">3. 音效与 TTS 混音</span>
                    <p className="text-[11px] text-slate-400">
                      分配角色 TTS 音色，毫秒级自动对齐对话字幕轨、BGM 背景乐与环境音效 SFX。
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[#00ff88] font-bold block">4. 4K 硬件渲染导出</span>
                    <p className="text-[11px] text-slate-400">
                      调度 VideoToolbox / NVENC 硬编加速引擎，一键压制导出 4K MP4 与 SRT 字幕。
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block">💡 快捷提示与操作技巧</span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                  <li>导航栏左侧图标浮动悬停时自动展开显示文本标签。</li>
                  <li>支持在「SOP 漫剧流水线」按编剧、分镜师、制作师与审核员角色进行视角过滤。</li>
                  <li>算力消耗面板已移入顶部预估徽章，点击徽章随时调出详细消耗分析。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ℹ️ 项目说明 & SOP 流程 Modal ── */}
      {showAboutModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAboutModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
                <Info className="w-5 h-5 text-[#b44fff]" />
                <span>项目说明与 SOP 极简流程</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAboutModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              {/* 架构简介 */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-slate-100 text-sm block mb-1">
                  MangaV (漫织 AI) v0.0.1 Studio
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  基于 Tauri v2 + React 19 + Rust
                  原生引擎打造的视听漫剧创作系统，将文字小说一键精织为专业 4K 漫剧视频。支持 4
                  大角色分工协作与导演驳回闭环机制。
                </p>
              </div>

              {/* 精炼 6 阶 SOP 流水线说明 */}
              <div>
                <span className={styles.docsSectionTitle}>
                  <Layers className="w-4 h-4" />
                  精炼 6 阶 SOP 漫剧生成流水线
                </span>

                <div className={styles.sopGrid}>
                  {SOP_STAGES_DOC.map((item) => (
                    <div key={item.step} className={styles.sopItem}>
                      <span className={styles.sopStepBadge}>
                        {item.step} · {item.title}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 🚀 极速赛博新建项目 Modal ── */}
      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
};

export default AppLayout;

export const AppLayoutHeader = ({ children }: PropsWithChildren) => <>{children}</>;
export const AppLayoutSidebar = ({ children }: PropsWithChildren) => <>{children}</>;
export const AppLayoutContent = ({ children }: PropsWithChildren) => <>{children}</>;
export const AppLayoutFooter = ({ children }: PropsWithChildren) => <>{children}</>;
