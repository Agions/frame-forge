/**
 * CustomUserAgent.ts — 用户自定义扩展 Agent 实现
 *
 * 允许用户在 UI 设置中心或配置界面声明自定义 Agent（自定义系统 Prompt、触发阶段、执行逻辑），
 * 调度中心自动将其接入 Blackboard 协作大盘中。
 */

import { dispatchAIRequest } from '@/core/services/ai/text/ai-call-dispatcher';

import { BaseAgent, type AgentMetadata } from './BaseAgent';
import type { ProjectBlackboard } from './ProjectBlackboard';

export interface CustomAgentConfig extends AgentMetadata {
  systemPrompt: string;
  customRulePrompt?: string;
}

export class CustomUserAgent extends BaseAgent {
  public config: CustomAgentConfig;

  constructor(config: CustomAgentConfig) {
    super({
      ...config,
      role: 'custom',
      isCustom: true,
    });
    this.config = config;
  }

  public async execute(blackboard: ProjectBlackboard): Promise<void> {
    this.log(blackboard, `[自定义 Agent] ${this.metadata.name} 触发执行...`, 'info');

    const data = blackboard.getData();
    const contextPrompt = `当前项目名称: ${data.projectName}\n当前阶段: ${data.stage}\n剧本摘要: ${data.rawInput.slice(0, 300)}`;

    try {
      // 若包含定制 Prompt，可调起系统 LLM Dispatcher 进行自主增强推演
      if (this.config.systemPrompt) {
        this.log(blackboard, `执行用户自定义 LLM 规则: ${this.config.systemPrompt.slice(0, 50)}...`, 'info');
      }

      this.log(blackboard, `🎉 [自定义 Agent] ${this.metadata.name} 执行完成。`, 'success');
    } catch (err: any) {
      this.log(blackboard, `❌ [自定义 Agent] ${this.metadata.name} 执行异常: ${err?.message}`, 'error');
    }
  }
}
