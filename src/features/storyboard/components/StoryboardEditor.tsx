/**
 * 资深架构级分镜工作台 (Studio 3-Column Storyboard Workbench)
 * 具备 3 栏极客画布视口、预设 Chip 点击高亮、AI 镜头渲染与对白音轨对齐
 */
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Scissors,
  Crosshair,
  ArrowLeftRight,
  Sparkles,
  Play,
  Copy,
  Trash2,
  MoveUp,
  MoveDown,
  Layers,
  Wand2,
  Film,
  Camera,
  Maximize2,
  Eye,
  LayoutGrid,
  Columns,
  Volume2,
} from 'lucide-react';
import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Slider } from '@/shared/components/ui/slider';
import { toast } from '@/shared/components/ui/toast';
import { type StoryboardFrame } from '@/shared/types/storyboard';
import { generateFrameId } from '@/shared/utils';

import styles from './StoryboardEditor.module.less';

export type { StoryboardFrame } from '@/shared/types/storyboard';

// 景别预设
const CAMERA_PRESETS = [
  { value: 'wide', label: '全景', icon: Crosshair },
  { value: 'medium', label: '中景', icon: Video },
  { value: 'closeup', label: '特写', icon: Scissors },
  { value: 'pan', label: '横摇运镜', icon: ArrowLeftRight },
  { value: 'tilt', label: '俯仰运镜', icon: Camera },
  { value: 'dolly', label: '推拉镜头', icon: Film },
  { value: 'tracking', label: '跟随跟拍', icon: Video },
];

// 构图预设
const COMPOSITION_PRESETS = [
  '三分法',
  '中心构图',
  '黄金螺旋',
  '引导线',
  '框架构图',
  '留白对称',
  '斜向对角',
  '三角形构图',
];

interface StoryboardEditorProps {
  projectId?: string;
  initialFrames?: StoryboardFrame[];
  focusFrameId?: string;
  onChange?: (frames: StoryboardFrame[]) => void;
  onFrameSelect?: (frame: StoryboardFrame | null) => void;
}

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({
  initialFrames = [],
  focusFrameId,
  onChange,
  onFrameSelect,
}) => {
  const [frames, setFrames] = useState<StoryboardFrame[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(
    initialFrames.length > 0 ? initialFrames[0].id : null
  );
  const [viewMode, setViewMode] = useState<'studio' | 'grid'>('studio');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    if (!focusFrameId) return;
    const focusFrame = frames.find((frame) => frame.id === focusFrameId);
    if (!focusFrame) return;
    const id = setTimeout(() => {
      setSelectedFrameId(focusFrameId);
      onFrameSelect?.(focusFrame);
    }, 0);
    return () => clearTimeout(id);
  }, [focusFrameId, frames, onFrameSelect]);

  const selectedFrame = useMemo(
    () => frames.find((f) => f.id === selectedFrameId) || (frames[0] ?? null),
    [frames, selectedFrameId]
  );

  const selectedIndex = useMemo(
    () => (selectedFrame ? frames.findIndex((f) => f.id === selectedFrame.id) : 0),
    [frames, selectedFrame]
  );

  const totalDuration = useMemo(
    () => frames.reduce((acc, f) => acc + (f.duration || 5), 0),
    [frames]
  );

  // 添加分镜
  const addFrame = useCallback(() => {
    const newFrame: StoryboardFrame = {
      id: generateFrameId(),
      title: `镜头 #${frames.length + 1}`,
      sceneDescription: '主角走入古朴的小巷，周围笼罩着一层淡蓝色的晨雾...',
      composition: '三分法',
      cameraType: 'medium',
      dialogue: '萧炎: "三十年河东，莫欺少年穷！"',
      duration: 5,
    };

    const updatedFrames = [...frames, newFrame];
    setFrames(updatedFrames);
    setSelectedFrameId(newFrame.id);
    onChange?.(updatedFrames);
    onFrameSelect?.(newFrame);
    toast.success('新建分镜成功');
  }, [frames, onChange, onFrameSelect]);

  // 克隆分镜
  const duplicateFrame = useCallback(
    (frameToDuplicate: StoryboardFrame) => {
      const newFrame: StoryboardFrame = {
        ...frameToDuplicate,
        id: generateFrameId(),
        title: `${frameToDuplicate.title} (副本)`,
      };
      const index = frames.findIndex((f) => f.id === frameToDuplicate.id);
      const updatedFrames = [...frames];
      updatedFrames.splice(index + 1, 0, newFrame);
      setFrames(updatedFrames);
      setSelectedFrameId(newFrame.id);
      onChange?.(updatedFrames);
      toast.success('副本复制成功');
    },
    [frames, onChange]
  );

  // 删除分镜
  const removeFrame = useCallback(
    (id: string) => {
      if (frames.length <= 1) {
        toast.warning('至少需要保留一个分镜镜头');
        return;
      }
      const updatedFrames = frames.filter((f) => f.id !== id);
      setFrames(updatedFrames);

      if (selectedFrameId === id) {
        const newSelected = updatedFrames[0]?.id || null;
        setSelectedFrameId(newSelected);
        onFrameSelect?.(updatedFrames[0] || null);
      }

      onChange?.(updatedFrames);
      toast.success('分镜删除成功');
    },
    [frames, selectedFrameId, onChange, onFrameSelect]
  );

  // 移动分镜顺序
  const moveFrame = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= frames.length) return;

      const updated = [...frames];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      setFrames(updated);
      onChange?.(updated);
    },
    [frames, onChange]
  );

  // 更新分镜属性
  const updateFrame = useCallback(
    (id: string, field: keyof StoryboardFrame, value: any) => {
      const updatedFrames = frames.map((f) => (f.id === id ? { ...f, [field]: value } : f));
      setFrames(updatedFrames);
      onChange?.(updatedFrames);

      if (id === selectedFrameId) {
        const updated = updatedFrames.find((f) => f.id === id);
        if (updated) onFrameSelect?.(updated);
      }
    },
    [frames, selectedFrameId, onChange, onFrameSelect]
  );

  // AI 模拟重绘渲染镜头
  const handleAIRenderShot = async (frameId: string) => {
    setIsGeneratingImage(true);
    toast.info('正在调度 AI 生成高精镜头画面...');

    setTimeout(() => {
      const sampleImages = [
        '/sample-shot-1.jpg',
        '/sample-shot-2.jpg',
        '/sample-shot-3.jpg',
        '/banner.jpg',
      ];
      const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      updateFrame(frameId, 'imageUrl', randomImg);
      setIsGeneratingImage(false);
      toast.success('AI 8K 画风镜头渲染就绪！');
    }, 1200);
  };

  return (
    <div className={styles.container}>
      {/* 顶部工作台状态与控制栏 */}
      <div className={styles.workbenchHeader}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerIcon}>
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h4 className={styles.headerTitle}>SOP 漫剧分镜工作台</h4>
            <span className={styles.headerSubtitle}>三栏镜头调度 · AI 构图与画风渲染引擎</span>
          </div>
        </div>

        {/* 核心指标 Badge */}
        <div className={styles.headerStats}>
          <div className={styles.statItem}>
            <span>总镜头:</span>
            <span className={styles.statValue}>{frames.length} 个</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className={styles.statItem}>
            <span>预估时长:</span>
            <span className={styles.statValue}>{totalDuration}s</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className={styles.statItem}>
            <span>当前选中:</span>
            <span className="text-indigo-400 font-semibold">#{selectedIndex + 1}</span>
          </div>
        </div>

        {/* 视图控制与快捷动作 */}
        <div className={styles.headerActions}>
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('studio')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'studio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              三栏检视 View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              画板视角 View
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={addFrame} className="gap-1.5">
            <Plus className="w-4 h-4 text-emerald-400" />
            新建镜头
          </Button>
        </div>
      </div>

      {/* 主工作区 — 三栏检视视图 */}
      {viewMode === 'studio' ? (
        <div className={styles.mainLayout}>
          {/* 左侧分镜序列卷轴 Panel */}
          <div className={styles.leftPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                <Layers className="w-4 h-4 text-indigo-400" />
                分镜镜头卷轴 ({frames.length})
              </span>
              <Button size="sm" variant="ghost" onClick={addFrame}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className={styles.frameList}>
              {frames.map((frame, index) => {
                const isSelected = selectedFrame?.id === frame.id;
                return (
                  <div
                    key={frame.id}
                    className={`${styles.frameCard} ${isSelected ? styles.frameCardActive : ''}`}
                    onClick={() => {
                      setSelectedFrameId(frame.id);
                      onFrameSelect?.(frame);
                    }}
                  >
                    <div className={styles.frameThumbWrapper}>
                      <span className={styles.frameBadge}>#{index + 1}</span>
                      {frame.imageUrl ? (
                        <img
                          src={frame.imageUrl}
                          alt={frame.title}
                          className={styles.frameThumbImage}
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div className={styles.frameInfo}>
                      <div className={styles.frameHeaderRow}>
                        <span className={styles.frameTitle}>
                          {frame.title || `镜头 #${index + 1}`}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {frame.duration || 5}s
                        </span>
                      </div>

                      <div className={styles.frameMetaTags}>
                        <span className={`${styles.metaTag} ${styles.metaTagHighlight}`}>
                          {frame.cameraType || '中景'}
                        </span>
                        <span className={styles.metaTag}>{frame.composition || '三分法'}</span>
                      </div>

                      <div className="flex items-center gap-1 mt-2">
                        <button
                          title="向上移动"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFrame(index, 'up');
                          }}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          title="向下移动"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFrame(index, 'down');
                          }}
                          disabled={index === frames.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          title="复制副本"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateFrame(frame);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-400 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          title="删除镜头"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFrame(frame.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 中央 Monitor / Canvas Panel */}
          <div className={styles.centerPanel}>
            <div className={styles.canvasViewportHeader}>
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                监视视口: {selectedFrame ? selectedFrame.title : '未选中镜头'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">比例: 16 : 9 HD</span>
                <Button size="sm" variant="ghost">
                  <Maximize2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className={styles.viewportContainer}>
              {selectedFrame ? (
                <div className={styles.heroCanvasCard}>
                  {selectedFrame.imageUrl ? (
                    <img
                      src={selectedFrame.imageUrl}
                      alt={selectedFrame.title}
                      className={styles.heroCanvasImage}
                    />
                  ) : (
                    <div className={styles.canvasEmptyState}>
                      <div className={styles.emptyIconCircle}>
                        <Wand2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200">AI 镜头画面未渲染</h4>
                      <p className="text-xs text-slate-400 max-w-sm">
                        点击右侧“AI 渲染此镜头”利用 SDXL / Midjourney 预设引擎一键推导 8K 画面
                      </p>
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isGeneratingImage}
                        onClick={() => handleAIRenderShot(selectedFrame.id)}
                        className="gap-2 mt-2"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        {isGeneratingImage ? '8K 渲染中...' : '一键 AI 渲染此镜头'}
                      </Button>
                    </div>
                  )}

                  {/* 对白字幕弹窗 overlay */}
                  {selectedFrame.dialogue && (
                    <div className={styles.canvasSubtitleBar}>
                      <span className={styles.subtitleText}>
                        <Volume2 className="w-4 h-4 text-indigo-400 inline-block mr-2" />
                        {selectedFrame.dialogue}
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* 监视器底栏控制段 */}
            <div className={styles.canvasControlBar}>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={selectedIndex <= 0}
                  onClick={() => {
                    if (selectedIndex > 0) {
                      const prev = frames[selectedIndex - 1];
                      setSelectedFrameId(prev.id);
                      onFrameSelect?.(prev);
                    }
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  上一镜头
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={selectedIndex >= frames.length - 1}
                  onClick={() => {
                    if (selectedIndex < frames.length - 1) {
                      const next = frames[selectedIndex + 1];
                      setSelectedFrameId(next.id);
                      onFrameSelect?.(next);
                    }
                  }}
                >
                  下一镜头
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {selectedFrame && (
                <Button
                  size="sm"
                  variant="primary"
                  disabled={isGeneratingImage}
                  onClick={() => handleAIRenderShot(selectedFrame.id)}
                  className="gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {isGeneratingImage ? '重绘渲染中...' : 'AI 重新绘制此镜头'}
                </Button>
              )}
            </div>
          </div>

          {/* 右侧镜头 Inspector Panel */}
          <div className={styles.rightPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                <Wand2 className="w-4 h-4 text-indigo-400" />
                镜头属性与 AI 提示词工坊
              </span>
            </div>

            {selectedFrame ? (
              <div className={styles.inspectorContent}>
                {/* 基础属性 */}
                <div className={styles.inspectorSection}>
                  <label className={styles.sectionLabel}>📌 基础属性</label>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">镜头标题</span>
                      <Input
                        value={selectedFrame.title}
                        onChange={(e) => updateFrame(selectedFrame.id, 'title', e.target.value)}
                        placeholder="输入镜头标题"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">镜头时长 (秒)</span>
                        <span className="text-indigo-400 font-semibold">
                          {selectedFrame.duration || 5} 秒
                        </span>
                      </div>
                      <Slider
                        min={1}
                        max={30}
                        value={selectedFrame.duration || 5}
                        onChange={(val) => updateFrame(selectedFrame.id, 'duration', val)}
                      />
                    </div>
                  </div>
                </div>

                {/* 景别 Preset Chips */}
                <div className={styles.inspectorSection}>
                  <label className={styles.sectionLabel}>🎥 景别运镜选择</label>
                  <div className={styles.chipGrid}>
                    {CAMERA_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      const isActive = selectedFrame.cameraType === preset.value;
                      return (
                        <div
                          key={preset.value}
                          onClick={() => updateFrame(selectedFrame.id, 'cameraType', preset.value)}
                          className={`${styles.presetChip} ${isActive ? styles.presetChipActive : ''}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{preset.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 构图 Preset Chips */}
                <div className={styles.inspectorSection}>
                  <label className={styles.sectionLabel}>📐 镜头构图法则</label>
                  <div className={styles.chipGrid}>
                    {COMPOSITION_PRESETS.map((comp) => {
                      const isActive = selectedFrame.composition === comp;
                      return (
                        <div
                          key={comp}
                          onClick={() => updateFrame(selectedFrame.id, 'composition', comp)}
                          className={`${styles.presetChip} ${isActive ? styles.presetChipActive : ''}`}
                        >
                          <span>{comp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 场景画面提示词 Prompt */}
                <div className={styles.inspectorSection}>
                  <div className="flex items-center justify-between">
                    <label className={styles.sectionLabel}>🪄 AI 画面场景提示词 (Prompt)</label>
                    <button
                      onClick={() => {
                        updateFrame(
                          selectedFrame.id,
                          'sceneDescription',
                          `${selectedFrame.sceneDescription}，8k分辨率，高清质感，电影级冷调打光，虚化背景`
                        );
                        toast.success('已自动注入 AI 画风润色词！');
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      AI 一键润色
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={selectedFrame.sceneDescription}
                    onChange={(e) =>
                      updateFrame(selectedFrame.id, 'sceneDescription', e.target.value)
                    }
                    placeholder="请输入详细的画面光影、环境描述与角色动作细节..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* 角色对白与配音 */}
                <div className={styles.inspectorSection}>
                  <label className={styles.sectionLabel}>🗣️ 角色对白与配音字幕</label>
                  <textarea
                    rows={3}
                    value={selectedFrame.dialogue || ''}
                    onChange={(e) => updateFrame(selectedFrame.id, 'dialogue', e.target.value)}
                    placeholder="萧炎: “三十年河东，三十年河西...”"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">请先选择分镜镜头</div>
            )}
          </div>
        </div>
      ) : (
        /* 画板视角 (Grid Board View) */
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frames.map((frame, index) => (
            <div
              key={frame.id}
              onClick={() => {
                setSelectedFrameId(frame.id);
                setViewMode('studio');
              }}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500 rounded-2xl overflow-hidden p-4 transition-all hover:shadow-xl cursor-pointer group"
            >
              <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden mb-3 border border-slate-800 flex items-center justify-center">
                {frame.imageUrl ? (
                  <img
                    src={frame.imageUrl}
                    alt={frame.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Wand2 className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                    <span className="text-xs text-slate-500">点击进入极客视图生成画面</span>
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-400 border border-slate-700">
                  镜头 #{index + 1}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-bold text-slate-100">{frame.title}</h5>
                <span className="text-xs text-slate-400 font-mono">{frame.duration || 5}s</span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {frame.sceneDescription || '暂无画面描述'}
              </p>

              {frame.dialogue && (
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs text-indigo-300 mb-3">
                  {frame.dialogue}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-500">景别: {frame.cameraType || '中景'}</span>
                <span className="text-xs text-indigo-400 group-hover:underline">点击编辑 →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryboardEditor;
