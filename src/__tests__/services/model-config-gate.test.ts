/**
 * model-config-gate.test.ts — AI 模型配置门禁、格式真实校验与 Key 持久化单元测试套件
 */

import { hasAnyConfiguredModelProvider, verifyModelApiKey } from '@/core/config/model-providers';

describe('Model Config Gate & API Key Storage Verification Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Should return false when no API key is configured in localStorage', () => {
    expect(hasAnyConfiguredModelProvider()).toBe(false);
  });

  it('Should return true when a valid API key is stored under ai_model_settings_{provider}', () => {
    localStorage.setItem('ai_model_settings_openai', JSON.stringify({ apiKey: 'sk-proj-validtestkey1234567890' }));
    expect(hasAnyConfiguredModelProvider()).toBe(true);
  });

  it('Should return true when a valid API key is stored under api_{provider}_key', () => {
    localStorage.setItem('api_deepseek_key', 'sk-ds-validtestkey1234567890');
    expect(hasAnyConfiguredModelProvider()).toBe(true);
  });

  it('Should reject invalid API keys during real format verification', async () => {
    // 1. 空 Key
    const resEmpty = await verifyModelApiKey('openai', '');
    expect(resEmpty.success).toBe(false);
    expect(resEmpty.message).toContain('不能为空');

    // 2. OpenAI 缺少 sk- 前缀或太短
    const resOpenAI = await verifyModelApiKey('openai', 'invalid-key');
    expect(resOpenAI.success).toBe(false);
    expect(resOpenAI.message).toContain('格式错误');

    // 3. Anthropic 缺少 sk-ant- 前缀
    const resAnthropic = await verifyModelApiKey('anthropic', 'sk-proj-12345');
    expect(resAnthropic.success).toBe(false);
    expect(resAnthropic.message).toContain('格式错误');

    // 4. 正确格式的 Key 校验成功
    const resValid = await verifyModelApiKey('openai', 'sk-proj-12345678901234567890');
    expect(resValid.success).toBe(true);
    expect(resValid.message).toContain('校验通过');
  });
});
