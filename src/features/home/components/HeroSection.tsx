import { Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

import styles from './HeroSection.module.less';

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
 * 首页英雄区域组件 — 赛博朋克霓虹沉浸式版本
 */
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.hero}>
      {/* Background effects */}
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
        {/* Tech Badge */}
        <div className={styles.badge}>
          <Sparkles className="h-3.5 w-3.5" />
          <span>Tauri v2 + React 19 + Rust 原生驱动的 AI 漫剧平台</span>
        </div>

        {/* Brand Logo Row */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="relative group">
            <img
              src="/mangav_brand_logo.jpg"
              alt="MangaV Logo"
              className="w-16 h-16 rounded-2xl transition-transform duration-500 group-hover:scale-110"
              style={{
                border: '1.5px solid rgba(0,245,212,0.5)',
                boxShadow: '0 0 16px rgba(0,245,212,0.3), 0 0 40px rgba(0,245,212,0.15)',
              }}
            />
            {/* Rotating border ring */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                border: '1px solid rgba(0,245,212,0.4)',
                animation: 'spin 4s linear infinite',
                borderRadius: '18px',
              }}
            />
          </div>
          <img
            src="/mangav_brand_text.jpg"
            alt="MangaV 漫织 AI"
            className="h-14 object-contain"
            style={{ filter: 'drop-shadow(0 0 12px rgba(0,245,212,0.5))' }}
          />
        </div>

        {/* Main Subtitle */}
        <p className={styles.subtitle}>
          将小说剧本一键精织为专业级多集漫剧视频
          <br className={styles.br} />
          支持分镜生成、角色一致性、多音轨 TTS 与硬件加速渲染
        </p>

        {/* CTA Buttons */}
        <div className={styles.heroButtons}>
          <Button
            size="lg"
            variant="gradient"
            onClick={() => navigate('/project/new')}
            className={styles.primaryButton}
          >
            <Plus className="mr-2 h-4 w-4" />
            创建新项目
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/editor')}
            className={styles.secondaryButton}
          >
            继续上次项目
          </Button>
        </div>

        {/* Hero Banner */}
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

        <p className={styles.hint}>免费体验 · 角色分工 · 质检打回闭环 · 4K 高精渲染</p>
      </div>
    </div>
  );
};

export default HeroSection;
