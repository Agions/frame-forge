import React from 'react';

import { Separator } from '@/shared/components/ui/separator';
import { useProjectStore } from '@/shared/stores/project-store';

import HeroSection from './HeroSection';
import styles from './Home.module.less';
import ProjectGrid from './ProjectGrid';
import StatsCards from './StatsCards';

/**
 * 首页视图组件 — 极致精简与纯粹专注版
 * 专注于 Hero 欢迎引导、近期项目呈现与数据统计
 */
const HomeView = () => {
  const store = useProjectStore();

  const handleProjectRefresh = () => {
    // 项目数据来自 store，自动同步
  };

  const projects =
    typeof store?.recentProjects === 'function' ? store.recentProjects() : store?.projects || [];

  return (
    <div className={styles.container}>
      {/* 沉浸式 Hero 欢迎区 */}
      <HeroSection />

      {/* 项目统计仪表盘 */}
      <StatsCards projects={projects} />

      {/* 近期项目管理网格 */}
      <ProjectGrid projects={projects} loading={false} onRefresh={handleProjectRefresh} />

      {/* 精简页脚 */}
      <div className={styles.footer}>
        <Separator className="my-6 opacity-30" />
        <div className="flex items-center gap-2 justify-center flex-wrap pb-4">
          <span className="text-muted-foreground text-xs">© 2026 MangaV (漫织 AI) Pro Studio</span>
          <Separator orientation="vertical" className="h-3" />
          <span className="text-muted-foreground text-xs">Tauri v2 + React 19 + Rust Engine</span>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
