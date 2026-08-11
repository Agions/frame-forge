/**
 * namistory-360-pipeline.test.ts — 360 纳米漫剧工业级流水线 (Namistory Engine) 单元测试套件
 */

import { ProjectBlackboard } from '@/core/services/agent/ProjectBlackboard';

describe('360 Namistory Industrial AI Manga Pipeline Verification Suite', () => {
  it('Should initialize ProjectBlackboard with 360 Spatial Memory and 90%+ hit rate metrics', () => {
    const bb = new ProjectBlackboard('测试漫剧文本', 'novel_text', '360纳米漫剧工程');
    const data = bb.getData();

    expect(data.spatialMemory).toBeDefined();
    expect(data.spatialMemory.assetHitRate).toBeGreaterThanOrEqual(0.9);
    expect(data.cameraDirectingPlans).toBeDefined();
  });

  it('Should support camera directing plan updates for Hitchcock Zoom and FPV Fly', () => {
    const bb = new ProjectBlackboard('测试漫剧文本', 'novel_text', '360纳米漫剧工程');
    bb.update(
      {
        cameraDirectingPlans: {
          scene_1: {
            cameraMotion: 'Hitchcock_Zoom',
            cameraDistance: 'CloseUp',
            pacingSeconds: 3,
          },
        },
      },
      'agent-chief',
      'CHIEF',
      '绑定希区柯克变焦镜头调度'
    );

    const updated = bb.getData();
    expect(updated.cameraDirectingPlans.scene_1.cameraMotion).toBe('Hitchcock_Zoom');
  });
});
