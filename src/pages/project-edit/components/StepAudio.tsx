/**
 * Step 7: 配音配乐
 *
 * 通过 useStepAudioContext() 获取 audioConfig/audioEditorKey/scriptText 等，
 * 不再依赖父组件层层传递 props。
 */
import { Volume2 } from 'lucide-react';
import { lazy } from 'react';

import { StepActions } from '@/components/pipeline/StepActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AudioTrackConfig } from '@/core/audio/types/audio';
import { useProject } from '@/core/hooks/useProject';

import { useStepAudioContext } from '../context/selectors';
import styles from '../ProjectEdit.module.less';

const AudioEditor = lazy(() => import('@/components/media/audio/AudioEditor'));

export interface StepAudioProps {
  audioConfig?: AudioTrackConfig;
  audioEditorKey?: string;
  audioGenerating?: boolean;
  scriptText?: string;
  storyboardFrames?: import('@/core/storyboard/types/storyboard').StoryboardFrame[];
  onConfigChange?: (config: AudioTrackConfig) => void;
  onGenerateVoices?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function StepAudio() {
  const {
    audioConfig,
    audioEditorKey,
    audioGenerating,
    scriptText,
    frames,
    onConfigChange,
    onGenerateVoices,
  } = useStepAudioContext();
  const { setCurrentStep } = useProject();

  return (
    <Card className={styles.stepCard}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          配音配乐
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">添加配音和背景音乐。</p>
        <div className={styles.audioActions}>
          <Button
            variant="default"
            onClick={onGenerateVoices}
            disabled={!scriptText || audioGenerating}
          >
            {audioGenerating ? '生成中...' : '一键生成配音'}
          </Button>
        </div>
        <div className={styles.audioContainer}>
          <AudioEditor
            key={audioEditorKey}
            initialConfig={audioConfig}
            onConfigChange={onConfigChange}
            videoDuration={Math.max(frames.length * 5, 60)}
          />
        </div>
        <StepActions onPrev={() => setCurrentStep(6)} onNext={() => setCurrentStep(8)} />
      </CardContent>
    </Card>
  );
}

export default StepAudio;
