describe('store imports', () => {
  it('project store reachable from new path', async () => {
    const m = await import('@/stores/project/project-store');
    expect(m.useProjectStore).toBeDefined();
  });
  it('settings store reachable', async () => {
    const m = await import('@/stores/settings/settings-store');
    expect(m.useSettingsStore).toBeDefined();
  });
});
