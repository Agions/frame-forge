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

export interface BlackboardData {
  // 基础元信息
  projectId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;

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
  stage: 'Ingest' | 'Character_Design' | 'Storyboard' | 'Audio_Synthesis' | 'Video_Render' | 'Completed';
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
      rawInput: initialInput,
      inputType,
      scriptContent: initialInput,
      storyAnalysis: null,
      characters: [],
      scenes: [],
      stage: 'Ingest',
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
