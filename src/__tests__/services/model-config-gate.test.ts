/**
 * model-config-gate.test.ts — AI 模型配置门禁与 Key 持久化单元测试套件
 */

import { hasAnyConfiguredModelProvider } from '@/core/config/model-providers';

describe('Model Config Gate & API Key Storage Verification Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Should return false when no API key is configured in localStorage', () => {
    expect(hasAnyConfiguredModelProvider()).toBe(false);
  });

  it('Should return true when an API key is stored under ai_model_settings_{provider}', () => {
    localStorage.setItem('ai_model_settings_openai', JSON.stringify({ apiKey: 'sk-proj-test123456' }));
    expect(hasAnyConfiguredModelProvider()).toBe(true);
  });

  it('Should return true when an API key is stored under api_{provider}_key', () => {
    localStorage.setItem('api_deepseek_key', 'sk-ds-testkey123456');
    expect(hasAnyConfiguredModelProvider()).toBe(true);
  });

  it('Should return true when an API key is stored under novella_api_key_{provider}', () => {
    localStorage.setItem('novella_api_key_zhipu', 'zhipu-testkey123456');
    expect(hasAnyConfiguredModelProvider()).toBe(true);
  });
});
