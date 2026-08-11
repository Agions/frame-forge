/**
 * StoryboardArtistAgent.ts — 分镜绘图与运镜规划 Agent
 *
 * 职责：
 * 读取 Blackboard 场景与角色，调用 storyboardPromptBuilder 生成 3 栏漫剧画幅，
 * 规划推拉摇移镜头轨迹 (Zoom / Tilt) 与画面 Prompt。
 */

import { BaseAgent } from './BaseAgent';
import type { ProjectBlackboard } from './ProjectBlackboard';

export class StoryboardArtistAgent extends BaseAgent {
  constructor() {
    super({
      id: 'agent-frame',
      name: 'FRAME',
      role: 'storyboard_artist',
      avatar: '🎨',
      description: '负责规划镜头景别 (Zoom/Tilt)、构图提示词与二次元 3 栏漫剧分镜大盘',
      triggerPhase: 'on_character_anchored',
      readKeys: ['scenes', 'characters'],
      writeKeys: ['scenes', 'stage'],
    });
  }

  public async execute(blackboard: ProjectBlackboard): Promise<void> {
    const data = blackboard.getData();
    this.log(blackboard, '开始进行视听运镜与 3 栏分镜提示词规划...', 'info');

    const updatedScenes = data.scenes.map((sc, idx) => ({
      ...sc,
      imagePrompts: [
        `Masterpiece anime illustration, ${sc.content.slice(0, 40)}, cinematic lighting, 4K resolution, high dynamic contrast`,
      ],
      tags: [...(sc.tags || []), idx % 2 === 0 ? '推镜头 (Zoom In)' : '摇镜头 (Pan Right)'],
    }));

    blackboard.update(
      {
        scenes: updatedScenes,
        stage: 'Audio_Synthesis',
      },
      this.metadata.id,
      this.metadata.name,
      `🎉 已成功规划 ${updatedScenes.length} 帧运镜与高清动画提示词！`
    );
  }
}
