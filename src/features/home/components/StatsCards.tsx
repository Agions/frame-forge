import { Video, Star, Flame, Cpu } from 'lucide-react';
import React from 'react';

import type { ProjectData } from '@/shared/types';

interface StatsCardsProps {
  projects: ProjectData[];
}

/**
 * 首页统计卡片组件 — 赛博朋克深色玻璃拟态版 (v0.0.1)
 */
function StatsCards({ projects }: StatsCardsProps) {
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const processingCount = projects.filter((p) => p.status === 'processing').length;
  const draftCount = projects.filter((p) => !p.status || p.status === 'draft').length;

  const stats = [
    {
      title: '漫剧项目总数',
      value: projects.length,
      unit: '个项目',
      icon: Video,
      color: '#00f5d4',
      bgGlow: 'rgba(0, 245, 212, 0.15)',
      borderColor: 'rgba(0, 245, 212, 0.3)',
      badgeText: 'Live Storage',
    },
    {
      title: '已完成 4K 渲染',
      value: completedCount,
      unit: '部作品',
      icon: Star,
      color: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.15)',
      borderColor: 'rgba(168, 85, 247, 0.3)',
      badgeText: 'Ready to Export',
    },
    {
      title: 'SOP 流水线处理中',
      value: processingCount > 0 ? processingCount : draftCount,
      unit: '个草稿/流程',
      icon: Flame,
      color: '#fbbf24',
      bgGlow: 'rgba(251, 191, 36, 0.15)',
      borderColor: 'rgba(251, 191, 36, 0.3)',
      badgeText: 'Active Pipeline',
    },
    {
      title: '已绑定 AI 模型',
      value: 13,
      unit: '大模型集成',
      icon: Cpu,
      color: '#ec4899',
      bgGlow: 'rgba(236, 72, 153, 0.15)',
      borderColor: 'rgba(236, 72, 153, 0.3)',
      badgeText: 'Multi-Modal',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="relative overflow-hidden p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-300 hover:translate-y-[-2px] group"
          style={{
            borderColor: stat.borderColor,
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`,
          }}
        >
          {/* Top subtle glow */}
          <div
            className="absolute -top-12 -right-12 w-28 h-28 rounded-full filter blur-2xl opacity-40 group-hover:opacity-80 transition-opacity"
            style={{ background: stat.color }}
          />

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform"
              style={{
                background: stat.bgGlow,
                borderColor: stat.borderColor,
                color: stat.color,
              }}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
              style={{
                background: stat.bgGlow,
                borderColor: stat.borderColor,
                color: stat.color,
              }}
            >
              {stat.badgeText}
            </span>
          </div>

          <div className="relative z-10">
            <p className="text-xs text-slate-400 mb-1">{stat.title}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] text-slate-500">{stat.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
