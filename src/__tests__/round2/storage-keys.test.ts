import { STORAGE_KEYS } from '@/core/constants/storage-keys';

describe('storage keys', () => {
  it('exposes legacy and v2 keys', () => {
    expect(STORAGE_KEYS.legacyProjects).toBe('STORAGE_KEYS.PROJECTS');
    expect(STORAGE_KEYS.projects).toMatch(/v2/);
  });
});
