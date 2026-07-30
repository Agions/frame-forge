// Round-2 过渡：旧路径已迁移到 @/core/utils/*
// 注：@/core/utils/timing 已经把 retry 别名为 retryRequest 并导出；
// 不能再用 export * from '@/core/utils/request'，否则 retryRequest 会重复。
// 这里沿用 core/utils/index.ts 的策略：只重导出 RequestCache 与 requestCache。
export * from '@/core/utils/format';
export * from '@/core/utils/format-ui';
export * from '@/core/utils/async';
export * from '@/core/utils/data';
export * from '@/core/utils/environment';
export { RequestCache, requestCache } from '@/core/utils/request';
export type { RetryOptions } from '@/core/utils/request';
export * from '@/core/utils/string';
export * from '@/core/utils/collection';
export * from '@/core/utils/class-names';
export * from '@/core/utils/timing';
export * from '@/core/utils/shared-logger';
