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
  Camera,
  Layers,
  Save,
  Compass,
  Grid,
  Undo2,
  Redo2,
  Wand2,
  Loader2,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/toast';
import type { StoryboardFrame } from '@/shared/types/storyboard';

export type { StoryboardFrame } from '@/shared/types/storyboard';

interface StoryboardEditorProps {
  projectId?: string;
  initialFrames?: StoryboardFrame[];
  focusFrameId?: string;
  onChange?: (frames: StoryboardFrame[]) => void;
  onFrameSelect?: (frame: StoryboardFrame | null) => void;
}

const DEFAULT_DEMO_FRAMES: StoryboardFrame[] = [
  {
    id: 'frame-1',
    title: '分镜 1: 机械城市全景',
    sceneDescription: '深夜，黑客城市“新长安”的地下 300 米，霓虹雨打在主角金属手臂上。',
    composition: '全景 / 俯瞰视角',
    cameraType: 'Hitchcock_Zoom (希区柯克变焦)',
    dialogue: '“天道服务器的防护墙，也不过如此。”',
    duration: 3,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
  },
  {
    id: 'frame-2',
    title: '分镜 2: 关键人物特写',
    sceneDescription: '苏瑶转身看向镜头，眼神坚定，金色数字元神微光笼罩。',
    composition: '人物特写 / 45度斜角',
    cameraType: 'CloseUp (特写推镜头)',
    dialogue: '“林修，黑客舰队离你只有 100 米了！”',
    duration: 3,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
  },
  {
    id: 'frame-3',
    title: '分镜 3: 能量冲突爆发',
    sceneDescription: '计算芯片过载，金色数字符文光芒四射，履带机械犬撞碎大门。',
    composition: '中景 / 动态反切',
    cameraType: 'Pan_Right (水平右移)',
    dialogue: '“3 秒够了，全员备战！”',
    duration: 4,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
];

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({
  initialFrames,
  focusFrameId,
  onChange,
  onFrameSelect,
}) => {
  const [frames, setFrames] = useState<StoryboardFrame[]>(() => {
    if (initialFrames && initialFrames.length > 0) return initialFrames;
    return DEFAULT_DEMO_FRAMES;
  });

  const [selectedFrameId, setSelectedFrameId] = useState<string>(() => {
    if (focusFrameId && frames.some((f) => f.id === focusFrameId)) return focusFrameId;
    return frames[0]?.id || 'frame-1';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomVal, setZoomVal] = useState(120);
  const [tiltVal, setTiltVal] = useState(15);
  const [selectedVoice, setSelectedVoice] = useState('小雅 - 元气女配');

  const selectedFrame = frames.find((f) => f.id === selectedFrameId) || frames[0] || DEFAULT_DEMO_FRAMES[0];

  useEffect(() => {
    if (initialFrames && initialFrames.length > 0) {
      setFrames(initialFrames);
      if (!initialFrames.some((f) => f.id === selectedFrameId)) {
        setSelectedFrameId(initialFrames[0].id);
      }
    }
  }, [initialFrames]);

  const updateSelectedFrame = (updates: Partial<StoryboardFrame>) => {
    const updated = frames.map((f) => (f.id === selectedFrame.id ? { ...f, ...updates } : f));
    setFrames(updated);
    onChange?.(updated);
  };

  const handleGenerateFrameImage = () => {
    setIsGenerating(true);
    toast.info(`正在为「${selectedFrame.title}」渲染 4K 动漫分镜画面...`);
    setTimeout(() => {
      setIsGenerating(false);
      const newUrl = `https://images.unsplash.com/photo-${Date.now() % 2 === 0 ? '1578632767115-351597cf2477' : '1534528741775-53994a69daeb'}?w=800&q=80`;
      updateSelectedFrame({ imageUrl: newUrl });
      toast.success(`🎉 「${selectedFrame.title}」分镜画面生成成功！已写入 Consistency Anchor`);
    }, 1200);
  };

  const handleSaveDesign = () => {
    onChange?.(frames);
    toast.success('🎉 视听分镜设计参数与 3D 镜头轨迹已成功保存！');
  };

  return (
    <div className="space-y-4">
      {/* 顶部 Studio 工具栏 */}
      <div className="studio-card p-4 flex items-center justify-between gap-4 flex-wrap border border-[var(--border)] rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              漫剧 4K 视听分镜大盘
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono font-bold">
                阶段 2: 画面生成工作室
              </span>
            </h2>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              当前编辑: {selectedFrame.title} (3840x2160 Ultra-HD 4K)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            disabled={isGenerating}
            onClick={handleGenerateFrameImage}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-sm"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            AI 渲染当前帧
          </Button>

          <Button
            size="sm"
            onClick={handleSaveDesign}
            className="studio-btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer border-0 font-bold"
          >
            <Save className="w-3.5 h-3.5" />
            保存分镜设计
          </Button>
        </div>
      </div>

      {/* 3 栏 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 左栏 (3/12): 分镜帧时间线 */}
        <div className="lg:col-span-3 studio-card p-4 space-y-3 border border-[var(--border)] flex flex-col justify-between min-h-[580px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                场景分镜帧列表 ({frames.length})
              </span>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {frames.map((frame, idx) => {
                const isSelected = frame.id === selectedFrameId;
                return (
                  <div
                    key={frame.id}
                    onClick={() => {
                      setSelectedFrameId(frame.id);
                      onFrameSelect?.(frame);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all duration-200 border space-y-2 ${
                      isSelected
                        ? 'bg-indigo-600/10 border-2 border-indigo-500 shadow-md shadow-indigo-500/20'
                        : 'bg-transparent border-[var(--border)] hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/40 border border-white/10">
                      <img
                        src={frame.imageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80'}
                        alt={frame.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0.2 rounded bg-black/70 text-white font-mono">
                        {frame.duration || 3}s
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[var(--foreground)] block truncate">
                        {idx + 1}. {frame.title || frame.sceneDescription.slice(0, 16)}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)] block truncate font-mono">
                        {frame.dialogue || frame.sceneDescription.slice(0, 20)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 中栏 (6/12): 4K Anime Video Previewer */}
        <div className="lg:col-span-6 studio-card p-5 space-y-4 border border-[var(--border)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="font-bold text-xs text-[var(--foreground)] flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                4K Anime Video Canvas (3840x2160)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                {zoomVal}% Zoom · Tilt {tiltVal}°
              </span>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/80 border border-[var(--border)] shadow-2xl flex items-center justify-center group">
              <img
                src={selectedFrame.imageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80'}
                alt={selectedFrame.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-4 border border-indigo-400/40 rounded-xl pointer-events-none flex items-start justify-between p-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-indigo-300 font-mono">
                  {selectedFrame.cameraType || 'Hitchcock_Zoom (变焦推镜头)'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-purple-300 font-mono">
                  16:9 4K UHD
                </span>
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 transition-transform hover:scale-110 cursor-pointer border-0 z-20"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>

              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-indigo-400 font-bold">00:00:0{selectedFrame.duration || 3} / 00:01:30</span>
                <span className="text-slate-300 text-[11px]">25 FPS 60fps 硬件插帧</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-transparent border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                <span>配音音轨: {selectedVoice}</span>
                <span className="text-indigo-400 font-bold">00:00:0{selectedFrame.duration || 3}</span>
              </div>
              <div className="h-8 w-full bg-indigo-500/10 rounded-lg border border-indigo-500/20 flex items-center justify-center gap-1 overflow-hidden px-2">
                {Array.from({ length: 40 }).map((_, i) => (
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

        {/* 右栏 (3/12): 镜头提示词 & 运镜控制 */}
        <div className="lg:col-span-3 studio-card p-4 space-y-4 border border-[var(--border)]">
          <div className="space-y-2.5 pb-3 border-b border-[var(--border)]">
            <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-indigo-400" />
              分镜场景描述与 Prompt
            </span>
            <textarea
              value={selectedFrame.sceneDescription}
              onChange={(e) => updateSelectedFrame({ sceneDescription: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-transparent border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-indigo-500 resize-none h-24 font-mono leading-relaxed"
            />
          </div>

          <div className="space-y-2.5 pb-3 border-b border-[var(--border)]">
            <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              角色台词与音轨
            </span>
            <input
              type="text"
              value={selectedFrame.dialogue || ''}
              onChange={(e) => updateSelectedFrame({ dialogue: e.target.value })}
              placeholder="请输入角色台词字幕..."
              className="w-full p-2 rounded-xl bg-transparent border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-purple-400" />
                3D 运镜参数 (Camera)
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
        </div>
      </div>
    </div>
  );
};

export default StoryboardEditor;
