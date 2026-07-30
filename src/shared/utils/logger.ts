// Round-2 过渡 shim：原文件已迁移到 @/core/utils/shared-logger
// 注意：shared 层的 lightweight logger 与 core/utils/logger (full-featured) 是两个不同的工具，
// 为避免命名冲突保持原有语义，shared 版继续以 shared-logger 名字提供。
export * from '@/core/utils/shared-logger';
