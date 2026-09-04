/**
 * Shared-layer lightweight logger.
 * 纯 shared 层日志工具，零外部/core 依赖。
 */

export const logger = {
  info: (...args: unknown[]) => console.info('[Shared]', ...args),
  warn: (...args: unknown[]) => console.warn('[Shared]', ...args),
  error: (...args: unknown[]) => console.error('[Shared]', ...args),
  debug: (...args: unknown[]) => console.debug('[Shared]', ...args),
  success: (...args: unknown[]) => console.info('[Shared:success]', ...args),
};
