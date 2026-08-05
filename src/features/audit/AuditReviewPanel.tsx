import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  CornerDownLeft,
  RefreshCcw,
} from 'lucide-react';
import React, { useState } from 'react';

import { toast } from '@/shared/components/ui/toast';
import { WorkflowStage, RoleType, AuditReviewRecord, WorkflowEngine } from '@mangav/core';
import { MangaCard, MangaButton, StatusBadge } from '@mangav/ui';

interface AuditReviewPanelProps {
  currentStage: WorkflowStage;
  activeRole: RoleType;
  auditHistory?: AuditReviewRecord[];
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
  onRequestReview?: () => void;
}

export const AuditReviewPanel: React.FC<AuditReviewPanelProps> = ({
  currentStage,
  activeRole,
  auditHistory = [],
  onApprove,
  onReject,
  onRequestReview,
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPendingReview =
    currentStage === 'ScriptPendingReview' ||
    currentStage === 'StoryboardPendingReview' ||
    currentStage === 'ProductionPendingReview';

  const isRejected =
    currentStage === 'ScriptRejected' ||
    currentStage === 'StoryboardRejected' ||
    currentStage === 'ProductionRejected';

  const latestAudit = auditHistory.length > 0 ? auditHistory[auditHistory.length - 1] : null;

  const handleApprove = () => {
    setIsSubmitting(true);
    try {
      onApprove(comment || '审核通过，准予进入下一阶段');
      setComment('');
      toast.success('已批准通过！流程已流转至下一阶段。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    if (!comment.trim()) {
      toast.warning('请在评论框中输入具体的驳回与修改意见！');
      return;
    }
    setIsSubmitting(true);
    try {
      onReject(comment);
      setComment('');
      toast.error('已驳回打回！建议已通知对应负责人修正。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 审核员视角的审核控制卡片
  if (activeRole === 'auditor') {
    return (
      <MangaCard
        title="导演 / 审核员专属质检面板"
        subtitle="审核创作产物质量，批准通过或驳回并填写修改意见，形成闭环管理"
        className="border-indigo-500/40 mb-6 bg-slate-900/90"
      >
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200 block">当前流程阶段</span>
              <span className="text-xs text-indigo-300 font-mono">
                {WorkflowEngine.getStageLabel(currentStage)}
              </span>
            </div>
          </div>

          <StatusBadge
            status={isPendingReview ? 'warning' : isRejected ? 'error' : 'success'}
            label={isPendingReview ? '待质检审核' : isRejected ? '阶段已驳回' : '质检合规 / 进行中'}
          />
        </div>

        {/* 审核意见录入 */}
        <div className="space-y-3 mb-4">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            审核意见与修改指导建议
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="若批准通过可留空（默认审核通过）；若打回重做，请详细输入打回原因和修改建议..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[75px]"
          />
        </div>

        {/* 审核操作按钮组 */}
        <div className="flex items-center justify-end gap-3">
          {isPendingReview && (
            <MangaButton
              variant="danger"
              size="sm"
              onClick={handleReject}
              disabled={isSubmitting}
              className="gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              驳回打回上一阶段
            </MangaButton>
          )}

          <MangaButton
            variant="primary"
            size="sm"
            onClick={handleApprove}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isPendingReview ? '质检通过并推进' : '强制审核通过'}
          </MangaButton>
        </div>

        {/* 历史记录展示 */}
        {auditHistory.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              审核历史闭环记录
            </span>
            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {auditHistory
                .slice()
                .reverse()
                .map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-2.5 rounded-lg border text-xs ${
                      rec.status === 'rejected'
                        ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                        : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">
                        {rec.auditorName} ({WorkflowEngine.getStageLabel(rec.stage)})
                      </span>
                      <span className="text-[10px] opacity-75">
                        {new Date(rec.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90">{rec.comment}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </MangaCard>
    );
  }

  // 非审核员视角：根据审核状态显示简明提醒或申请审核入口
  return (
    <div className="mb-6">
      {isRejected && latestAudit && (
        <div className="p-4 bg-rose-950/50 border border-rose-500/40 rounded-2xl flex items-start gap-3 mb-4 shadow-xl">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-rose-200">
                审核驳回提醒：请根据导演意见修正后重新提交
              </h4>
              <span className="text-[10px] text-rose-400 font-mono">
                {new Date(latestAudit.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs text-rose-300/90 mt-1 bg-rose-900/30 p-2.5 rounded-lg border border-rose-500/20 font-mono">
              💬 审核意见: "{latestAudit.comment}"
            </p>
            {onRequestReview && (
              <div className="mt-3 flex justify-end">
                <MangaButton
                  size="sm"
                  variant="outline"
                  onClick={onRequestReview}
                  className="gap-1 text-xs"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  修改完毕，重新提交审核
                </MangaButton>
              </div>
            )}
          </div>
        </div>
      )}

      {isPendingReview && (
        <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-indigo-300">
            <CornerDownLeft className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>当前阶段产物已提交，正等待审核员/导演质检评估中...</span>
          </div>
          <StatusBadge status="warning" label="等待审核中" size="sm" />
        </div>
      )}
    </div>
  );
};
