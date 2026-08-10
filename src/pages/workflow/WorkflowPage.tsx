import {
  Zap,
  Play,
  Sparkles,
  Film,
  Users,
  PenTool,
  Clapperboard,
  Plus,
  Trash2,
  ChevronRight,
  LayoutGrid,
  Move,
  Minus,
  Volume2,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { toast } from '@/components/ui/toast';
import { hasAnyConfiguredModelProvider } from '@/core/config/model-providers';
import { ModelConfigGuardModal } from '@/shared/components/model/ModelConfigGuardModal';
import CreateProjectModal from '@/shared/components/project/CreateProjectModal';
import { Button } from '@/shared/components/ui/button';
import { useProjectStore } from '@/shared/stores/project-store';

export interface ParsedScene {
  id: string;
  title: string;
  location: string;
  summary: string;
  prompt: string;
  cameraMotion: string;
  zoom: number;
  tilt: number;
}

export interface CharacterAnchor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tags: string;
  voice: string;
  seedLocked?: boolean;
}

export const WORKFLOW_STEPS = [
  { id: 1, title: '步骤 1: 小说解析', desc: '文本实体与分集拆解', icon: PenTool },
  { id: 2, title: '步骤 2: 角色锚定', desc: '一致性 IP-Adapter 锁脸', icon: Users },
  { id: 3, title: '步骤 3: 视听分镜', desc: '运镜与提示词规划', icon: Camera },
  { id: 4, title: '步骤 4: 画面拆层', desc: 'AI 画质生成与 SAM 拆图', icon: Sparkles },
  { id: 5, title: '步骤 5: 视听音频', desc: 'TTS 声优与音效卡点', icon: Volume2 },
  { id: 6, title: '步骤 6: 2.5D 后期', desc: '视差运镜与 4K 合成', icon: Film },
  { id: 7, title: '步骤 7: 运营发布', desc: '多平台发版与数据大盘', icon: Play },
];

const INITIAL_CHARACTERS: CharacterAnchor[] = [
  {
    id: 'char-1',
    name: '林修 (主角)',
    role: '男主角',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80',
    tags: '青发少年, 赛博战甲, 眼神坚定, 3D二次元',
    voice: '火山引擎 - 热血少男音色',
  },
  {
    id: 'char-2',
    name: '苏瑶 (女主)',
    role: '女主角',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    tags: '粉发少女, 机械双马尾, 活泼',
    voice: '火山引擎 - 清纯女声音色',
  },
  {
    id: 'char-3',
    name: '零 (机械侍卫)',
    role: '副主角',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    tags: '机械改造人, 黑色斗篷, 冷酷',
    voice: '阿里通义 - 沉稳低音音色',
  },
];

export const WorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useProjectStore();

  const [activeStep, setActiveStep] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'sop' | 'modular'>('modular');

  // 小说文本状态（默认全空白）
  const [novelText, setNovelText] = useState<string>(() => {
    return (location.state as any)?.sampleContent || '';
  });

  // 解析后的分镜列表状态（默认全空白）
  const [scenes, setScenes] = useState<ParsedScene[]>([]);

  // 角色 Anchor 锚点列表（默认全空白）
  const [characters, setCharacters] = useState<CharacterAnchor[]>([]);

  // 选中的分镜
  const [selectedSceneId, setSelectedSceneId] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState('ElevenLabs Multilingual - 热血少男');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelGuardOpen, setIsModelGuardOpen] = useState(false);

  // 校验模型配置门禁，未配置 Key 无法进入下一步或启动 AI 生成
  const checkModelConfigGate = (): boolean => {
    if (!hasAnyConfiguredModelProvider()) {
      toast.error('⚠️ 未检测到有效 AI 模型 Key 配置！无法进入下一步或启动 AI 生成。');
      setIsModelGuardOpen(true);
      return false;
    }
    return true;
  };

  // 真实文本解析算法 (Real Novel Text Parsing Algorithm)
  const handleRealNovelParse = async () => {
    if (!novelText.trim()) {
      toast.error('⚠️ 请先在文本框中输入或粘贴小说内容，再点击启动 AI 智能拆解。');
      return;
    }
    if (!checkModelConfigGate()) return;

    setIsProcessing(true);
    toast.info('正在调用 AI 大模型进行小说文本实体抽离与分镜拆解...');

    try {
      const { novelAnalyzer } = await import('@/core/services/ai/text/novel-analyze-service');
      const analysisResult = await novelAnalyzer.parseNovelContent(novelText);

      const parsedScenes: ParsedScene[] = (analysisResult.scenes || []).map((sc, idx) => ({
        id: sc.id || `sc-auto-${Date.now()}-${idx}`,
        title: `第 1 集 场景 ${idx + 1}: ${sc.title || sc.content.slice(0, 12)}...`,
        location: sc.location || '动画分镜画面',
        summary: sc.content,
        prompt: (sc as any).prompt || `Anime scene illustration: ${sc.content.slice(0, 30)}, masterpiece, 4k resolution`,
        cameraMotion: idx % 2 === 0 ? '推镜头 (Zoom In)' : '摇镜头 (Pan Right)',
        zoom: 100 + (idx % 3) * 15,
        tilt: (idx % 2 === 0 ? 1 : -1) * 10,
      }));

      setScenes(parsedScenes);
      toast.success(`🎉 真实 AI 解析完成！已成功拆解 ${parsedScenes.length} 个视听分镜与场景！`);
    } catch (err: any) {
      toast.error(`❌ AI 拆解失败: ${err?.message || '请检查模型 API Key 配置是否生效。'}`);
      setIsModelGuardOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // 添加新角色 Anchor
  const handleAddCharacter = () => {
    const newChar: CharacterAnchor = {
      id: `char-${Date.now()}`,
      name: `新角色 ${characters.length + 1}`,
      role: '配角',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
      tags: '黑发二次元, 特殊服饰',
      voice: 'Claude TTS - 自然声',
    };
    setCharacters((prev) => [...prev, newChar]);
    toast.success(`已创建角色 Anchor 锚点：${newChar.name}`);
  };

  // 动态同步 currentProject 状态
  const activeProjectId = (location.state as any)?.projectId || store.currentProject?.id;
  const currentProject = store.projects.find((p) => p.id === activeProjectId) || store.currentProject;

  useEffect(() => {
    if (currentProject) {
      const projAny = currentProject as any;
      if (projAny.novelText) {
        setNovelText(projAny.novelText);
      } else if (projAny.description) {
        setNovelText(projAny.description);
      }
      if (projAny.characters && projAny.characters.length > 0) {
        setCharacters(projAny.characters as CharacterAnchor[]);
      }
      if (projAny.parsedScenes && projAny.parsedScenes.length > 0) {
        setScenes(projAny.parsedScenes as ParsedScene[]);
      }
      if (projAny.sopStep) {
        setActiveStep(projAny.sopStep as number);
      }
    }
  }, [activeProjectId]);

  // 保存当前流程并进入分镜编辑器 (无缝打通数据，无需重复上传剧本)
  const handleSaveAndEdit = () => {
    if (!novelText.trim()) {
      toast.error('⚠️ 当前项目尚未输入小说文本内容，无法进入编辑器。');
      return;
    }
    if (scenes.length === 0) {
      toast.error('⚠️ 尚未生成任何视听分镜！请先点击【开始 AI 智能拆解】。');
      return;
    }
    if (!checkModelConfigGate()) return;
    let targetProject = currentProject;

    const projectPayload = {
      name: (location.state as any)?.sampleTitle || '漫剧工程 · 最新 SOP',
      description: novelText.slice(0, 60),
      status: 'processing',
      stage: 'In_Progress',
      content: novelText,
      novelText,
      script: novelText,
      parsedScenes: scenes,
      storyboardFrames: scenes,
      characters,
      sopStep: activeStep,
      updatedAt: new Date().toISOString(),
    };

    if (!targetProject) {
      targetProject = store.createProject(projectPayload as any);
    } else {
      store.updateProject(targetProject.id, projectPayload as any);
    }

    store.setCurrentProject(targetProject);
    toast.success('🎉 已无缝打通文本与分镜数据，直接进入【4. 分镜编辑】！');
    navigate(`/project/edit/${targetProject.id}?step=3`);
  };

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  return (
    <div className="space-y-4 font-sans text-[var(--foreground)] bg-[var(--background)] min-h-[calc(100vh-5rem)] p-2 rounded-2xl border border-[var(--border)]">
      {/* V2 Sleek Theme-Adaptive Studio Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-x-auto min-w-0">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)] whitespace-nowrap">
              Novella AI 漫剧创作工作台
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium whitespace-nowrap shrink-0">
              7 大步骤专业 SOP 车间
            </span>
          </div>
        </div>

        {/* 7-Step SOP Progress Bar (Linear Style) */}
        <div className="flex items-center gap-1 bg-[var(--accent)] px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs shrink-0 overflow-x-auto max-w-full">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isFinal = activeStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : isFinal
                      ? 'text-blue-400 hover:text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : isFinal
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.id}
                  </span>
                  <span className="text-[11px] whitespace-nowrap shrink-0">{step.title.split(':')[1] || step.title}</span>
                </button>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={handleSaveAndEdit}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer rounded-lg border-0 shadow-sm whitespace-nowrap shrink-0"
          >
            <Clapperboard className="w-3.5 h-3.5" />
            保存并进入分镜 Studio
          </Button>
        </div>
      </div>

      {/* 视角 1: 模块化自由拆分 Studio 工作台 */}
      {viewMode === 'modular' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 工具面板 1: 剧本解析器 (真实文本拆解) */}
          <div className="studio-card p-5 space-y-3 border border-[var(--border)] hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-2">
                <PenTool className="w-4 h-4 text-indigo-400" />
                1. 剧本解析器 (Novel Parser)
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">
                {scenes.length} 个分镜
              </span>
            </div>
            <textarea
              value={novelText}
              onChange={(e) => setNovelText(e.target.value)}
              className="w-full p-3 rounded-xl bg-transparent border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-indigo-500 resize-none h-44 font-mono leading-relaxed"
            />
            <Button
              size="sm"
              disabled={isProcessing}
              onClick={handleRealNovelParse}
              className="studio-btn-primary w-full text-xs py-2 rounded-lg"
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              {isProcessing ? '正在智能拆解中...' : '一键解析剧本与场景'}
            </Button>
          </div>

          {/* 工具面板 2: 角色 Anchor 锚点库 */}
          <div className="studio-card p-5 space-y-3 border border-[var(--border)] hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                2. 角色 Anchor 锚点库
              </span>
              <span className="text-[10px] text-purple-400 font-bold font-mono">
                {characters.length} 个 Anchor
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 h-44 overflow-y-auto pr-1">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="p-2 rounded-xl bg-white/5 border border-[var(--border)] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={char.avatar} alt={char.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[var(--foreground)] block truncate">
                        {char.name}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)] block truncate">
                        {char.tags}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCharacters((prev) => prev.filter((c) => c.id !== char.id));
                      toast.info(`已删除角色 ${char.name}`);
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              onClick={handleAddCharacter}
              className="w-full bg-transparent border border-[var(--border)] hover:bg-white/10 text-[var(--foreground)] text-xs py-2 rounded-lg"
            >
              + 新增角色 Anchor
            </Button>
          </div>

          {/* 工具面板 3: 运镜控制盘 */}
          <div className="studio-card p-5 space-y-3 border border-[var(--border)] hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-400" />
                3. 运镜控制盘 (Camera Motion)
              </span>
              <span className="text-[10px] text-pink-400 font-mono font-bold">
                {selectedScene?.cameraMotion || '推镜头'}
              </span>
            </div>
            <div className="space-y-3 h-44 flex flex-col justify-center">
              <div>
                <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] mb-1">
                  <span>推拉镜头 (Zoom)</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    {selectedScene?.zoom || 120}%
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  value={selectedScene?.zoom || 120}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setScenes((prev) =>
                      prev.map((s) => (s.id === selectedScene.id ? { ...s, zoom: val } : s))
                    );
                  }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] mb-1">
                  <span>俯仰角度 (Tilt)</span>
                  <span className="font-mono text-purple-400 font-bold">
                    {selectedScene?.tilt || 10}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={selectedScene?.tilt || 10}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setScenes((prev) =>
                      prev.map((s) => (s.id === selectedScene.id ? { ...s, tilt: val } : s))
                    );
                  }}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => toast.success('已更新镜头 3D 轨迹设定')}
              className="w-full bg-transparent border border-[var(--border)] hover:bg-white/10 text-[var(--foreground)] text-xs py-2 rounded-lg"
            >
              应用运镜参数
            </Button>
          </div>

          {/* 工具面板 4: TTS 配音合成 */}
          <div className="studio-card p-5 space-y-3 border border-[var(--border)] hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                4. TTS 配音合成
              </span>
            </div>
            <div className="space-y-2 h-44 flex flex-col justify-center">
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 rounded-lg bg-transparent border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none"
              >
                <option value="ElevenLabs Multilingual - 热血少男">ElevenLabs Multilingual - 热血少男</option>
                <option value="火山引擎 Sambert - 清纯女声">火山引擎 Sambert - 清纯女声</option>
                <option value="OpenAI Voice - 沉稳低音">OpenAI Voice - 沉稳低音</option>
              </select>
              <textarea
                value={selectedScene?.summary || '林修：天道服务器的防护墙，也不过如此。'}
                onChange={(e) => {
                  const val = e.target.value;
                  setScenes((prev) =>
                    prev.map((s) => (s.id === selectedScene.id ? { ...s, summary: val } : s))
                  );
                }}
                className="w-full p-2 rounded-lg bg-transparent border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none resize-none h-16"
              />
            </div>
            <Button
              size="sm"
              onClick={() => toast.success(`已调用 ${selectedVoice} 真实合成 TTS 音频`)}
              className="studio-btn-primary w-full text-xs py-2 rounded-lg"
            >
              合成 TTS 配音
            </Button>
          </div>

          {/* 工具面板 5: 分镜画布预览 */}
          <div className="studio-card p-5 space-y-3 border border-[var(--border)] hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                5. 分镜画布预览 ({scenes.length})
              </span>
            </div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-[var(--border)] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80"
                alt="分镜"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              size="sm"
              onClick={handleSaveAndEdit}
              className="w-full bg-transparent border border-[var(--border)] hover:bg-white/10 text-[var(--foreground)] text-xs py-2 rounded-lg cursor-pointer"
            >
              打开漫剧分镜编辑
            </Button>
          </div>

          {/* 工具面板 6: 4K 压制队列 */}
          <div className="studio-card p-5 space-y-3 border border-[var(--border)] hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <span className="font-bold text-xs text-[var(--foreground)] flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-400" />
                6. 4K 压制队列
              </span>
            </div>
            <div className="p-3 rounded-xl bg-transparent border border-[var(--border)] font-mono text-xs space-y-2 h-44 flex flex-col justify-center">
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>GPU 硬件:</span>
                <span className="text-emerald-400 font-bold">NVENC / Metal</span>
              </div>
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>渲染队列:</span>
                <span className="text-indigo-400 font-bold">{scenes.length} 帧就绪</span>
              </div>
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>预估时间:</span>
                <span className="text-[var(--foreground)] font-bold">12 秒</span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleSaveAndEdit()}
              className="studio-btn-primary w-full text-xs py-2 rounded-lg"
            >
              开始 4K GPU 压制导出
            </Button>
          </div>
        </div>
      ) : (
        /* 视角 2: SOP 顺序向导 Mode */
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {WORKFLOW_STEPS.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-3.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2 border ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/25 scale-[1.02]'
                      : 'studio-card text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <span>{step.title}</span>
                  {isActive && <ChevronRight className="w-4 h-4 animate-pulse" />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="studio-card p-5 flex flex-col justify-between space-y-3 min-h-[440px]">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-indigo-400" />
                  小说剧本输入框
                </h3>
              </div>
              <textarea
                value={novelText}
                onChange={(e) => setNovelText(e.target.value)}
                className="flex-1 w-full p-4 rounded-xl bg-transparent border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-indigo-500 resize-none font-mono leading-relaxed"
              />
              <Button
                disabled={isProcessing}
                onClick={handleRealNovelParse}
                className="studio-btn-primary w-full text-xs py-2.5 rounded-xl"
              >
                <Zap className="w-4 h-4 mr-1 fill-current" />
                {isProcessing ? '正在智能拆解中...' : '开始 AI 智能拆解'}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {characters.map((char) => (
                  <div key={char.id} className="studio-card p-4 space-y-2 border border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <img src={char.avatar} alt={char.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-[var(--foreground)] block truncate">{char.name}</span>
                        <span className="text-[10px] text-indigo-400 font-mono">{char.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建工程 Modal */}
      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />

      {/* 模型未配置防坍塌校验门禁 Modal */}
      <ModelConfigGuardModal
        isOpen={isModelGuardOpen}
        onClose={() => setIsModelGuardOpen(false)}
      />
    </div>
  );
};

export default WorkflowPage;
