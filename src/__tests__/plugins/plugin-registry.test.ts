/**
 * plugin-registry.test.ts — Plugin Architecture & Hook Engine Unit Tests
 */

import { pluginRegistry, type NovellaPlugin } from '@/core/plugins/PluginRegistry';

describe('Novella Plugin Architecture & Hook Extension Engine Suite', () => {
  it('Should register builtin plugins automatically on initialization', () => {
    const plugins = pluginRegistry.getAll();
    expect(plugins.length).toBeGreaterThanOrEqual(2);
    expect(plugins.some((p) => p.id === 'plugin-builtin-prompt-sanitizer')).toBe(true);
    expect(plugins.some((p) => p.id === 'plugin-builtin-camera-vector-enhancer')).toBe(true);
  });

  it('Should register and execute custom plugin hooks in waterfall pipeline', async () => {
    const testPlugin: NovellaPlugin = {
      id: 'plugin-test-custom',
      name: 'Test Custom Plugin',
      version: '1.0.0',
      description: 'Unit test plugin for testing pipeline hook execution',
      hooks: {
        onBeforeScriptParse: async (rawInput) => {
          return `${rawInput} [Hook Applied]`;
        },
      },
    };

    pluginRegistry.register(testPlugin);

    const result = await pluginRegistry.executeHook('onBeforeScriptParse', 'Hello Novella');
    expect(result).toBe('Hello Novella [Hook Applied]');

    pluginRegistry.unregister('plugin-test-custom');
  });

  it('Should allow enabling and disabling plugins dynamically', async () => {
    const testPlugin: NovellaPlugin = {
      id: 'plugin-test-toggle',
      name: 'Toggle Test Plugin',
      version: '1.0.0',
      description: 'Unit test plugin for toggle feature',
      hooks: {
        onBeforeScriptParse: (input) => `${input} + Toggle`,
      },
    };

    pluginRegistry.register(testPlugin);
    pluginRegistry.setPluginEnabled('plugin-test-toggle', false);

    const resultDisabled = await pluginRegistry.executeHook('onBeforeScriptParse', 'Text');
    expect(resultDisabled).toBe('Text');

    pluginRegistry.setPluginEnabled('plugin-test-toggle', true);
    const resultEnabled = await pluginRegistry.executeHook('onBeforeScriptParse', 'Text');
    expect(resultEnabled).toBe('Text + Toggle');

    pluginRegistry.unregister('plugin-test-toggle');
  });
});
