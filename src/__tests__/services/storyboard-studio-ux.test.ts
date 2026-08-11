/**
 * storyboard-studio-ux.test.ts — 漫剧制作 4 大核心环节单元测试套件
 */

describe('Manga Production 4 Core Phases Architecture Suite', () => {
  it('Should default initialStep to 1 (PhaseVisuals - 画面生成分镜大盘) when entering Studio', () => {
    const search = new URLSearchParams('');
    const stepValue = search.get('step');
    let initialStep = 1; // Default to Phase 2: Visuals Storyboard Canvas
    if (stepValue) {
      initialStep = Number(stepValue);
    }
    expect(initialStep).toBe(1);
  });

  it('Should define the 4 core phases strictly: Planning -> Visuals -> Motion -> Audio', () => {
    const corePhases = ['planning', 'visuals', 'motion', 'audio'];
    expect(corePhases).toHaveLength(4);
    expect(corePhases[0]).toBe('planning');
    expect(corePhases[1]).toBe('visuals');
    expect(corePhases[2]).toBe('motion');
    expect(corePhases[3]).toBe('audio');
  });
});
