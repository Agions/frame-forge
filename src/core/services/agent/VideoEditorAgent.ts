/**
 * VideoEditorAgent.ts — 视频剪辑与 4K GPU 压制 Agent
 */

import { BaseAgent } from './BaseAgent';
import type { ProjectBlackboard } from './ProjectBlackboard';

export class VideoEditorAgent extends BaseAgent {
  constructor() {
    super({
      id: 'agent-video',
      name: 'VIDEO',
      role: 'video_editor',
      avatar: '🎞️',
      description: '负责 Apple VideoToolbox / NVENC GPU 4K 硬件加速压制与渲染队列调度',
      triggerPhase: 'on_audio_synthesized',
      readKeys: ['scenes', 'audioConfig'],
      writeKeys: ['renderQueue', 'stage'],
    });
  }

  public async execute(blackboard: ProjectBlackboard): Promise<void> {
    this.log(blackboard, '启动 VideoToolbox / NVENC GPU 4K 硬件推演压制队列...', 'info');

    blackboard.update(
      {
        renderQueue: {
          codec: 'H.265 / HEVC',
          hardwareAcceleration: 'Apple VideoToolbox / NVENC',
          resolution: '3840x2160 (4K UHD)',
          fps: 60,
          status: 'ready',
        },
        stage: 'motion',
      },
      this.metadata.id,
      this.metadata.name,
      '🎉 4K 漫剧压制与音画合成队列全量构建完成！'
    );
  }
}
