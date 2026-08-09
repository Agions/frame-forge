/**
 * VideoEditorPage 子组件 - 工具栏相关
 */
import { Upload, Undo, Redo, Download, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { Modal } from '@/components/ui/modal';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/typography';

import styles from '../VideoEditorPage.module.less';

import { useVideoEditor } from './hooks/useVideoEditor';

type VideoQuality = 'low' | 'medium' | 'high' | 'ultra';
type OutputFormat = 'mp4' | 'mov' | 'mkv' | 'webm';
type UseVideoEditorState = ReturnType<typeof useVideoEditor>;

// ========== SettingDropdown ==========

function SettingDropdown({
  label,
  value,
  items,
  onKey,
}: {
  label: string;
  value: string;
  items: { key: string; label: string }[];
  onKey: (key: { key: string }) => void;
}) {
  const menu = {
    items: items.map((item) => ({
      key: item.key,
      label: item.label,
    })),
    onClick: onKey,
  };

  return (
    <div className={styles.settingItem}>
      <Text className={styles.settingLabel}>{label}</Text>
      <Dropdown menu={menu} trigger={['click']}>
        <Button variant="outline" size="small">
          {value} <span style={{ marginLeft: 4 }}>▼</span>
        </Button>
      </Dropdown>
    </div>
  );
}

// ========== ExportProgressModal ==========

function ExportProgressModal({
  isExporting,
  exportProgress,
  exportStatus,
  outputFormat,
  videoQuality,
}: {
  isExporting: boolean;
  exportProgress: number;
  exportStatus: string;
  outputFormat: string;
  videoQuality: string;
}) {
  if (!isExporting) return null;
  const qualityLabel =
    videoQuality === 'low'
      ? '标清 720p'
      : videoQuality === 'medium'
        ? '高清 1080p'
        : videoQuality === 'high'
          ? '超清 1080p60'
          : '4K Ultra HD 60帧 原画';

  const currentFrameNum = Math.min(Math.round((exportProgress / 100) * 400), 400);

  return (
    <Modal
      title="4K 视频压制导出中"
      open={isExporting}
      closable={false}
      footer={null}
      maskClosable={false}
      width={440}
    >
      <div className="space-y-4 py-2 text-zinc-100">
        {/* SVG 圆环进度圈 */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 transition-all duration-300"
                strokeDasharray={`${exportProgress}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-xl font-black text-white">{Math.round(exportProgress)}%</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 mt-2 font-mono">
            正在生成第 <span className="text-indigo-400 font-bold">{currentFrameNum}</span> 帧，共 400 帧...
          </p>
        </div>

        {/* 帧编码日志 Terminal */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] space-y-1 max-h-28 overflow-y-auto">
          <div className="text-emerald-400">✓ 帧 {Math.max(currentFrameNum - 2, 1)} 已渲染完成</div>
          <div className="text-emerald-400">✓ 帧 {Math.max(currentFrameNum - 1, 1)} 已渲染完成</div>
          <div className="text-indigo-400 animate-pulse">▶ 帧 {currentFrameNum} 视频编码与音频合成中...</div>
        </div>

        {/* 硬件加速与格式 */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10 text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GPU 加速: 已启用 (NVENC/Metal)</span>
          </div>
          <span>格式: {outputFormat.toUpperCase()} ({qualityLabel})</span>
        </div>
      </div>
    </Modal>
  );
}

// ========== renderSettingsPanel ==========

function renderSettingsPanel(
  outputFormat: string,
  videoQuality: string,
  setVideoQuality: (q: VideoQuality) => void,
  setOutputFormat: (f: OutputFormat) => void
) {
  const formatLabel = outputFormat.toUpperCase();
  const qualityLabel =
    videoQuality === 'low'
      ? '低 (720p)'
      : videoQuality === 'medium'
        ? '中 (1080p)'
        : videoQuality === 'high'
          ? '高 (1080p)'
          : '超清 (原画)';

  return (
    <div className={styles.settingsPanel}>
      <h3 className={styles.sectionTitle}>导出设置</h3>
      <div className={styles.settingCard}>
        <SettingDropdown
          label="输出格式"
          value={formatLabel}
          items={[
            { key: 'mp4', label: 'MP4 (H.264+AAC)' },
            { key: 'mov', label: 'MOV (H.264+AAC)' },
            { key: 'mkv', label: 'MKV (H.264+AAC)' },
            { key: 'webm', label: 'WebM (VP9+Opus)' },
          ]}
          onKey={({ key }: { key: string }) => {
            if (['mp4', 'mov', 'mkv', 'webm'].includes(key)) setOutputFormat(key as OutputFormat);
          }}
        />
        <SettingDropdown
          label="视频质量"
          value={qualityLabel}
          items={[
            { key: 'low', label: '低 (720p, 1.5Mbps)' },
            { key: 'medium', label: '中 (1080p, 4Mbps)' },
            { key: 'high', label: '高 (1080p, 8Mbps)' },
            { key: 'ultra', label: '超清 (原画, 15Mbps)' },
          ]}
          onKey={({ key }: { key: string }) => {
            if (['low', 'medium', 'high', 'ultra'].includes(key))
              setVideoQuality(key as VideoQuality);
          }}
        />
      </div>
    </div>
  );
}

// ========== renderToolbar ==========

function renderToolbar(state: UseVideoEditorState) {
  const {
    loading,
    canUndo,
    canRedo,
    videoSrc,
    handleLoadVideo,
    handleUndo,
    handleRedo,
    handleAddSegment,
    handleSaveProject,
    handleExportVideo,
    isSaving,
    isExporting,
    segments,
  } = state;

  return (
    <div className={styles.toolbar}>
      <div className={styles.leftTools}>
        <Button type="primary" icon={<Upload />} onClick={handleLoadVideo} loading={loading}>
          加载视频
        </Button>
        <Button icon={<Undo />} disabled={!canUndo} onClick={handleUndo} />
        <Button icon={<Redo />} disabled={!canRedo} onClick={handleRedo} />
        <Button icon={<Plus />} onClick={handleAddSegment} disabled={!videoSrc} />
      </div>
      <div className={styles.rightTools}>
        <Button
          icon={<Download />}
          onClick={handleSaveProject}
          loading={isSaving}
          disabled={!videoSrc}
        >
          保存
        </Button>
        <Button
          type="primary"
          icon={<Download />}
          onClick={handleExportVideo}
          loading={isExporting}
          disabled={!videoSrc || segments.length === 0}
        >
          导出
        </Button>
      </div>
    </div>
  );
}

export { SettingDropdown, ExportProgressModal, renderSettingsPanel, renderToolbar };
export type { VideoQuality, OutputFormat };
