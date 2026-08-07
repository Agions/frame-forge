---
layout: home
title: MangaV (漫织 AI)
titleTemplate: false

hero:
  name: 'MangaV (漫织 AI)'
  text: '端到端 AI 漫剧创作平台'
  tagline: '输入一本小说，AI 自动生成 4K 精致漫剧——你只需要按「开始」'
  image:
    src: /mangav_brand_logo.jpg
    alt: MangaV (漫织 AI)
  actions:
    - theme: brand
      text: 快速开始 →
      link: /getting-started/installation
    - theme: alt
      text: 架构设计
      link: /developer-guide/architecture
    - theme: alt
      text: GitHub ⭐
      link: https://github.com/Agions/mangav

features:
  - icon: 🎬
    title: 6 步 SOP 极速工作流
    details: 从小说导入到 4K 视频输出的端到端自动化，全流程 Quality Gate 质量校验
  - icon: 🧠
    title: 13 大 AI 提供商矩阵
    details: 包含 DeepSeek-V4、Qwen 3.8-Max、腾讯 Hy3、百度 ERNIE 5.1、GPT-5.6、Claude Opus 5，内置文字/图片/视频三大分类矩阵
  - icon: ⚡
    title: 桌面级原生 GPU 加载
    details: Tauri v2 + React 19 + Rust Engine，原生 VideoToolbox / NVENC 硬件编解码加速
  - icon: 🔄
    title: 质量自修复 & Checkpoint
    details: Self-Review Loop 自动校验重试（≤3 次）+ 30s 自动 Checkpoint 断点续传
  - icon: 🎙️
    title: 视听一体化渲染
    details: 多声道 TTS 配音、字幕生成、帧同步，包含可灵 3.0 Omni、Seedance 2.5 视频生成引擎
  - icon: 🏗️
    title: 赛博朋克极暗 Design System
    details: 现代感黑底 Neon Cyberpunk UI、流光进度条、沉浸式剧本输入面板与十套热门漫剧模板
---

<!-- 为什么选择 -->

<div class="vp-section-header">
  <h2 class="vp-section-title">为什么选择 MangaV (漫织 AI)？</h2>
  <p class="vp-section-sub">市面上唯一的<strong>高性能开源桌面端</strong> AI 漫剧创作平台。数据完全本地、MIT 协议、无云端锁死。</p>
</div>

<div class="vp-why-grid">
  <div class="vp-why-card">
    <div class="vp-why-icon">🔒</div>
    <div class="vp-why-title">100% 本地数据隐私</div>
    <div class="vp-why-desc">所有 Key 加密保存在本地系统 Keyring，作品工程与分镜资产全本地存储，无云端隐私泄露。</div>
  </div>
  <div class="vp-why-card">
    <div class="vp-why-icon">🤖</div>
    <div class="vp-why-title">全自动化 Pipeline</div>
    <div class="vp-why-desc">Autonomous 全自动模式下，导入小说 → AI 自动分场 → 生成漫剧视频，一键极速成片。</div>
  </div>
  <div class="vp-why-card">
    <div class="vp-why-icon">🛠️</div>
    <div class="vp-why-title">13 大模型与官方快捷申请</div>
    <div class="vp-why-desc">原生集成 13 大 AI 提供商真实 API，并提供官方控制台一键申请 API Key 快捷入口。</div>
  </div>
</div>

<!-- 工作流 -->

<div class="vp-section-header">
  <h2 class="vp-section-title">6 步 SOP 智能漫剧创作流水线</h2>
  <p class="vp-section-sub">从原始文本到 4K 成片的端到端自动化流程</p>
</div>

<div class="vp-workflow">
  <div class="vp-step">
    <div class="vp-step-num">1</div>
    <div class="vp-step-body">
      <div class="vp-step-title">导入文本 <code>IMPORT</code></div>
      <div class="vp-step-desc">小说 / 剧本导入 → 沉浸编辑器 + 拖拽解析 + 预设热门模板</div>
    </div>
    <div class="vp-step-arrow">→</div>
  </div>
  <div class="vp-step">
    <div class="vp-step-num">2</div>
    <div class="vp-step-body">
      <div class="vp-step-title">AI 大纲分析 <code>ANALYSIS</code></div>
      <div class="vp-step-desc">故事高潮提炼 + 角色脉络提取 + 场景与高光镜头标注</div>
    </div>
    <div class="vp-step-arrow">→</div>
  </div>
  <div class="vp-step">
    <div class="vp-step-num">3</div>
    <div class="vp-step-body">
      <div class="vp-step-title">分场剧本生成 <code>SCRIPT</code></div>
      <div class="vp-step-desc">标准分镜剧本（镜头景别 + 旁白对白 + 动作指导）</div>
    </div>
    <div class="vp-step-arrow">→</div>
  </div>
  <div class="vp-step">
    <div class="vp-step-num">4</div>
    <div class="vp-step-body">
      <div class="vp-step-title">角色三视图设定 <code>CHARACTER</code></div>
      <div class="vp-step-desc">角色一致性卡片 + 姿态设定 + 提示词锁定</div>
    </div>
    <div class="vp-step-arrow">→</div>
  </div>
  <div class="vp-step">
    <div class="vp-step-num">5</div>
    <div class="vp-step-body">
      <div class="vp-step-title">分镜画面绘制 <code>STORYBOARD</code></div>
      <div class="vp-step-desc">关键帧画面生成 + 景别控制 + 多角色构图</div>
    </div>
    <div class="vp-step-arrow">→</div>
  </div>
  <div class="vp-step">
    <div class="vp-step-num">6</div>
    <div class="vp-step-body">
      <div class="vp-step-title">视频音效渲染 <code>SYNTHESIS</code></div>
      <div class="vp-step-desc">TTS 配音 + 物理运镜动效 + FFmpeg 硬编导出 4K 视频</div>
    </div>
    <div class="vp-step-arrow">→</div>
  </div>
</div>

<!-- 数据 -->

<div class="vp-section-header">
  <h2 class="vp-section-title">项目数据 (v0.0.1 Studio)</h2>
</div>

<div class="vp-stats-row">
  <div class="vp-stat">
    <div class="vp-stat-num">13</div>
    <div class="vp-stat-label">AI 提供商支持</div>
    <div class="vp-stat-sub">DeepSeek/Qwen/Hy3/ERNIE/GPT</div>
  </div>
  <div class="vp-stat">
    <div class="vp-stat-num">3</div>
    <div class="vp-stat-label">模型分类矩阵</div>
    <div class="vp-stat-sub">文字 · 图片 · 视频</div>
  </div>
  <div class="vp-stat">
    <div class="vp-stat-num">10</div>
    <div class="vp-stat-label">内置热门漫剧模板</div>
    <div class="vp-stat-sub">修仙/战神/赛博/怪谈</div>
  </div>
  <div class="vp-stat">
    <div class="vp-stat-num">6</div>
    <div class="vp-stat-label">SOP 步骤</div>
    <div class="vp-stat-sub">端到端自动化</div>
  </div>
</div>

<!-- CTA -->

<div class="vp-cta">
  <h2 class="vp-cta-title">准备开始创作？</h2>
  <p class="vp-cta-sub">3 步跑通你的第一个 4K AI 漫剧</p>
  <div class="vp-cta-actions">
    <a href="/getting-started/installation" class="vp-cta-btn vp-cta-btn-brand">安装指南 →</a>
    <a href="/getting-started/quick-start" class="vp-cta-btn">快速开始</a>
    <a href="/user-guide/workflow-overview" class="vp-cta-btn">了解 SOP 工作流</a>
  </div>
</div>
