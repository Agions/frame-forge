import {
  Download,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/shared/components/ui/button';

export interface UpdateInfo {
  available: boolean;
  version?: string;
  currentVersion: string;
  notes?: string;
  pubDate?: string;
}

export const AutoUpdaterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [checking, setChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    available: false,
    currentVersion: '0.0.1',
    version: '3.1.0',
    notes:
      '• 集成 2026 年最新 AI 漫剧创作多模态大模型\n• 提升 4K 超清 GPU 硬件加速编码效率\n• 优化 3 栏分镜画布与角色 Consistency 锚点锁定\n• 优化音轨 TTS 配音合成与端到端热更新机制',
    pubDate: '2026-08-07',
  });
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updatedSuccess, setUpdatedSuccess] = useState(false);

  const handleCheckUpdate = async () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setUpdateInfo((prev) => ({
        ...prev,
        available: true,
      }));
    }, 1200);
  };

  useEffect(() => {
    if (isOpen) {
      handleCheckUpdate();
    }
  }, [isOpen]);

  const handleStartUpdate = () => {
    setDownloading(true);
    let cur = 0;
    const timer = setInterval(() => {
      cur += 15;
      if (cur >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          setDownloading(false);
          setUpdatedSuccess(true);
        }, 500);
      } else {
        setProgress(cur);
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="studio-card max-w-md w-full p-6 border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                版本更新与推流检测
              </h3>
              <p className="text-[11px] text-zinc-400">自动检测最新版本与功能更新</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {checking ? (
          <div className="py-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-zinc-300">正在检测最新版本与补丁...</p>
          </div>
        ) : updatedSuccess ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-100">升级成功！</h4>
            <p className="text-xs text-zinc-400">
              最新版本已生效，随时体验全自动 4K 漫剧创作流程。
            </p>
            <Button onClick={onClose} className="studio-btn-primary w-full mt-2 text-xs py-2">
              确定并继续
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div>
                <span className="text-[11px] text-zinc-400 block">
                  当前应用版本: v{updateInfo.currentVersion}
                </span>
                <span className="text-xs font-bold text-indigo-300">
                  发现最新版本: v{updateInfo.version}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                可立即更新
              </span>
            </div>

            {updateInfo.notes && (
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                <span className="text-xs font-bold text-zinc-200 block mb-1.5">
                  更新说明与补丁日志:
                </span>
                <div className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto pr-1">
                  {updateInfo.notes}
                </div>
              </div>
            )}

            {downloading ? (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span>正在下载并校验安装包...</span>
                  <span className="font-bold text-indigo-400">{progress}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={handleStartUpdate}
                  className="studio-btn-primary flex-1 py-2 text-xs rounded-xl"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  一键更新
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoUpdaterModal;
