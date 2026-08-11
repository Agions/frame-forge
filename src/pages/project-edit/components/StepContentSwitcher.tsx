/**
 * StepContentSwitcher — 步骤内容切换器
 *
 * 根据 currentStep index 渲染对应的步骤子组件。
 * 步骤子组件通过 Context selector hooks 自行获取所需的 state + actions，
 * 无需从 Page 层层传递 53 个 props。
 *
 * 对外仅暴露：
 *   - currentStep: 当前步骤索引
 *   - projectId: 项目 ID（部分步骤需要）
 *   - projectName: 项目名称（导出/保存时需要）
 *   - qualityGateIssues / qualityGatePassed: 质量闸门状态
 *   - saving: 保存中状态
 */

import {
  StepImport,
  StepAnalysis,
  StepScript,
  StepStoryboard,
  StepCharacter,
  StepRender,
  StepComposition,
  StepAudio,
  StepExport,
} from './index';

export interface StepContentSwitcherProps {
  currentStep: number;
}

export function StepContentSwitcher({ currentStep }: StepContentSwitcherProps) {
  switch (currentStep) {
    case 0:
      // 阶段 1：策划设定（剧本大纲与角色 Consistency Anchor 锁定）
      return <StepCharacter />;
    case 1:
      // 阶段 2：画面生成（3 栏漫剧画幅大盘与景别）
      return <StepStoryboard />;
    case 2:
      // 阶段 3：动态合成（镜头运镜轨迹与转场节奏）
      return <StepComposition />;
    case 3:
      // 阶段 4：声音后期（多角色 TTS 与 4K 压制）
      return <StepAudio />;
    default:
      return <StepStoryboard />;
  }
}
