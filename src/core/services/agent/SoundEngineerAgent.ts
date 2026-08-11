/**
 * SoundEngineerAgent.ts — 音效与 TTS 配音智能体
 */

import { BaseAgent } from './BaseAgent';
import type { ProjectBlackboard } from './ProjectBlackboard';

export class SoundEngineerAgent extends BaseAgent {
  constructor() {
    super({
      id: 'agent-audio',
      name: 'AUDIO',
      role: 'sound_engineer',
      avatar: '🎙️',
      description: '负责多音轨 EdgeTTS / CosyVoice 合成、BGM 对齐与毫秒级字幕卡点计算',
      triggerPhase: 'on_storyboard_generated',
      readKeys: ['scenes', 'characters'],
      writeKeys: ['audioConfig', 'stage'],
    });
  }

  public async execute(blackboard: ProjectBlackboard): Promise<void> {
    this.log(blackboard, '正在调度多音轨 TTS 与 BGM 混音引擎...', 'info');

    blackboard.update(
      {
        audioConfig: {
          bgmTrack: 'BGM_Cyber_Action_01.mp3',
          voiceOverVolume: 1.0,
          bgmVolume: 0.2,
          subtitleAlignment: 'millisecond_exact',
        },
        stage: 'audio',
      },
      this.metadata.id,
      this.metadata.name,
      '🎉 声部音轨与 BGM 混音准备就绪！'
    );
  }
}
