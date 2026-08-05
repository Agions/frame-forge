// AI 生成组件 — 聚合脚本/角色/渲染生成 UI
// 单一入口，消费者从 `@/components/ai` 导入

export { CharacterDesigner } from './CharacterDesigner';

// Script components — 已迁移至 features
export { default as ScriptEditor } from '@/features/storyboard/components/ScriptEditor';
export { default as NovelImporter } from '@/features/storyboard/components/NovelImporter';
export { SegmentTable } from './SegmentTable';
export type { ScriptImportMetadata } from '@/features/storyboard/components/NovelImporter';

// Editor components — 已迁移至子目录
export { default as AIAssistant } from './AIAssistant/AIAssistant';
export { ProgressStatus } from './ProgressStatus/ProgressStatus';
export { OptionSlider } from './AIAssistant/OptionSlider';
export { EnhanceOptionCard } from './AIAssistant/EnhanceOptionCard';
export type { ChatMessage } from './AIAssistant/types/ai-assistant-entities';
