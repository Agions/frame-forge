/**
 * Shared Types Barrel — Round-2 transitional re-export.
 *
 * Each file previously at `src/shared/types/<file>.ts` has been relocated to
 * `src/core/<domain>/types/<file>.ts`. Old paths remain as re-export shims
 * (see sibling files alongside this index) so existing callers using
 * `@/common/types/<file>` deep imports keep compiling without modification.
 *
 * This barrel re-exports the canonical new locations plus the few files
 * retained in this directory (legacy.ts only — the .d.ts files are ambient
 * declarations and are auto-loaded by tsconfig).
 *
 * New code should import directly from `@/core/<domain>/types/<file>`.
 *
 * Re-export style note:
 *   The original barrel used `export *` for most modules and selective
 *   re-exports where there were name collisions (notably VideoMetadata,
 *   defined in both `./video-composition-types` (canonical) and `./legacy`
 *   (looser intersection form)). We preserve that pattern to keep the public
 *   type surface stable across the relocation.
 */

// Relocated files via `export *`:
export * from '@/core/project/types/project';
export * from '@/core/ai/types/ai-core';
export * from '@/core/video/types/video';
export * from '@/core/audio/types/audio';
export * from '@/core/audio/types/composition';
export * from '@/core/script/types/script';
export * from '@/core/script/types/novel';
export * from '@/core/storyboard/types/storyboard';
export * from '@/core/storyboard/types/story-context';
export * from '@/core/storyboard/types/preview';

// Selectively re-export from `@/core/video/types/composition` to avoid the
// `VideoMetadata` name clash with `./legacy` (which exports the looser
// intersection form `VideoMetadata & { codec?: string; bitrate?: number }`).
// The legacy intersection-form takes precedence in the public
// `@/common/types` surface, matching the original barrel behaviour.
export type {
  SubtitleRenderStyle,
  SubtitleItem,
  SubtitleTrack,
  SubtitleFormat,
  Subtitle,
  SceneEffect,
  CompositionScene,
  CompositionOptions,
  CompositionResult,
  ExportProgress,
  ProgressCallback,
} from '@/core/video/types/composition';

// Legacy types stayed in shared root. The VideoMetadata legacy intersection
// form wins the public name; everything else is re-exported transparently.
export * from './legacy';
