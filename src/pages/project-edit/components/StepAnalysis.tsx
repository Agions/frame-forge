/**
 * Step 2: AI 角色与故事结构分析 (StepAnalysis)
 * Cyber Midnight 高高感角色卡片提炼与故事脉络生成
 */

import { User, Sparkles, Wand2, ArrowRight, ArrowLeft, Layers } from 'lucide-react';
import React, { useState } from 'react';

import { useProject } from '@/core/hooks/useProject';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

import { useStepAnalysisContext } from '../context/selectors';

const DEMO_CHARACTERS = [
  {
    id: 'c1',
    name: '萧炎',
    role: '男主角',
    gender: '男',
    tags: '热血少年, 黑色战袍, 坚毅眼神',
    voice: '云希 (热血青年)',
  },
  {
    id: 'c2',
    name: '药老',
    role: '导师',
    gender: '男',
    tags: '灵魂体, 白发老者, 仙风道骨',
    voice: '云健 (沉稳老者)',
  },
  {
    id: 'c3',
    name: '纳兰嫣然',
    role: '对手',
    gender: '女',
    tags: '宗门天骄, 青色长裙, 傲骨凛然',
    voice: '晓晓 (高傲女声)',
  },
];

function StepAnalysis() {
  const { content, onAnalyze } = useStepAnalysisContext();
  const { setCurrentStep } = useProject();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  const handleStartAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      onAnalyze?.();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 头部介绍 */}
      <Card className="bg-slate-900/90 border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 m-0">
                Step 2: AI 角色与剧情结构提炼
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                基于深度 LLM 模型自动提取剧本中的主要人物、性格特征、性别音色与核心剧情节点
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            disabled={analyzing}
            onClick={handleStartAnalysis}
            className="gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Wand2 className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? '智能分析推演中...' : '重新智能提炼'}
          </Button>
        </div>

        {/* 提炼的主要角色卡片列表 */}
        {analyzed && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-400" />
                提取到的核心角色 ({DEMO_CHARACTERS.length} 位)
              </span>
              <Badge variant="outline" className="text-[11px] border-indigo-500/40 text-indigo-300">
                Master Consistency Protocol 准备就绪
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {DEMO_CHARACTERS.map((char) => (
                <div
                  key={char.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">{char.name}</span>
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">
                      {char.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    <span className="text-slate-500">外貌特征: </span>
                    {char.tags}
                  </p>
                  <div className="text-[11px] text-indigo-400 font-mono pt-1 border-t border-slate-900 flex justify-between">
                    <span>推荐音色:</span>
                    <span>{char.voice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 剧情脉络纲要 */}
      <Card className="bg-slate-900/90 border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-400" />
          推导故事剧情三幕式脉络
        </span>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              序幕起因
            </span>
            <span className="text-slate-300 flex-1">
              萧炎在纳兰嫣然强势退婚的屈辱下，于家族大殿立下三年之约，立誓发愤图强。
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold text-[10px]">
              发展转折
            </span>
            <span className="text-slate-300 flex-1">
              戒指中药老觉醒，传授焚诀功法与炼药禁术，萧炎踏上魔兽山脉生死苦修。
            </span>
          </div>
        </div>
      </Card>

      {/* 底部步骤导航 */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={() => setCurrentStep(0)} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" /> 上一步: 剧本导入
        </Button>
        <Button variant="primary" onClick={() => setCurrentStep(2)} className="gap-1.5">
          下一步: 镜头拆解 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default StepAnalysis;
