import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, RotateCcw, X, Check } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  subtitle,
  message = 'Please confirm this action to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  loading = false
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'rgba(239, 68, 68, 0.15)',
      iconBorder: 'rgba(239, 68, 68, 0.35)',
      iconColor: '#EF4444',
      icon: <Trash2 size={24} color="#EF4444" />,
      confirmBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      confirmHover: '#DC2626',
      confirmShadow: '0 8px 24px rgba(239, 68, 68, 0.35)',
      modalBorder: 'rgba(239, 68, 68, 0.3)'
    },
    warning: {
      iconBg: 'rgba(242, 92, 5, 0.15)',
      iconBorder: 'rgba(242, 92, 5, 0.35)',
      iconColor: 'var(--tb-orange)',
      icon: <RotateCcw size={24} color="var(--tb-orange)" />,
      confirmBg: 'linear-gradient(135deg, #F25C05 0%, #D94E00 100%)',
      confirmHover: '#D94E00',
      confirmShadow: '0 8px 24px rgba(242, 92, 5, 0.35)',
      modalBorder: 'rgba(242, 92, 5, 0.3)'
    },
    primary: {
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconBorder: 'rgba(16, 185, 129, 0.35)',
      iconColor: '#10B981',
      icon: <Check size={24} color="#10B981" />,
      confirmBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      confirmHover: '#059669',
      confirmShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
      modalBorder: 'rgba(16, 185, 129, 0.3)'
    }
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 10, 8, 0.82)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'tbModalFadeIn 0.25s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(24, 42, 35, 0.98) 0%, rgba(14, 25, 20, 0.98) 100%)',
          border: `1px solid ${style.modalBorder}`,
          borderRadius: 20,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(0, 0, 0, 0.4)',
          maxWidth: 480,
          width: '100%',
          overflow: 'hidden',
          animation: 'tbModalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--tb-card-border)',
            color: 'var(--text-muted)',
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ padding: '28px 28px 20px 28px' }}>
          {/* Header Icon + Title */}
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: style.iconBg,
                border: `1px solid ${style.iconBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {style.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 6,
                  letterSpacing: '-0.02em'
                }}
              >
                {title}
              </h3>

              {subtitle && (
                <div
                  style={{
                    display: 'inline-block',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid var(--tb-card-border)',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    marginBottom: 10
                  }}
                >
                  {subtitle}
                </div>
              )}

              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 28px 24px 28px',
            background: 'rgba(10, 18, 14, 0.6)',
            borderTop: '1px solid var(--tb-card-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '10px 18px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--tb-card-border)',
              borderRadius: 10,
              color: 'var(--text-main)',
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '10px 22px',
              background: style.confirmBg,
              boxShadow: style.confirmShadow,
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
