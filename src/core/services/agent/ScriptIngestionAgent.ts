/**
 * ScriptIngestionAgent.ts — 剧本与文本智能识别解析 Agent
 *
 * 职责：
 * 自动识别输入源类型（现成剧本文件 / 小说文本 / AI 提示词），
 * 调用 novelAnalyzer 提取剧本结构、章节与场景分段，并将清洗后的元数据写入 Blackboard。
 */

import { novelAnalyzer } from '@/core/services/ai/text/novel-analyze-service';

import { BaseAgent } from './BaseAgent';
import type { InputContentType, ProjectBlackboard } from './ProjectBlackboard';

export class ScriptIngestionAgent extends BaseAgent {
  constructor() {
    super({
      id: 'agent-story',
      name: 'STORY',
      role: 'script_ingestion',
      avatar: '📄',
      description: '自动分析现成剧本、小说文本或 AI 提示词，推导提取剧本章节与场景结构',
      triggerPhase: 'on_input_submitted',
      readKeys: ['rawInput', 'inputType'],
      writeKeys: ['scriptContent', 'storyAnalysis', 'scenes', 'inputType', 'stage'],
    });
  }

  public async execute(blackboard: ProjectBlackboard): Promise<void> {
    const data = blackboard.getData();
    const rawInput = data.rawInput?.trim();

    if (!rawInput) {
      this.log(blackboard, '⚠️ 未输入任何内容，跳过剧本识别。', 'warn');
      return;
    }

    this.log(blackboard, '开始进行输入类型智能识别与文本结构分析...', 'info');

    // 1. 智能推断类型
    let detectedType: InputContentType = data.inputType;
    if (detectedType === 'unknown') {
      if (rawInput.startsWith('{') || rawInput.includes('INT.') || rawInput.includes('EXT.')) {
        detectedType = 'script_file';
      } else if (rawInput.length < 200 && (rawInput.includes('生成') || rawInput.includes('创作'))) {
        detectedType = 'ai_prompt';
      } else {
        detectedType = 'novel_text';
      }
    }

    this.log(blackboard, `识别到内容类型: ${detectedType}`, 'info');

    // 2. 调用小说/剧本解析引擎
    try {
      const analysisResult = await novelAnalyzer.parseNovelContent(rawInput);
      let rawScenes = analysisResult.scenes || [];

      // 若解析未返回场景列表，退回到段落切分模式
      if (rawScenes.length === 0) {
        const paragraphs = rawInput.split('\n').filter((p) => p.trim().length > 0);
        rawScenes = paragraphs.map((p, idx) => ({
          id: `sc-agent-${Date.now()}-${idx}`,
          chapterId: 'chap-1',
          sceneNumber: idx + 1,
          title: `场景 ${idx + 1}`,
          content: p,
          location: '漫剧视觉画面',
          startPosition: 0,
          endPosition: p.length,
          characters: [],
          dialogues: [],
          emotions: [],
        }));
      }

      const parsedScenes = rawScenes.map((sc, idx) => ({
        id: sc.id || `sc-agent-${Date.now()}-${idx}`,
        chapterId: sc.chapterId || `chap-1`,
        sceneNumber: idx + 1,
        title: sc.title || `场景 ${idx + 1}`,
        content: sc.content,
        location: sc.location || '漫剧视觉画面',
        startPosition: sc.startPosition || 0,
        endPosition: sc.endPosition || sc.content.length,
        characters: sc.characters || [],
        dialogues: sc.dialogues || [],
        emotions: sc.emotions || [],
      }));

      // 提取角色
      let rawChars = analysisResult.characters || [];
      if (rawChars.length === 0) {
        rawChars = [
          { name: '主角', role: 'main', personality: '热血坚定' },
          { name: '配角', role: 'supporting', personality: '冷静沉稳' },
        ] as any;
      }

      blackboard.update(
        {
          scriptContent: rawInput,
          inputType: detectedType,
          storyAnalysis: {
            id: `sa-${Date.now()}`,
            title: data.projectName,
            summary: rawInput.slice(0, 80),
            characters: rawChars.map((c) => ({
              name: c.name,
              role: c.role === 'main' || c.role === 'supporting' ? c.role : 'main',
              traits: [c.personality || '二次元画风'],
            })),
            conflictPoints: ['主线矛盾开端'],
            chapters: (analysisResult.chapters || []).map((ch) => ({
              title: ch.title,
              summary: ch.summary || ch.content.slice(0, 50),
              keyEvents: [ch.title],
            })),
            createdAt: new Date().toISOString(),
          },
          scenes: parsedScenes,
          stage: 'planning',
        },
        this.metadata.id,
        this.metadata.name,
        `🎉 成功解析并提取了 ${parsedScenes.length} 个视听分镜场景！`
      );
    } catch (err: any) {
      this.log(blackboard, `❌ 剧本解析发生异常: ${err?.message || '网络超时'}`, 'error');
      throw err;
    }
  }
}
