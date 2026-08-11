/**
 * MasterDirectorAgent.ts — 基于 Hub-and-Spoke 的主控导演智能体与多 Agent 协作调度中心
 *
 * 职责：
 * 作为 Multi-Agent 系统的核心调度枢纽 (Director Agent)，
 * 监听 Blackboard 共享黑板状态变化，指挥子 Agent（剧本识别、角色设计、分镜绘图、音效配音、视频压制及自定义 Agent）
 * 协同完成从原始输入到 4K 漫剧全流程推导与构建。
 */

import { agentRegistry } from './AgentRegistry';
import { BaseAgent } from './BaseAgent';
import { ProjectBlackboard, type InputContentType } from './ProjectBlackboard';

export class MasterDirectorAgent extends BaseAgent {
  private blackboard: ProjectBlackboard;

  constructor(initialInput: string = '', inputType: InputContentType = 'unknown', projectName: string = '漫剧工程 · 多 Agent 协作') {
    super({
      id: 'agent-master-director',
      name: 'MasterDirectorAgent (主控导演智能体)',
      role: 'director',
      avatar: '🎬',
      description: 'Hub-and-Spoke 智能体调度中心，负责指挥与分发任务给子 Agent',
      triggerPhase: 'on_input_submitted',
      readKeys: ['stage', 'rawInput', 'scenes', 'characters'],
      writeKeys: ['stage', 'activeAgentId', 'completedAgentIds'],
    });

    this.blackboard = new ProjectBlackboard(initialInput, inputType, projectName);
  }

  public getBlackboard(): ProjectBlackboard {
    return this.blackboard;
  }

  public async execute(): Promise<void> {
    this.log(this.blackboard, '🎬 主控导演 Agent 启动多智能体 (Multi-Agent) 协作调度循环...', 'info');

    const allAgents = agentRegistry.getAll().filter((a) => a.metadata.enabled !== false && a.metadata.id !== this.metadata.id);

    try {
      // 1. 触发剧本识别 Agent (ScriptIngestionAgent)
      const scriptAgent = allAgents.find((a) => a.metadata.role === 'script_ingestion');
      if (scriptAgent) {
        this.blackboard.update({ activeAgentId: scriptAgent.metadata.id }, this.metadata.id, this.metadata.name, `调度 ${scriptAgent.metadata.name} 介入...`);
        await scriptAgent.execute(this.blackboard);
        this.executeCustomAgents('on_script_parsed', allAgents);
      }

      // 2. 触发角色设计 Agent (CharacterDesignerAgent)
      const charAgent = allAgents.find((a) => a.metadata.role === 'character_designer');
      if (charAgent) {
        this.blackboard.update({ activeAgentId: charAgent.metadata.id }, this.metadata.id, this.metadata.name, `调度 ${charAgent.metadata.name} 介入...`);
        await charAgent.execute(this.blackboard);
        this.executeCustomAgents('on_character_anchored', allAgents);
      }

      // 3. 触发分镜绘图 Agent (StoryboardArtistAgent)
      const sbAgent = allAgents.find((a) => a.metadata.role === 'storyboard_artist');
      if (sbAgent) {
        this.blackboard.update({ activeAgentId: sbAgent.metadata.id }, this.metadata.id, this.metadata.name, `调度 ${sbAgent.metadata.name} 介入...`);
        await sbAgent.execute(this.blackboard);
        this.executeCustomAgents('on_storyboard_generated', allAgents);
      }

      // 4. 触发音效配音 Agent (SoundEngineerAgent)
      const soundAgent = allAgents.find((a) => a.metadata.role === 'sound_engineer');
      if (soundAgent) {
        this.blackboard.update({ activeAgentId: soundAgent.metadata.id }, this.metadata.id, this.metadata.name, `调度 ${soundAgent.metadata.name} 介入...`);
        await soundAgent.execute(this.blackboard);
        this.executeCustomAgents('on_audio_synthesized', allAgents);
      }

      // 5. 触发视频压制 Agent (VideoEditorAgent)
      const videoAgent = allAgents.find((a) => a.metadata.role === 'video_editor');
      if (videoAgent) {
        this.blackboard.update({ activeAgentId: videoAgent.metadata.id }, this.metadata.id, this.metadata.name, `调度 ${videoAgent.metadata.name} 介入...`);
        await videoAgent.execute(this.blackboard);
      }

      this.blackboard.update({ activeAgentId: null, stage: 'Completed' }, this.metadata.id, this.metadata.name, '🎉 多智能体 (Multi-Agent) 协同推导与渲染全量完成！');
    } catch (err: any) {
      this.log(this.blackboard, `❌ 调度循环发生异常打回: ${err?.message || '协作中断'}`, 'error');
      throw err;
    }
  }

  /** 执行指定触发阶段的自定义 User Agents */
  private async executeCustomAgents(phase: string, agents: BaseAgent[]) {
    const matchingCustom = agents.filter((a) => a.metadata.isCustom && a.metadata.triggerPhase === phase);
    for (const ca of matchingCustom) {
      this.log(this.blackboard, `调度自定义 Agent: ${ca.metadata.name} [Phase: ${phase}]`, 'info');
      try {
        await ca.execute(this.blackboard);
      } catch (e: any) {
        this.log(this.blackboard, `自定义 Agent ${ca.metadata.name} 报错: ${e?.message}`, 'warn');
      }
    }
  }
}
