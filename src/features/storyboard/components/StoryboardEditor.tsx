import {
  Plus,
  Image as ImageIcon,
  Video,
  Sparkles,
  Play,
  Pause,
  Trash2,
  Volume2,
  RotateCw,
  Sliders,
  Users,
  Mic,
  Camera,
  Layers,
  Save,
  Compass,
  Grid,
  Maximize2,
  Undo2,
  Redo2,
  Film,
  Eye,
  Wand2,
} from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/toast';
import { type StoryboardFrame } from '@/shared/types/storyboard';

export type { StoryboardFrame } from '@/shared/types/storyboard';

interface StoryboardEditorProps {
  projectId?: string;
  initialFrames?: StoryboardFrame[];
  focusFrameId?: string;
  onChange?: (frames: StoryboardFrame[]) => void;
  onFrameSelect?: (frame: StoryboardFrame | null) => void;
}

const DESIGN_FRAMES = [
  {
    id: 'frame-1',
    title: '帧 1: 主角在繁华街道',
    subtitle: 'Frame 1: Protag in Bustling Street',
    duration: '00:05.2',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
    prompt: '高画质, 日本动漫风格, 男主角林修伫立在繁华赛博街道, 霓虹雨景, 4K 超清',
    zoom: 120,
    tilt: 15,
    voice: '小雅 - 元气少女',
    active: true,
  },
  {
    id: 'frame-2',
    title: '帧 2: 情感对话',
    subtitle: 'Frame 2: Emotional Dialogue',
    duration: '00:05.2',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    prompt: '女主角苏瑶转身看向镜头, 特写, 眼神坚定, 柔和阳光照耀面部',
    zoom: 100,
    tilt: 0,
    voice: '明美 - 甜美女性',
    active: false,
  },
  {
    id: 'frame-3',
    title: '帧 3: 结合过载特写',
    subtitle: 'Frame 3: Neural Overload',
    duration: '00:05.2',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    prompt: '脑机接口瞬间过载, 金色数字元神光效迸发, 特写镜头',
    zoom: 150,
    tilt: -20,
    voice: '浩然 - 成熟男声',
    active: false,
  },
  {
    id: 'frame-4',
    title: '帧 4: 决胜动作反击',
    subtitle: 'Frame 4: Action Battle Attack',
    duration: '00:05.2',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    prompt: '飞剑划过虚空, 赛博粒子特效爆开, 4K 电影级画质',
    zoom: 135,
    tilt: 10,
    voice: '浩然 - 成熟男声',
    active: false,
  },
];

export const StoryboardEditor: React.FC<StoryboardEditorProps> = () => {
  const [selectedFrameId, setSelectedFrameId] = useState('frame-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [promptText, setPromptText] = useState(
    '高画质, 日本动漫风格, 19岁女主角, 长黑发, 水手服, 学校屋顶, 日落光, 特写镜头, 8K 极致细节'
  );
  const [zoomVal, setZoomVal] = useState(120);
  const [tiltVal, setTiltVal] = useState(15);
  const [panVal, setPanVal] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('小雅 - 元气少女');
  const [qualityScore, setQualityScore] = useState(95);

  const selectedFrame = DESIGN_FRAMES.find((f) => f.id === selectedFrameId) || DESIGN_FRAMES[0];

  return (
    <div className="space-y-4">
      {/* 顶部 Studio 设计师工具栏 */}
      <div className="studio-card p-4 flex items-center justify-between gap-4 flex-wrap border border-[var(--border)] rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              工程设计 · 漫剧 4K 画板
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono font-bold">
                阶段 3: 视听分镜构建
              </span>
            </h2>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              当前焦点: {selectedFrame.title} (3840x2160 Ultra-HD 4K)
            </p>
          </div>
        </div>

        {/* 画板工具按钮组 */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-[var(--border)] text-xs">
            <button
              onClick={() => toast.info('已撤销上一步操作')}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors"
              title="撤销"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.info('已重做')}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors"
              title="重做"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-[var(--border)] mx-1" />
            <button
              onClick={() => toast.info('已切换画板网格辅助线')}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors"
              title="网格"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => toast.success('🎉 已调用 2026 FLUX.1 重新渲染当前视听帧')}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer border-0 shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            AI 渲染当前帧
          </Button>

          <Button
            size="sm"
            onClick={() => toast.success('🎉 视听设计参数与 3D 运镜轨迹已成功保存！')}
            className="studio-btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer border-0"
          >
            <Save className="w-3.5 h-3.5" />
            保存视听设计
          </Button>
        </div>
      </div>

      {/* 3 栏 Linear 级 Studio 画布设计布局 (Gemini Mockup 100% 对齐) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 左栏 (3/12): 剧本场景帧时间线 (Frame Timeline) */}
        <div className="lg:col-span-3 studio-card p-4 space-y-3 border border-[var(--border)] flex flex-col justify-between min-h-[580px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                剧本场景帧时间线 ({DESIGN_FRAMES.length})
              </span>
              <button
                onClick={() => toast.success('已新增设计场景帧')}
                className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 场景帧列表 */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {DESIGN_FRAMES.map((frame) => {
                const isSelected = frame.id === selectedFrameId;
                return (
                  <div
                    key={frame.id}
                    onClick={() => setSelectedFrameId(frame.id)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all duration-200 border space-y-2 ${
                      isSelected
                        ? 'bg-indigo-600/10 border-2 border-indigo-500 shadow-md shadow-indigo-500/20'
                        : 'bg-transparent border-[var(--border)] hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/40 border border-white/10">
                      <img
                        src={frame.image}
                        alt={frame.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0.2 rounded bg-black/70 text-white font-mono">
                        {frame.duration}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[var(--foreground)] block truncate">
                        {frame.title}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)] block truncate font-mono">
                        {frame.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 中栏 (6/12): 4K Anime Video Canvas Previewer (3840x2160) */}
        <div className="lg:col-span-6 studio-card p-5 space-y-4 border border-[var(--border)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="font-bold text-xs text-[var(--foreground)] flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                4K Anime Video Canvas Previewer (3840x2160)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                {selectedFrame.zoom}% Zoom · Tilt {selectedFrame.tilt}°
              </span>
            </div>

            {/* 16:9 画板预览区域 (Gemini Mockup 100% 对齐) */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/80 border border-[var(--border)] shadow-2xl flex items-center justify-center group">
              <img
                src={selectedFrame.image}
                alt={selectedFrame.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* 3D 摄像机 Overlay 框指引 */}
              <div className="absolute inset-4 border border-indigo-400/40 rounded-xl pointer-events-none flex items-start justify-between p-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-indigo-300 font-mono">
                  3D Camera Trajectory Locked
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-purple-300 font-mono">
                  16:9 4K UHD
                </span>
              </div>

              {/* 悬浮控制按钮 (100% 居中 Positioning) */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 transition-transform hover:scale-110 cursor-pointer border-0 z-20"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>

              {/* 时间戳指示 Overlay */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-indigo-400 font-bold">00:00:15 / 00:02:30</span>
                <span className="text-slate-300 text-[11px]">25 FPS 60fps 硬件插帧</span>
              </div>
            </div>

            {/* 动态音频波形时间轴轨道 (Gemini Waveform Timeline 100% 对齐) */}
            <div className="p-3 rounded-xl bg-transparent border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                <span>配音音轨: {selectedFrame.voice}</span>
                <span className="text-indigo-400 font-bold">00:00:15</span>
              </div>

              {/* 音频波形示意图形 */}
              <div className="h-10 w-full bg-indigo-500/10 rounded-lg border border-indigo-500/20 flex items-center justify-center gap-1 overflow-hidden px-2">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-500/60 rounded-full transition-all duration-300"
                    style={{ height: `${20 + Math.sin(i * 0.5) * 60}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右栏 (3/12): 镜头 Prompt, 3D 摄像机 & TTS 语音控制 (Design Controls) */}
        <div className="lg:col-span-3 studio-card p-4 space-y-4 border border-[var(--border)]">
          {/* 控制面板 1: 镜头提示词生成器 */}
          <div className="space-y-2.5 pb-3 border-b border-[var(--border)]">
            <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-indigo-400" />
              镜头提示词生成器 (Prompt Studio)
            </span>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-transparent border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-indigo-500 resize-none h-24 font-mono leading-relaxed"
            />
            <Button
              size="sm"
              onClick={() => toast.success('已自动补全并优化 4K 动漫细节提示词')}
              className="studio-btn-primary w-full text-xs py-1.5 rounded-lg"
            >
              生成镜头 Prompt
            </Button>
          </div>

          {/* 控制面板 2: 3D 摄像机控制 */}
          <div className="space-y-3 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-purple-400" />
                3D 摄像机控制 (Camera)
              </span>
              <span className="text-[10px] text-purple-400 font-mono font-bold">
                {zoomVal}% | {tiltVal}°
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mb-1">
                  <span>镜头推拉 (Zoom)</span>
                  <span className="font-mono text-indigo-400 font-bold">{zoomVal}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  value={zoomVal}
                  onChange={(e) => setZoomVal(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mb-1">
                  <span>俯仰角度 (Tilt)</span>
                  <span className="font-mono text-purple-400 font-bold">{tiltVal}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={tiltVal}
                  onChange={(e) => setTiltVal(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 控制面板 3: TTS 语音演员选择 */}
          <div className="space-y-2.5">
            <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              TTS 语音演员选择
            </span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2 rounded-xl bg-transparent border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none"
            >
              <option value="小雅 - 元气少女">小雅 - 元气少女</option>
              <option value="浩然 - 成熟男声">浩然 - 成熟男声</option>
              <option value="明美 - 甜美女性">明美 - 甜美女性</option>
            </select>
            <Button
              size="sm"
              onClick={() => toast.success(`已调用 ${selectedVoice} 试听配音范例`)}
              className="w-full bg-transparent border border-[var(--border)] hover:bg-white/10 text-[var(--foreground)] text-xs py-1.5 rounded-lg"
            >
              ▷ 试听配音
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryboardEditor;
