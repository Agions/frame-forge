import { Plus, Sparkles, FileText, Wand2, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';

import styles from './HeroSection.module.less';

const SAMPLE_SCRIPTS = [
  {
    title: '【赛博修仙】数字元神与机械灵脉',
    genre: '科幻修仙',
    episodes: '全 12 集',
    desc: '在 2099 年的赛博修仙界，李云霄借助数字元神侵入天道服务器，反抗脑机修仙财阀的残酷统治。',
    snippet: `第一章：数字元神觉醒

夜色笼罩着深霄市的钛合金高楼，霓虹雨打在李云霄的金属手臂上，迸发出刺目的火花。
李云霄：“天道服务器的防护墙，也不过如此。”
他闭上双眼，脑机接口瞬间过载，一道金色的数字元神化作飞剑，径直刺入黑神话财阀的核心数据中枢！`,
  },
  {
    title: '【都市战神】龙王归来之隐性首富',
    genre: '都市热血',
    episodes: '全 24 集',
    desc: '隐姓埋名三年的战神陆天龙重新出山，挥手间执掌万亿资本，护娇妻斩情仇。',
    snippet: `第一章：战神解封

江城拍卖会上，众人肆意嘲笑身着简朴工装的陆天龙。
财阀少爷：“区区一个实习生，也敢竞拍这枚龙神戒指？”
陆天龙冷笑一声，缓缓亮出暗黑金卡。
黑金秘书推门而入：“禀告战神，三千龙卫已到达战场，万亿资产随时听候调遣！”`,
  },
  {
    title: '【规则怪谈】千万别看后视镜',
    genre: '悬疑惊悚',
    episodes: '全 8 集',
    desc: '诡异复苏，苏明继承了一辆编号 404 的夜间公交车，只要遵循守则便能在这诡异规则中存活。',
    snippet: `第一章：守则第一条

【夜间公交驾驶守则】
1. 听到后排哭声时，千万不要看后视镜。
2. 遇到穿红色风衣的乘客，请在下一站立刻开启车门。
苏明握紧方向盘，手心全掌出汗。此时，车内后排突然传来低沉刺耳的哭泣声...`,
  },
];

const ROLE_CARDS = [
  {
    imageIcon: '/writer_role_icon.jpg',
    alt: '编剧',
    title: '编剧 · 剧本构演',
    desc: '小说剧情拆解、人设建模与镜头台词拟定',
    colorClass: styles.roleCardCyan,
  },
  {
    imageIcon: '/storyboarder_role_icon.jpg',
    alt: '分镜师',
    title: '分镜师 · 视听绘制',
    desc: 'Master Protocol 锁定形象，AI 漫画画幅绘制',
    colorClass: styles.roleCardPurple,
  },
  {
    imageIcon: '/animator_role_icon.jpg',
    alt: '制作师',
    title: '制作师 · 渲染合成',
    desc: 'EdgeTTS/CosyVoice 多音轨合成与硬件加速 4K 导出',
    colorClass: styles.roleCardPink,
  },
  {
    imageIcon: '/auditor_role_icon.jpg',
    alt: '审核员',
    title: '审核员 · 质检打回',
    desc: '全流程产物审核评估，驳回建议录入与闭环流转',
    colorClass: styles.roleCardGreen,
  },
];

/**
 * 首页英雄区域组件 — 赛博朋克深色专业工作站版 (v0.0.1)
 */
const HeroSection = () => {
  const navigate = useNavigate();
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const handleSelectSample = (sample: (typeof SAMPLE_SCRIPTS)[0]) => {
    setIsSampleModalOpen(false);
    navigate('/workflow', { state: { sampleContent: sample.snippet, sampleTitle: sample.title } });
  };

  return (
    <div className={styles.hero}>
      {/* Background ambient lighting */}
      <div className={styles.glow} />
      <div className={styles.glowSecondary} />
      <div className={styles.grid} />
      <div className={styles.scanLine} />

      {/* Floating particles */}
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={styles.particle} />
        ))}
      </div>

      <div className={styles.heroContent}>
        {/* Version Tech Badge */}
        <div className={styles.badge}>
          <div className="mangav-pulse-dot" />
          <span>v0.0.1 · Tauri v2 + React 19 + Rust 原生驱动的 AI 漫剧创作平台</span>
        </div>

        {/* Brand Header Group */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="relative group">
            <img
              src="/mangav_brand_logo.jpg"
              alt="MangaV Logo"
              className="w-16 h-16 rounded-2xl transition-transform duration-500 group-hover:scale-110 shadow-[0_0_24px_rgba(0,245,212,0.4)] border border-[#00f5d4]/40"
            />
          </div>
          <img
            src="/mangav_brand_text.jpg"
            alt="MangaV 漫织 AI"
            className="h-14 object-contain filter drop-shadow-[0_0_16px_rgba(0,245,212,0.6)]"
          />
        </div>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          输入一本小说，AI 自动精织为 4K 原生视听漫剧
          <br className={styles.br} />
          集成了 13 大 AI 大模型、视听多模态与 FFmpeg 硬件加速压制引擎
        </p>

        {/* 3-Action Hero Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto my-6 text-left">
          <div
            onClick={() => navigate('/workflow')}
            className="group cursor-pointer p-4 rounded-2xl bg-slate-900/60 border border-[#00f5d4]/20 hover:border-[#00f5d4]/60 hover:bg-slate-900/90 transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,245,212,0.2)]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#00f5d4]/10 border border-[#00f5d4]/30 flex items-center justify-center text-[#00f5d4] group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#00f5d4] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-[#00f5d4] transition-colors">
              📖 剧本一键导入
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              粘贴小说 TXT/MD，自动抽取角色与分镜列表
            </p>
          </div>

          <div
            onClick={() => setIsSampleModalOpen(true)}
            className="group cursor-pointer p-4 rounded-2xl bg-slate-900/60 border border-[#a855f7]/20 hover:border-[#a855f7]/60 hover:bg-slate-900/90 transition-all shadow-lg hover:shadow-[0_0_24px_rgba(168,85,247,0.2)]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7] group-hover:scale-110 transition-transform">
                <Wand2 className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-[#a855f7] transition-colors">
              ⚡ 热门漫剧灵感模板
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              体验【赛博修仙】、【都市战神】与【规则怪谈】
            </p>
          </div>

          <div
            onClick={() => navigate('/project/new')}
            className="group cursor-pointer p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 hover:border-slate-500 hover:bg-slate-900/90 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">
              ➕ 自定义新建项目
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              手动配置画风、分辨率、目标分集与专属 AI 模型
            </p>
          </div>
        </div>

        {/* Hero Banner Key Visual */}
        <div className={styles.heroBanner}>
          <img
            src="/mangav_hero_banner.jpg"
            alt="MangaV AI Key Visual"
            className={styles.heroBannerImg}
          />
        </div>

        {/* 4-Role Cards */}
        <div className={styles.roleGrid}>
          {ROLE_CARDS.map((card) => (
            <div key={card.alt} className={`${styles.roleCard} ${card.colorClass}`}>
              <div className={styles.roleCardIconWrap}>
                <img src={card.imageIcon} alt={card.alt} className="w-full h-full object-cover" />
              </div>
              <span className={styles.roleCardTitle}>{card.title}</span>
              <p className={styles.roleCardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>

        <p className={styles.hint}>多模型适配 · 角色分工 · 质检打回闭环 · 4K 原生画质</p>
      </div>

      {/* Sample Script Filler Modal */}
      <Dialog open={isSampleModalOpen} onOpenChange={setIsSampleModalOpen}>
        <DialogContent className="bg-slate-950/95 border border-[#00f5d4]/30 text-slate-100 max-w-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#00f5d4]">
              <Sparkles className="w-5 h-5" />
              选择热门漫剧预设模板
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              选择一个预设脚本模板，一键带入 SOP 漫剧流水线体验全流程自动生成
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2 max-h-[60vh] overflow-y-auto pr-1">
            {SAMPLE_SCRIPTS.map((sample) => (
              <div
                key={sample.title}
                onClick={() => handleSelectSample(sample)}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#00f5d4]/50 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-100 group-hover:text-[#00f5d4] transition-colors">
                    {sample.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30">
                    {sample.genre} · {sample.episodes}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2 leading-relaxed">{sample.desc}</p>
                <div className="p-2.5 rounded-lg bg-slate-950/70 text-[11px] text-slate-300 font-mono line-clamp-2 border border-slate-800/80">
                  {sample.snippet}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroSection;
