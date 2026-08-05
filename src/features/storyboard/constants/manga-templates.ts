import {
  Sword,
  Film,
  Building2,
  BrainCircuit,
  Zap,
  Crown,
  Sparkles,
  Shield,
  Ghost,
  Flame,
  Wand2,
} from 'lucide-react';

export interface MangaTemplate {
  key: string;
  title: string;
  category: string;
  desc: string;
  icon: any;
  defaultName: string;
  defaultDesc: string;
  stylePrompt: string;
}

export const HOT_MANGA_TEMPLATES: MangaTemplate[] = [
  {
    key: 'xianxia',
    title: '仙侠玄幻',
    category: '热血玄幻',
    desc: '3D 国漫修仙对决，天穹风云与灵气特写',
    icon: Sword,
    defaultName: '《破苍穹·异火重临》',
    defaultDesc: '三十年河东莫欺少年穷，异火重临玄幻大陆，踏平九天十地。',
    stylePrompt:
      'masterpiece, 8k, Chinese xianxia anime style, epic floating islands, glowing aura, dramatic lighting',
  },
  {
    key: 'cyberpunk',
    title: '赛博朋克',
    desc: '霓虹雨夜科幻，冷调粒子与机械构图',
    category: '未来科幻',
    icon: Film,
    defaultName: '《赛博纪元 2099》',
    defaultDesc: '高科技低生活，黑客与仿生人在霓虹雨夜中的救赎与反抗。',
    stylePrompt:
      'masterpiece, 8k, cyberpunk anime style, neon rain night, holographic UI, chrome body parts, cyan purple tone',
  },
  {
    key: 'god_of_war',
    title: '战神逆袭',
    category: '都市热血',
    desc: '歪嘴战神归来，隐姓埋名与强势反转',
    icon: Zap,
    defaultName: '《战神归来：誓扫千军》',
    defaultDesc: '五年战神龙王归来，发现女儿竟住狗窝！一声令下，十万退役战士赶来！',
    stylePrompt:
      'masterpiece, 8k, urban action anime, domineering protagonist, sharp suit, high contrast, cinematic aura',
  },
  {
    key: 'ceo_romance',
    title: '豪门甜宠',
    category: '言情短剧',
    desc: '霸总掌心娇妻，错爱追妻与甜虐交织',
    icon: Crown,
    defaultName: '《豪门错爱：霸总的掌心娇妻》',
    defaultDesc: '替嫁给传说中冷酷无情的帝国总裁，却没想到被宠上了天。',
    stylePrompt:
      'masterpiece, 8k, romance anime style, handsome male lead, sparkling eyes, luxurious mansion interior, soft glow',
  },
  {
    key: 'isekai_system',
    title: '系统苟道',
    category: '脑洞穿越',
    desc: '绑定无敌系统，苟在异界偷偷成圣',
    icon: Sparkles,
    defaultName: '《绑定无敌系统：苟在修仙界》',
    defaultDesc: '穿越修仙界，获得【万倍返还系统】，只要苟住不作死，终成万法道祖。',
    stylePrompt:
      'masterpiece, 8k, light novel anime style, humorous expression, magical glowing system UI panel, vibrant color',
  },
  {
    key: 'apocalypse',
    title: '末世生存',
    category: '废土冒险',
    desc: '丧尸危机废土，避难所构建与异能觉醒',
    icon: Shield,
    defaultName: '《末日崛起：生存要塞》',
    defaultDesc: '极寒末世降临，囤积百亿物资，打造全地球最坚固的终极避难所。',
    stylePrompt:
      'masterpiece, 8k, post-apocalyptic anime, snow apocalypse, futuristic shelter fortress, dark gritty atmospheric',
  },
  {
    key: 'weird_rules',
    title: '规则怪谈',
    category: '无限流',
    desc: '超自然逻辑推理，规则悬疑与生死博弈',
    icon: Ghost,
    defaultName: '《规则怪谈：神级推演》',
    defaultDesc: '【规则一：不要在午夜看镜子】国运怪谈降临，代表龙国破解终极法则。',
    stylePrompt:
      'masterpiece, 8k, horror mystery anime, dark shadows, strange uncanny atmosphere, red blue neon glitch',
  },
  {
    key: 'superpower',
    title: '热血异能',
    category: '校园异能',
    desc: '异能觉醒对决，高能卡牌与少年拯救世界',
    icon: Flame,
    defaultName: '《异能觉醒：高能卡牌》',
    defaultDesc: '全人类觉醒异能时代，废柴少年意外抽中 SSS 级神话元卡！',
    stylePrompt:
      'masterpiece, 8k, shonen action anime, explosive energy visual effects, dynamic angle, high speed lines',
  },
  {
    key: 'urban',
    title: '现代都市',
    category: '都市脑洞',
    desc: '二次元日漫风格，高尚都市剧情与商战',
    icon: Building2,
    defaultName: '《重生之都市修仙》',
    defaultDesc: '一代仙尊重回少年时代，执掌都市风云，横扫一切不服。',
    stylePrompt:
      'masterpiece, 8k, modern urban anime, night city skyline, sleek outfit, glowing magic elements',
  },
  {
    key: 'mystery',
    title: '悬疑侦探',
    category: '犯罪推理',
    desc: '水墨阴影，诡秘推理与极限破案',
    icon: BrainCircuit,
    defaultName: '《诡异复苏：迷雾真相》',
    defaultDesc: '迷雾笼罩城市，利用推理逻辑与超自然视听破解二十年前悬案。',
    stylePrompt:
      'masterpiece, 8k, mystery noir anime style, rain dripping, streetlight reflection, detective trench coat',
  },
];

/**
 * 模拟 AI 智能解析任意关键词，生成专属漫剧模板
 */
export function generateAiCustomTemplate(keyword: string): MangaTemplate {
  const cleanKw = keyword.trim() || '奇幻冒险';
  return {
    key: `custom-${Date.now()}`,
    title: `AI: ${cleanKw}`,
    category: 'AI 灵感生成',
    desc: `根据「${cleanKw}」生成的专属漫剧题材 Prompt`,
    icon: Wand2,
    defaultName: `《${cleanKw}·异界传说》`,
    defaultDesc: `基于「${cleanKw}」推演的核心剧情：主角在危机四伏的舞台中觉醒宿命，开启视听传奇。`,
    stylePrompt: `masterpiece, 8k, highly detailed anime style based on ${cleanKw}, cinematic camera composition, dramatic atmosphere`,
  };
}
