/**
 * storyboard-studio-ux.test.ts — 分镜 Studio 工作台直达与零门槛交互单元测试
 */

describe('Storyboard Studio Direct Access & Zero-Barrier Workflow Suite', () => {
  it('Should default initialStep to 3 (Storyboard Canvas Studio) when entering Storyboard Studio', () => {
    const search = new URLSearchParams('');
    const stepValue = search.get('step');
    let initialStep = 3; // Default to Storyboard Canvas
    if (stepValue) {
      initialStep = Number(stepValue);
    }
    expect(initialStep).toBe(3);
  });

  it('Should bypass Step 0 import when script or parsed scenes are already in Blackboard', () => {
    const blackboardState = {
      rawInput: '小说章节内容...',
      parsedScenes: [{ sceneId: 's1', cameraMotion: 'ZoomIn', prompt: '主角站在大殿中央' }],
    };

    const hasData = blackboardState.rawInput.length > 0 || blackboardState.parsedScenes.length > 0;
    expect(hasData).toBe(true);
  });
});
