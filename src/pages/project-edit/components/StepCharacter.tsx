/**
 * Step 5: 角色一致性锁定与 LoRA 档案库 (StepCharacter)
 * Master Reference Protocol 一致性注入与 IP-Adapter 生成器
 */

import { ShieldCheck, UserCheck, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import React, { Suspense, lazy } from 'react';

import { useProject } from '@/core/hooks/useProject';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

import { useStepCharacterContext } from '../context/selectors';

const CharacterDesigner = lazy(
  () => import('@/features/character-consistency/components/CharacterDesigner')
);

function StepCharacter() {
  const { characters, onChange } = useStepCharacterContext();
  const { setCurrentStep } = useProject();

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/90 border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 m-0">
                Step 5: 角色一致性锁定 (Master Reference Protocol)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                锁定角色面部特征、服饰风格、LoRA 模型与 Prompt Tags，保障跨镜头人物绝对一致不走样
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-3 py-1">
            <Lock className="w-3.5 h-3.5 mr-1" /> 8K 一致性引擎已锁定
          </Badge>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <CharacterDesigner characters={characters} onChange={onChange} />
          </div>
        </Suspense>
      </Card>

      {/* 底部步骤导航 */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={() => setCurrentStep(3)} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" /> 上一步: 分镜绘制
        </Button>
        <Button variant="primary" onClick={() => setCurrentStep(5)} className="gap-1.5">
          下一步: 硬件场景渲染 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default StepCharacter;
