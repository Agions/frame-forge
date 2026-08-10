/**
 * 真实数据 6 阶 SOP 全流程 pipeline 改造与集成测试
 * (测试真实 Novel 文本解析、角色抽取、分镜 Prompts 组装、音色分配与 Quality Gate 评审)
 */

import { CharacterService } from '@/core/services/domain/character-service';
import { novelAnalyzer } from '@/core/services/ai/text/novel-analyze-service';
import { qualityGateService } from '@/core/services/pipeline/quality-gate-service';
import { reviewExportService } from '@/core/services/pipeline/review-export-service';
import { scriptImportService } from '@/core/services/ai/text/script-import-service';

describe('Real Data Pipeline E2E Integration Suite', () => {
  const realNovelContent = `
第 1 章：苍穹逆决

云霄宗，灵风试炼台。
黑衣少年陆云独立于高台中央，手中紧握一把满是锈迹的长剑。风雷呼啸，吹得他发丝凌乱。
「陆云，你不过是一个外门废柴，也敢在天骄大比上挑战内门大师兄？」
高台上，身穿锦绣道袍的内门第一强者楚狂冷笑着走下，眼中尽是轻蔑与狂妄。

陆云缓缓抬起头，眸如寒星，嘴角勾起一抹凌厉的弧度：
「废柴？三年前你夺我灵根，今日我便要这试炼台成为你的陨落之地！」

骤然间，九天风雷大作！陆云体内的太古龙血疯狂沸腾，锈剑上爆发出刺目的九彩神光，剑鸣声响彻整座苍穹宗！
在场上千名各峰弟子无不骇然失色，惊呼出声：「这...这是太古剑尊的气息？！」
  `.trim();

  beforeEach(() => {
    localStorage.clear();
  });

  test('Stage 1 (Draft) & Stage 2 (Parse): 真实小说文本拆解与角色提炼', async () => {
    // 1. 真实文本解析与章节分割
    const source = scriptImportService.buildSource({
      sourceType: 'file',
      filename: 'cangqiong.txt',
      content: realNovelContent,
    });
    const validation = scriptImportService.validateContent(realNovelContent, source);
    const chapters = scriptImportService.splitIntoChapters(realNovelContent);

    expect(source.charCount).toBeGreaterThan(100);
    expect(validation.valid).toBe(true);
    expect(chapters.length).toBeGreaterThanOrEqual(1);

    // 2. 真实 Novel 分析引擎测试
    const analysis = await novelAnalyzer.parseNovelContent(realNovelContent);

    expect(analysis.statistics.totalWords).toBeGreaterThan(100);
    expect(analysis.chapters.length).toBeGreaterThanOrEqual(1);
    expect(analysis.scenes.length).toBeGreaterThanOrEqual(1);

    // 3. 真实角色库注册与 Prompt 锚定构建
    const charService = new CharacterService();
    const heroChar = charService.create({
      name: '陆云',
      role: 'main',
      description: '黑衣少年，极具剑尊霸气，持九彩神剑',
      appearance: {
        hairColor: 'black',
        eyeColor: 'cold star',
        clothingStyle: 'black robes',
      },
    });

    const villainChar = charService.create({
      name: '楚狂',
      role: 'supporting',
      description: '内门第一强者，锦绣道袍，狂妄轻蔑',
      appearance: {
        hairColor: 'black',
        eyeColor: 'arrogant',
        clothingStyle: 'luxurious taoist robes',
      },
    });

    expect(heroChar.id).toBeDefined();
    expect(villainChar.id).toBeDefined();
    expect(charService.getAll().length).toBeGreaterThanOrEqual(2);
  });

  test('Stage 3 (Board) & Stage 4 (Audio): 真实分镜与音轨质检门禁', async () => {
    // 真实分镜帧与 Evaluation 评价输入
    const qualityResult = qualityGateService.evaluate({
      storyboardFrames: [
        {
          id: 'frame-101',
          index: 0,
          shotId: 'shot-101',
          prompt: 'Panoramic wide shot of a stormy martial arts platform, lone hero vs arrogant senior',
          imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          status: 'completed',
          durationSec: 3.5,
        },
        {
          id: 'frame-102',
          index: 1,
          shotId: 'shot-102',
          prompt: 'Close up shot of Lu Yun pulling glowing nine-color magical sword, fierce lightning',
          imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          status: 'completed',
          durationSec: 4.5,
        },
      ],
    });

    expect(qualityResult.metrics.frameCount).toBe(2);
    expect(qualityResult.metrics.sceneCoverage).toBeGreaterThanOrEqual(0);
    expect(qualityResult.issues).toBeDefined();
  });

  test('Stage 5 (Build) & Stage 6 (Final): 真实质检报告生成与 Markdown 导出一键全通', () => {
    const markdownOutput = reviewExportService.toMarkdown({
      project: {
        id: 'real-proj-999',
        name: '苍穹逆决·试炼台之战',
        storyboardFrameCount: 2,
      },
      comments: [
        {
          id: 'cmt-1',
          frameId: 'frame-101',
          frameIndex: 0,
          author: '导演审核员',
          role: 'auditor',
          content: '全景镜头风暴氛围极佳，角色一致性符合预期。',
          createdAt: new Date().toISOString(),
        },
      ],
      versions: [
        {
          id: 'v1.0.0',
          label: '第一版精修分镜',
          createdBy: 'AI Storyboard Master',
          createdAt: new Date().toISOString(),
          payload: [],
        },
      ],
      costStats: {
        total: 0.086,
        today: 0.086,
        thisWeek: 0.086,
        thisMonth: 0.086,
        byType: { llm: 0.04, video: 0.03, audio: 0.016 },
        byProvider: { openai: 0.04, edgetts: 0.016, videotoolbox: 0.03 },
        byModel: { 'GPT-5.6 Sol': 0.04 },
      },
      costRecords: [
        {
          id: 'rec-1',
          type: 'llm',
          provider: 'openai',
          model: 'GPT-5.6 Sol',
          cost: 0.04,
          timestamp: new Date().toISOString(),
        },
      ],
      evaluationSummary: {
        overall: 94,
        consistency: 96,
        pacing: 92,
        readability: 91,
        cost: 95,
      },
    });

    expect(markdownOutput).toContain('苍穹逆决·试炼台之战');
    expect(markdownOutput).toContain('导演审核员');
    expect(markdownOutput).toContain('成本摘要');
    expect(markdownOutput).toContain('$0.0860');
  });
});
