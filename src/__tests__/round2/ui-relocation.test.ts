// Round-2 UI primitives relocation smoke test.
//
// Asserts that the canonical `src/components/ui/button` module is importable
// after the move and exposes the runtime `Button` export. This proves both
// that the new path resolves and that the underlying module still loads
// without runtime errors.

describe('ui primitives relocated', () => {
  it('button is importable from new path', async () => {
    const m = await import('@/components/ui/button');
    expect(m.Button).toBeDefined();
  });
});
