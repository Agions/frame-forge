/**
 * AI 模型提供商配置（包含官方 API Key 快捷申请入口）
 */
import type { ModelProvider } from '@/shared/types';

export interface ModelProviderInfo {
  name: string;
  icon: string;
  website: string;
  apiDocs: string;
  apiKeyApplyUrl: string; // 快捷申请 API Key 跳转入口
  keyFormat: string;
  keyPlaceholder: string;
  description: string;
}

export const MODEL_PROVIDERS: Record<ModelProvider, ModelProviderInfo> = {
  openai: {
    name: 'OpenAI',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    website: 'https://openai.com',
    apiDocs: 'https://platform.openai.com/docs',
    apiKeyApplyUrl: 'https://platform.openai.com/api-keys',
    keyFormat: 'sk-...',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
    description: 'GPT-5.6 Sol / GPT-4o 旗舰模型系列',
  },
  anthropic: {
    name: 'Anthropic',
    icon: 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
    website: 'https://anthropic.com',
    apiDocs: 'https://docs.anthropic.com',
    apiKeyApplyUrl: 'https://console.anthropic.com/settings/keys',
    keyFormat: 'sk-ant-...',
    keyPlaceholder: 'sk-ant-xxxxxxxxxxxxxxxx',
    description: 'Claude Opus 5 / Sonnet 5 最强剧本编演',
  },
  google: {
    name: 'Google Gemini',
    icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
    website: 'https://ai.google.dev',
    apiDocs: 'https://ai.google.dev/docs',
    apiKeyApplyUrl: 'https://aistudio.google.com/app/apikey',
    keyFormat: 'AIza...',
    keyPlaceholder: 'AIzaSyxxxxxxxxxxxxxxxx',
    description: 'Gemini 3.6 Flash 200万上下文超长视频推演',
  },
  deepseek: {
    name: 'DeepSeek 深度求索',
    icon: 'https://www.deepseek.com/favicon.ico',
    website: 'https://www.deepseek.com',
    apiDocs: 'https://platform.deepseek.com/api-docs',
    apiKeyApplyUrl: 'https://platform.deepseek.com/api_keys',
    keyFormat: 'sk-...',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    description: 'DeepSeek-V4 Flash / Pro 国产顶级大模型',
  },
  baidu: {
    name: '百度文心一言',
    icon: 'https://nlp-eb.cdn.bcebos.com/logo/ernie-bot.png',
    website: 'https://qianfan.baidu.com',
    apiDocs: 'https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html',
    apiKeyApplyUrl: 'https://console.bce.baidu.com/qianfan/ais/console/onlineService',
    keyFormat: 'API_KEY:SECRET_KEY',
    keyPlaceholder: '请输入百度 API_KEY 和 SECRET_KEY',
    description: '文心一言 ERNIE 4.0 Turbo / 128K 拟真角色模型',
  },
  alibaba: {
    name: '阿里通义千问',
    icon: 'https://img.alicdn.com/tfs/TB1Ly5oS3HqK1RjSZFPXXcwapXa-238-54.png',
    website: 'https://dashscope.aliyun.com',
    apiDocs: 'https://help.aliyun.com/dashscope',
    apiKeyApplyUrl: 'https://dashscope.console.aliyun.com/apiKey',
    keyFormat: 'sk-...',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    description: 'Qwen 3.8-Max 2.4万亿参数旗舰全模态大模型',
  },
  zhipu: {
    name: '智谱 AI',
    icon: 'https://www.zhipuai.cn/favicon.ico',
    website: 'https://open.bigmodel.cn',
    apiDocs: 'https://open.bigmodel.cn/dev/howuse/glm-4',
    apiKeyApplyUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
    keyFormat: '...',
    keyPlaceholder: 'xxxxxxxx.xxxxxxxx',
    description: 'GLM-5.2 长程编导调度与中文小说精化',
  },
  iflytek: {
    name: '科大讯飞星火',
    icon: 'https://xinghuo.xfyun.cn/favicon.ico',
    website: 'https://xinghuo.xfyun.cn',
    apiDocs: 'https://www.xfyun.cn/doc/spark/Web.html',
    apiKeyApplyUrl: 'https://console.xfyun.cn/services/bm',
    keyFormat: 'APPID:API_KEY:API_SECRET',
    keyPlaceholder: '格式：APPID:API_KEY:API_SECRET',
    description: '讯飞星火 Spark V4.0 Ultra / Max 深度语言模型',
  },
  tencent: {
    name: '腾讯云混元',
    icon: 'https://cloud.tencent.com/favicon.ico',
    website: 'https://cloud.tencent.com/product/hunyuan',
    apiDocs: 'https://cloud.tencent.com/document/product/1729',
    apiKeyApplyUrl: 'https://console.cloud.tencent.com/cam/capi',
    keyFormat: 'SecretId:SecretKey',
    keyPlaceholder: '格式：SecretId:SecretKey',
    description: '腾讯混元 Hunyuan Pro / Vision 视听融合模型',
  },
  minimax: {
    name: 'MiniMax',
    icon: 'https://www.minimax.io/favicon.ico',
    website: 'https://www.minimax.io',
    apiDocs: 'https://platform.minimax.io',
    apiKeyApplyUrl: 'https://platform.minimax.io/user-center/basic-information/interface-key',
    keyFormat: 'api-key',
    keyPlaceholder: 'xxxxxxxxxxxxxxxx',
    description: 'MiniMax H3 双声道立体声视频生成模型',
  },
  moonshot: {
    name: '月之暗面 Kimi',
    icon: 'https://www.moonshot.cn/favicon.ico',
    website: 'https://www.moonshot.cn',
    apiDocs: 'https://platform.moonshot.cn',
    apiKeyApplyUrl: 'https://platform.moonshot.cn/console/api-keys',
    keyFormat: 'api-key',
    keyPlaceholder: 'xxxxxxxxxxxxxxxx',
    description: 'Kimi K3 2.8万亿参数长篇小说大模型',
  },
  kling: {
    name: '快手可灵 AI',
    icon: 'https://www.kuaishou.com/favicon.ico',
    website: 'https://app.klingai.com',
    apiDocs: 'https://app.klingai.com/global/dev/document-api',
    apiKeyApplyUrl: 'https://app.klingai.com/global/dev/document-api',
    keyFormat: 'api-key',
    keyPlaceholder: 'xxxxxxxxxxxxxxxx',
    description: '可灵 3.0 Omni 4K 电影级分镜视频引擎',
  },
  bytedance: {
    name: '字节跳动火山',
    icon: 'https://www.bytedance.com/favicon.ico',
    website: 'https://www.bytedance.com',
    apiDocs: 'https://www.volcengine.com/docs/6792',
    apiKeyApplyUrl: 'https://console.volcengine.com/iam/keymanage/',
    keyFormat: 'api-key',
    keyPlaceholder: 'xxxxxxxxxxxxxxxx',
    description: 'Seedance 2.5 30秒连续视频控制引擎',
  },
};
