/**
 * plugin-sdk.test.ts — Unit tests for @novella/plugin-sdk package
 */

import { pluginRegistry, type NovellaPlugin } from '../../../packages/plugin-sdk/src/index';

describe('@novella/plugin-sdk Package Suite', () => {
  it('Should initialize 5 built-in plugins matrix in @novella/plugin-sdk', () => {
    const plugins = pluginRegistry.getAll();
    expect(plugins.length).toBeGreaterThanOrEqual(5);
  });

  it('Should execute waterfall hooks via @novella/plugin-sdk', async () => {
    const customPlugin: NovellaPlugin = {
      id: 'plugin-sdk-unit-test',
      name: 'SDK Unit Test Plugin',
      version: '1.0.0',
      description: 'SDK unit test plugin',
      hooks: {
        onBeforeScriptParse: (text) => `${text} -> SDK Hooked`,
      },
    };

    pluginRegistry.register(customPlugin);
    const result = await pluginRegistry.executeHook('onBeforeScriptParse', 'Start');
    expect(result).toContain('SDK Hooked');

    pluginRegistry.unregister('plugin-sdk-unit-test');
  });
});
