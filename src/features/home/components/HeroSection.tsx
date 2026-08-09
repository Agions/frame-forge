import {
  Plus,
  Wand2,
  FileText,
  Play,
  Flame,
  Sparkles,
  Clapperboard,
  Users,
  Film,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CreateProjectModal from '@/shared/components/project/CreateProjectModal';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';

const SAMPLE_SCRIPTS = [
  {
    title: '【赛博修仙】数字元神与机械灵脉',
    genre: '科幻修仙',
    episodes: '全 12 集',
    desc: '在 2099 年的赛博修仙界，李云霄借助数字元神侵入天道服务器，反抗脑机修仙财阀的统治。',
    snippet: `第一章：数字元神觉醒

夜色笼罩着深霄市的钛合金高楼，霓虹雨打在李云霄的金属手臂上，迸发出刺目的火花。
李云霄：“天道服务器的防护墙，也不过如此。”
他闭上双眼，脑机接口瞬间过载，一道金色的数字元神化作飞剑，径直刺入黑神轨财阀的核心数据中枢！`,
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

const PIPELINE_STEPS = [
  { id: 1, name: '角色设计', icon: Users, done: true },
  { id: 2, name: '故事设计', icon: FileText, done: true },
  { id: 3, name: '动画生成', icon: Film, active: true },
  { id: 4, name: '后期制作', icon: Clapperboard, done: false },
  { id: 5, name: '导出', icon: Share2, done: false },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSelectSample = (sample: (typeof SAMPLE_SCRIPTS)[0]) => {
    setIsSampleModalOpen(false);
    navigate('/workflow', { state: { sampleContent: sample.snippet, sampleTitle: sample.title } });
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Gemini AI 设计稿 100% 对齐：门面级 4K 漫剧 Hero 展台 */}
      <div className="studio-card p-5 md:p-7 relative overflow-hidden border border-[var(--border)] rounded-3xl space-y-6">
        {/* 背景高光与渐变 */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 展台大卡片两栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* 左侧 & 中间：主视听播放器与 SOP 步骤指示器 */}
          <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
            {/* 标题与 SOP 阶段 Pills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-2">
                    漫剧创作车间
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-bold">
                      PRO Studio
                    </span>
                  </h1>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    AI 漫画 & 动画视频制作工作室 · 极速 GPU 硬件加速编解码
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="studio-btn-primary text-xs px-3.5 py-1.5 rounded-xl border-0 shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    新建工程
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsSampleModalOpen(true)}
                    className="bg-transparent border border-[var(--border)] hover:bg-white/10 text-[var(--foreground)] text-xs px-3.5 py-1.5 rounded-xl cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    剧本范例
                  </Button>
                </div>
              </div>

              {/* SOP 阶段 Step Badges (与 Gemini Mockup 100% 对齐) */}
              <div className="p-3 rounded-2xl bg-white/5 border border-[var(--border)] flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-sm">
                    阶段 3: 动画生成
                  </span>
                  <span className="text-[11px] font-mono text-[var(--muted-foreground)] font-bold">
                    03/05
                  </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-3 shrink-0 text-xs">
                  {PIPELINE_STEPS.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                          step.active
                            ? 'bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/40'
                            : step.done
                              ? 'text-emerald-400'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">{step.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 16:9 高清视听 Player (Gemini 展台核心) */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/60 border border-[var(--border)] group shadow-2xl flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80"
                alt="漫剧 4K 展台"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* 播放按钮 Overlay (绝对居中 100% Center Positioning) */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 transition-transform hover:scale-110 cursor-pointer border-0 z-20"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>

              {/* 渲染进度条 Overlay (Gemini 效果) */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-indigo-400 font-bold animate-pulse">渲染中... 78%</span>
                  <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[78%] transition-all duration-300" />
                  </div>
                </div>
                <span className="text-slate-300 text-[11px]">02:45 / 05:30</span>
              </div>
            </div>
          </div>

          {/* 右侧：当前焦点工程面板 (Gemini 右面板) */}
          <div className="p-4 rounded-2xl bg-white/5 border border-[var(--border)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  当前工程：星际漫游者
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                  4K 渲染中
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>画幅规范:</span>
                  <span className="text-[var(--foreground)] font-mono font-bold">16:9 (3840x2160)</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>帧率 FPS:</span>
                  <span className="text-[var(--foreground)] font-mono font-bold">25 FPS 60fps 插帧</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>分镜总数:</span>
                  <span className="text-indigo-400 font-mono font-bold">18 帧 (第 14 帧)</span>
                </div>
              </div>

              {/* 关键帧缩略图 preview */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
                  alt="帧 1"
                  className="rounded-lg border border-[var(--border)] aspect-video object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"
                  alt="帧 2"
                  className="rounded-lg border border-[var(--border)] aspect-video object-cover"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <Button
                size="sm"
                onClick={() => navigate('/workflow')}
                className="studio-btn-primary w-full text-xs py-2 rounded-xl"
              >
                <Wand2 className="w-3.5 h-3.5 mr-1" />
                继续创作
              </Button>

              <Button
                size="sm"
                onClick={() => navigate('/project/proj-demo-1')}
                className="w-full bg-transparent border border-[var(--border)] hover:bg-white/10 text-[var(--foreground)] text-xs py-2 rounded-xl"
              >
                4K 压制导出
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 剧本范例 Dialog */}
      <Dialog open={isSampleModalOpen} onOpenChange={setIsSampleModalOpen}>
        <DialogContent className="max-w-2xl studio-card p-6 border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Flame className="w-5 h-5 text-indigo-400" />
              选择热门漫剧剧本范例
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)]">
              点击下方范例一键载入 AI 创作向导，体验全自动剧本拆解与分镜
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
            {SAMPLE_SCRIPTS.map((sample, index) => (
              <div
                key={index}
                onClick={() => handleSelectSample(sample)}
                className="p-4 rounded-xl bg-transparent border border-[var(--border)] hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-105 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/30">
                    {sample.genre}
                  </span>
                  <h5 className="font-bold text-xs text-[var(--foreground)] mt-2">
                    {sample.title}
                  </h5>
                  <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-3 mt-1 leading-relaxed">
                    {sample.desc}
                  </p>
                </div>
                <Button size="sm" className="w-full studio-btn-primary text-[11px] py-1 mt-2">
                  载入范例 ▶
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 新建工程 Modal */}
      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
};

export default HeroSection;
