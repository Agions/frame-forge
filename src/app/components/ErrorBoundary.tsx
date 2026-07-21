/**
 * Error Boundary — 全局错误边界
 */

import { Component, type ReactElement, ReactNode } from 'react';

import { logger } from '@/core/utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  name?: string;
  rethrowInTest?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    const name = this.props.name ?? 'GlobalErrorBoundary';

    logger.error('[ErrorBoundary] Caught error', {
      boundaryName: name,
      error: error.message,
      stack: error.stack,
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '32px',
              borderRadius: '12px',
              background: 'var(--color-bg-elevated)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              textAlign: 'center',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>出了点问题</h1>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                marginBottom: '24px',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error?.message ?? '应用程序遇到了一个意外错误'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--color-interactive-primary)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                重新加载
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-default)',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = (props: ErrorBoundaryProps): ReactElement => (
  <GlobalErrorBoundary {...props} />
);

export default ErrorBoundary;
