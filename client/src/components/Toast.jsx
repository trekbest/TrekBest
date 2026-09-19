import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 420,
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const { id, type = 'info', title, message } = toast;

  const configs = {
    success: {
      borderColor: 'rgba(16, 185, 129, 0.45)',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      iconBg: 'rgba(16, 185, 129, 0.18)',
      iconColor: '#10B981',
      icon: <CheckCircle2 size={20} color="#10B981" />,
      defaultTitle: 'Success'
    },
    error: {
      borderColor: 'rgba(239, 68, 68, 0.45)',
      glowColor: 'rgba(239, 68, 68, 0.25)',
      iconBg: 'rgba(239, 68, 68, 0.18)',
      iconColor: '#EF4444',
      icon: <AlertCircle size={20} color="#EF4444" />,
      defaultTitle: 'Error'
    },
    warning: {
      borderColor: 'rgba(245, 158, 11, 0.45)',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      iconBg: 'rgba(245, 158, 11, 0.18)',
      iconColor: '#F59E0B',
      icon: <AlertTriangle size={20} color="#F59E0B" />,
      defaultTitle: 'Attention'
    },
    info: {
      borderColor: 'rgba(14, 165, 233, 0.45)',
      glowColor: 'rgba(14, 165, 233, 0.25)',
      iconBg: 'rgba(14, 165, 233, 0.18)',
      iconColor: '#0EA5E9',
      icon: <Info size={20} color="#0EA5E9" />,
      defaultTitle: 'Information'
    }
  };

  const cfg = configs[type] || configs.info;

  return (
    <div
      style={{
        pointerEvents: 'auto',
        background: 'rgba(18, 31, 26, 0.95)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${cfg.borderColor}`,
        borderRadius: 14,
        padding: '14px 16px',
        boxShadow: `0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px ${cfg.glowColor}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        animation: 'tbToastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transition: 'all 0.2s ease'
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: cfg.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {cfg.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 2 }}>
          {title || cfg.defaultTitle}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.45, wordBreak: 'break-word' }}>
          {message}
        </div>
      </div>

      <button
        onClick={() => onDismiss(id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: 4,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          flexShrink: 0
        }}
        aria-label="Dismiss toast"
      >
        <X size={16} />
      </button>
    </div>
  );
}
