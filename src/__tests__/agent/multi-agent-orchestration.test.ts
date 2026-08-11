/**
 * multi-agent-orchestration.test.ts — Multi-Agent 多智能体协作与黑板模式集成测试套件
 */

import { agentRegistry } from '@/core/services/agent/AgentRegistry';
import { MasterDirectorAgent } from '@/core/services/agent/MasterDirectorAgent';

describe('Multi-Agent Hub-and-Spoke & Blackboard Orchestration Suite', () => {
  it('Should ensure all native agents have 5-letter uppercase names', () => {
    const allAgents = agentRegistry.getAll().filter((a) => !a.metadata.isCustom);
    const names = allAgents.map((a) => a.metadata.name);

    // 校验每个原生 Agent 名称为严格 5 个英文字母的单词
    names.forEach((name) => {
      expect(name).toMatch(/^[A-Z]{5}$/);
    });

    expect(names).toEqual(expect.arrayContaining(['STORY', 'ACTOR', 'FRAME', 'AUDIO', 'VIDEO']));
  });

  it('Should successfully initialize ProjectBlackboard and execute full Multi-Agent pipeline', async () => {
    const novelText = `【第一章：黑客归来】
林修站在天道大厦的楼顶，机械手臂上冰冷的雨水流淌。
苏瑶：“林修，黑客舰队离你只有 100 米了！”
林修：“3 秒够了。”`;

    const director = new MasterDirectorAgent(novelText, 'novel_text', '测试漫剧工程');
    const blackboard = director.getBlackboard();

    expect(blackboard.getData().stage).toBe('idle');
    expect(blackboard.getData().rawInput).toBe(novelText);

    // 执行 Hub-and-Spoke 智能体协同推导
    await director.execute();

    const data = blackboard.getData();
    expect(data.stage).toBe('completed');
    expect(data.scenes.length).toBeGreaterThan(0);
    expect(data.characters.length).toBeGreaterThan(0);
    expect(data.audioConfig).toBeDefined();
    expect(data.renderQueue).toBeDefined();
    expect(data.logs.length).toBeGreaterThan(5);
  });

  it('Should support user-defined custom agent registration and execution', async () => {
    const customAgent = agentRegistry.registerCustomAgent({
      name: 'EXTRA',
      avatar: '🗣️',
      description: '自定义方言润色 Agent',
      triggerPhase: 'on_script_parsed',
      systemPrompt: '将台词增加地方方言语气助词',
      readKeys: ['rawInput'],
      writeKeys: ['scriptContent'],
    });

    expect(customAgent.metadata.isCustom).toBe(true);
    expect(customAgent.metadata.name).toBe('EXTRA');
    expect(agentRegistry.getAll().some((a) => a.metadata.id === customAgent.metadata.id)).toBe(true);

    // 删除自定义 Agent 测试
    const removed = agentRegistry.removeAgent(customAgent.metadata.id);
    expect(removed).toBe(true);
  });
});
