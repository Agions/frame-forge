// Round-2 type relocation smoke test.
//
// The plan originally specified `NewTypes.ProjectData`, but `ProjectData` is a
// pure TypeScript interface that erases at runtime, so `.toBeDefined()` would
// always fail. We substitute `EmotionType`, the only runtime-visible export in
// `@/core/script/types/novel` (an enum), to prove that:
//   1. The new location still exports the symbol.
//   2. The `@/common/types` barrel successfully re-exports it (identity check).

import * as NovelTypes from '@/core/script/types/novel';
import * as SharedTypes from '@/common/types';

describe('type relocation', () => {
  it('shared/types re-exports core/<domain>/types', () => {
    expect(NovelTypes.EmotionType).toBeDefined();
    expect(SharedTypes.EmotionType).toBe(NovelTypes.EmotionType);
  });
});
