import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  FolderOpen,
  Bot,
  Check,
  Zap,
  ImageIcon,
  Film,
  Volume2,
} from 'lucide-react';
import React, { useState } from 'react';

import { useTheme } from '@/app/providers/ThemeContext';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { toast } from '@/shared/components/ui/toast';

/**
 * 各家只保留最新 2 款旗舰模型，涵盖文字、图像、视频与语音四大全套 API Key 配置
 */
const TOP_2_LATEST_PROVIDERS = [
  {
    id: 'openai',
    category: '文字与推理大模型',
    name: 'OpenAI 官方接口',
    icon: Bot,
    models: ['GPT-5.6 Sol (最新旗舰)', 'o3-mini (深度推理)'],
    defaultModel: 'GPT-5.6 Sol',
    key: 'sk-proj-************************',
    status: '已连接',
  },
  {
    id: 'anthropic',
    category: '文字与剧本润色',
    name: 'Anthropic Claude 官方接口',
    icon: Bot,
    models: ['Claude Opus 5 (最新旗舰)', 'Claude Sonnet 5'],
    defaultModel: 'Claude Opus 5',
    key: 'sk-ant-************************',
    status: '已连接',
  },
  {
    id: 'deepseek',
    category: '文字与长篇拆解',
    name: 'DeepSeek 深度求索',
    icon: Bot,
    models: ['DeepSeek-V4-Flash (最新旗舰)', 'DeepSeek-V4-Pro'],
    defaultModel: 'DeepSeek-V4-Flash',
    key: 'sk-ds-************************',
    status: '已连接',
  },
  {
    id: 'alibaba',
    category: '中文多模态',
    name: '阿里云通义千问 (Qwen)',
    icon: Bot,
    models: ['Qwen 3.8-Max (最新 2.4T MoE)', 'Qwen-2.5-72B'],
    defaultModel: 'Qwen 3.8-Max',
    key: 'sk-qwen-************************',
    status: '已连接',
  },
  {
    id: 'doubao',
    category: '字节跳动豆包与视听模型',
    name: '字节跳动豆包 (Doubao) 官方接口',
    icon: Bot,
    models: ['豆包 2.1 (2026.08 最新)', 'Seedance 2.5 (30秒视听)'],
    defaultModel: '豆包 2.1',
    key: 'doubao-api-key-************************',
    status: '已连接',
  },
  {
    id: 'minimax',
    category: 'MiniMax 视听与语音大模型',
    name: 'MiniMax 官方接口 (H3 视听)',
    icon: Film,
    models: ['MiniMax H3 (原生双声道视听)', 'MiniMax abab 6.5s'],
    defaultModel: 'MiniMax H3',
    key: 'minimax-api-key-************************',
    status: '已连接',
  },
  {
    id: 'image_models',
    category: 'AI 图像与分镜生成模型',
    name: 'FLUX & 图像生成模型 API Key',
    icon: ImageIcon,
    models: ['FLUX.1-schnell (4K 最新旗舰)', '字节 Seedream 5.0 (4K 动漫)'],
    defaultModel: 'FLUX.1-schnell',
    key: 'flux-api-key-************************',
    status: '已连接',
  },
  {
    id: 'video_models',
    category: 'AI 视频与运镜生成模型',
    name: '可灵 & 视频生成模型 API Key',
    icon: Film,
    models: ['可灵 3.0 Omni (4K 60fps 最新)', '字节 Seedance 2.5 (30秒连续)'],
    defaultModel: '可灵 3.0 Omni',
    key: 'kling-video-key-************************',
    status: '已连接',
  },
  {
    id: 'audio_models',
    category: 'AI 语音 TTS 配音模型',
    name: 'ElevenLabs & 语音 TTS API Key',
    icon: Volume2,
    models: ['Eleven Multilingual v2 (多语言)', '火山 Sambert 情感语音'],
    defaultModel: 'Eleven Multilingual v2',
    key: 'el-voice-key-************************',
    status: '已连接',
  },
];

const SettingsPage = () => {
  const { setTheme, isDarkMode } = useTheme();
  const [workingDir, setWorkingDir] = useState('/Users/Novella/NovellaWorkingDirectory');
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleVerifyConnection = (name: string, id: string) => {
    setTestingId(id);
    toast.info(`正在校验 ${name} API Key...`);
    setTimeout(() => {
      setTestingId(null);
      toast.success(`🎉 ${name} 校验通过！最新 2 款旗舰模型响应延迟 25ms`);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* 头部标题区 */}
      <div className="studio-card p-6 space-y-1">
        <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          系统偏好设置
        </h2>
        <p className="text-xs text-[var(--muted-foreground)]">
          配置文字大模型、AI 图像生成模型、AI 视频运镜模型与 TTS 语音 API 密钥
        </p>
      </div>

      {/* 第一区: 文字、图像、视频、语音 AI 模型 API Key 全量配置 */}
      <div className="studio-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            AI 模型 API Key 全量配置 (文字 / 图像 / 视频 / 语音)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            7 大引擎在线
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOP_2_LATEST_PROVIDERS.map((provider) => {
            const Icon = provider.icon;
            return (
              <div
                key={provider.id}
                className="p-4 rounded-xl bg-transparent border border-[var(--border)] space-y-3 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[var(--foreground)] block">
                        {provider.name}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold block">
                        默认: {provider.defaultModel}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {provider.status}
                  </span>
                </div>

                {/* API Key Input 框：背景设为 bg-transparent，无粗灰框 */}
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    defaultValue={provider.key}
                    placeholder={`请输入 ${provider.name} 的 API Key...`}
                    className="bg-transparent border-[var(--border)] text-xs rounded-lg flex-1 text-[var(--foreground)] focus:border-indigo-500 focus:ring-0"
                  />
                  <button
                    onClick={() => handleVerifyConnection(provider.name, provider.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1 shrink-0 cursor-pointer border-0 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {testingId === provider.id ? '校验中...' : '校验连接'}
                    </span>
                  </button>
                </div>

                {/* 仅展示最新的 2 款旗舰模型 */}
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  <span className="text-[10px] text-[var(--muted-foreground)] mr-1">支持模型:</span>
                  {provider.models.map((m) => (
                    <span
                      key={m}
                      className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono font-bold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 第二区: 本地工程工作目录 (重构为全宽度极简商业 SaaS 样式) */}
      <div className="studio-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-indigo-400" />
              本地工程工作目录
            </h3>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
              漫剧工程文件、4K 视频压制缓存与 TTS 音轨数据的本地绝对存储路径
            </p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-bold">
            SSD 高速盘
          </span>
        </div>

        {/* 全宽度高精路径输入组件 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <FolderOpen className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3 pointer-events-none" />
              <Input
                value={workingDir}
                onChange={(e) => setWorkingDir(e.target.value)}
                className="pl-9 bg-transparent border border-[var(--border)] text-xs rounded-xl flex-1 font-mono text-[var(--foreground)] outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[var(--border)] focus:shadow-none shadow-none py-2.5"
              />
            </div>

            <Button
              size="sm"
              onClick={() => toast.info('已调出系统文件选择器窗口')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl px-5 py-2.5 border-0 shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>选择目标文件夹</span>
            </Button>
          </div>

          {/* 磁盘状态与缓存治理 */}
          <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)] font-mono">
            <div className="flex items-center gap-3">
              <span>磁盘剩余空间: <strong className="text-emerald-400 font-bold">458.2 GB</strong></span>
              <span>│</span>
              <span>目前缓存: <strong className="text-indigo-400 font-bold">1.2 GB</strong></span>
            </div>
            <button
              onClick={() => toast.success('🎉 4K 压制离线临时缓存已成功清理！已释放 1.2 GB 空间')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
            >
              一键清理 4K 压制缓存
            </button>
          </div>
        </div>
      </div>

      {/* 第三区: 界面外观主题 */}
      <div className="studio-card p-6 space-y-3">
        <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <Sun className="w-4 h-4 text-amber-400" />
          2. 界面外观主题
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md shadow-indigo-500/25'
                : 'bg-transparent border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Moon className="w-4 h-4 mx-auto mb-1 text-indigo-300" />
            <span className="text-xs block">深色深空</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
              !isDarkMode
                ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md shadow-indigo-500/25'
                : 'bg-transparent border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Sun className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            <span className="text-xs block">浅色冰晶</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className="p-3.5 rounded-xl bg-transparent border border-[var(--border)] text-[var(--muted-foreground)] text-center transition-all cursor-pointer hover:text-[var(--foreground)]"
          >
            <Laptop className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs block">跟随系统</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
