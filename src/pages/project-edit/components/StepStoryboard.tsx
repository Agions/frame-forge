/**
 * Step 4: AI 漫剧分镜绘制工坊 (StepStoryboard)
 * 封装 3 栏极客 Studio 工作台并集成前后步骤平滑导航
 */

import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import React, { Suspense, lazy } from 'react';

import { useProject } from '@/core/hooks/useProject';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { toast } from '@/shared/components/ui/toast';

import { useProjectEdit } from '../context/ProjectEditContext';
import { useStepStoryboardContext } from '../context/selectors';

const StoryboardEditor = lazy(() => import('@/features/storyboard/components/StoryboardEditor'));
const CollaborationPanel = lazy(() => import('./CollaborationPanel'));

function StepStoryboard() {
  const { state: projectEditState } = useProjectEdit();
  const { focusFrameId } = projectEditState;
  const {
    frames: storyboardFrames,
    onFramesChange,
    onFrameSelect,
    onBuildDraft,
  } = useStepStoryboardContext();
  const { setCurrentStep } = useProject();

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/90 border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 m-0">
                Step 4: AI 漫剧分镜绘制工作台
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                3 栏 Studio 工作台：镜头卷轴、HD 16:9 画布视口、运镜构图芯片与 8K AI 场景生图
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onBuildDraft();
              toast.success('已自动生成最新分镜草案');
            }}
          >
            一键智能生成草案
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <StoryboardEditor
            key={`${storyboardFrames.length}-${storyboardFrames[0]?.id || 'none'}`}
            initialFrames={storyboardFrames}
            focusFrameId={focusFrameId}
            onChange={onFramesChange}
            onFrameSelect={onFrameSelect}
          />
          <CollaborationPanel />
        </Suspense>
      </Card>

      {/* 底部步骤导航 */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" /> 上一步: 镜头拆解
        </Button>
        <Button variant="primary" onClick={() => setCurrentStep(4)} className="gap-1.5">
          下一步: 角色一致性锁定 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default StepStoryboard;
