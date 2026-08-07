import { Cpu, HardDrive, Zap, ShieldCheck } from 'lucide-react';
import React from 'react';

import { useProjectStore } from '@/shared/stores/project-store';

import HeroSection from './HeroSection';
import styles from './Home.module.less';
import ProjectGrid from './ProjectGrid';
import StatsCards from './StatsCards';

/**
 * 首页视图组件 — 赛博朋克深色专业工作站版 (v0.0.1)
 */
const HomeView = () => {
  const store = useProjectStore();

  const handleProjectRefresh = () => {
    // 项目数据由 store 自动同步
  };

  const projects =
    typeof store?.recentProjects === 'function' ? store.recentProjects() : store?.projects || [];

  return (
    <div className={styles.container}>
      {/* 沉浸式 Cyberpunk Hero 欢迎与快捷入口区 */}
      <HeroSection />

      {/* 统计指标卡片组 */}
      <StatsCards projects={projects} />

      {/* 项目管理与画廊网格 */}
      <ProjectGrid projects={projects} loading={false} onRefresh={handleProjectRefresh} />

      {/* 实时硬件与系统诊断 Footer Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl flex items-center justify-between flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#00f5d4]" />
            <span className="font-bold text-slate-200">MangaV v0.0.1 Studio</span>
          </div>

          <div className="h-3 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-[#00f5d4]" />
            <span>Tauri v2 Native Bridge:</span>
            <span className="text-[#00f5d4] font-mono">Connected 🟢</span>
          </div>

          <div className="h-3 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-400">
            <Zap className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>FFmpeg Hardware Accel:</span>
            <span className="text-[#a855f7] font-mono">NVENC / Metal 🟢</span>
          </div>

          <div className="h-3 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>AI Model Tier:</span>
            <span className="text-[#fbbf24] font-mono">13 Providers 🟢</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          © 2026 MangaV (漫织 AI) Studio · React 19 + Rust Engine
        </div>
      </div>
    </div>
  );
};

export default HomeView;
