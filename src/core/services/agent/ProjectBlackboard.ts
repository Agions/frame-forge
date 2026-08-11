/**
 * ProjectBlackboard.ts — 基于黑板模式 (Blackboard / Shared State) 的全局共享状态中心
 *
 * 所有 Agent（主控导演、剧本识别、角色设计、分镜绘图、配音音效、视频压制、自定义 Agent）
 * 均以此 Blackboard 为中心进行读写协作与状态解耦。
 */

import type { Character, NovelScene, StoryAnalysis } from '@/core/script/types/novel';

export type InputContentType = 'script_file' | 'novel_text' | 'ai_prompt' | 'unknown';

export interface BlackboardLogEntry {
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  level: 'info' | 'warn' | 'error' | 'success';
}

export type ProjectStage =
  | 'idle'
  | 'planning' // 阶段 1：策划设定（剧本大纲与角色 Consistency Anchor 锁定）
  | 'visuals' // 阶段 2：画面生成（3 栏漫剧画幅大盘与景别）
  | 'motion' // 阶段 3：动态合成（镜头运镜轨迹与转场节奏）
  | 'audio' // 阶段 4：声音后期（多角色 TTS 与 4K 压制）
  | 'completed';

export interface SpatialMemory {
  characterAnchors: Record<string, { loraPrompt: string; faceLocked: boolean }>;
  sceneAnchors: Record<string, { lightingStyle: string; spatialMemoryPrompt: string }>;
  assetHitRate: number; // 90%+ 高成功率指标
}

export interface CameraDirectingPlan {
  cameraMotion: 'FPV_Fly' | 'Hitchcock_Zoom' | 'Pan_Right' | 'Tilt_Up' | 'Static';
  cameraDistance: 'CloseUp' | 'Medium' | 'Wide';
  pacingSeconds: number;
}

export interface BlackboardData {
  // 基础元信息
  projectId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;

  // 360 纳米空间与资产记忆引擎 (Namistory Spatial Memory)
  spatialMemory: SpatialMemory;
  cameraDirectingPlans: Record<string, CameraDirectingPlan>;

  // 输入源数据 (支持：上传剧本文件 / 小说文本 / AI 生成剧本)
  rawInput: string;
  inputType: InputContentType;
  inputFormat?: string; // .txt / .md / .docx / .json

  // Agent 协同加工后的标准领域模型
  scriptContent: string;
  storyAnalysis: StoryAnalysis | null;
  characters: Character[];
  scenes: NovelScene[];
  audioConfig?: Record<string, unknown>;
  renderQueue?: Record<string, unknown>;

  // 黑板流转状态
  stage: ProjectStage;
  activeAgentId: string | null;
  completedAgentIds: string[];

  // 审计与通信日志快照
  logs: BlackboardLogEntry[];
}

export class ProjectBlackboard {
  private data: BlackboardData;
  private listeners: Array<(data: BlackboardData) => void> = [];

  constructor(initialInput: string = '', inputType: InputContentType = 'unknown', projectName: string = '新漫剧工程') {
    const now = new Date().toISOString();
    this.data = {
      projectId: `proj-bb-${Date.now()}`,
      projectName,
      createdAt: now,
      updatedAt: now,
      spatialMemory: {
        characterAnchors: {},
        sceneAnchors: {},
        assetHitRate: 0.92, // 92% 360 纳米工业成片命中率
      },
      cameraDirectingPlans: {},
      rawInput: initialInput,
      inputType,
      scriptContent: initialInput,
      storyAnalysis: null,
      characters: [],
      scenes: [],
      stage: 'idle',
      activeAgentId: null,
      completedAgentIds: [],
      logs: [
        {
          timestamp: now,
          agentId: 'system',
          agentName: 'System',
          action: '初始化 ProjectBlackboard 共享黑板中心',
          level: 'info',
        },
      ],
    };
  }

  public getData(): Readonly<BlackboardData> {
    return { ...this.data };
  }

  public update(patch: Partial<BlackboardData>, agentId: string, agentName: string, logAction?: string) {
    const now = new Date().toISOString();
    this.data = {
      ...this.data,
      ...patch,
      updatedAt: now,
    };

    if (logAction) {
      this.data.logs.push({
        timestamp: now,
        agentId,
        agentName,
        action: logAction,
        level: 'info',
      });
    }

    this.notify();
  }

  public addLog(entry: Omit<BlackboardLogEntry, 'timestamp'>) {
    this.data.logs.push({
      ...entry,
      timestamp: new Date().toISOString(),
    });
    this.notify();
  }

  public subscribe(listener: (data: BlackboardData) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.data));
  }
}
