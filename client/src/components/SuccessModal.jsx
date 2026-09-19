import React from 'react';
import { CheckCircle, Printer, Plus, List, Copy, Check, Mail, ExternalLink, X } from 'lucide-react';

export default function SuccessModal({
  isOpen,
  onClose,
  invoice,
  onPrintPreview,
  onCreateAnother,
  onViewList
}) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !invoice) return null;

  const handleCopyNo = () => {
    if (invoice?.invoiceNo) {
      navigator.clipboard.writeText(invoice.invoiceNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedTotal = Number(invoice.total || 0).toLocaleString('en-IN');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 10, 8, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'tbModalFadeIn 0.25s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #182A23 0%, #0E1A15 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 24,
          boxShadow: '0 25px 65px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.2)',
          maxWidth: 520,
          width: '100%',
          overflow: 'hidden',
          animation: 'tbModalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
      >
        {/* Header Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--tb-card-border)',
            color: 'var(--text-muted)',
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Celebration Header */}
        <div style={{ padding: '36px 32px 20px 32px', textAlign: 'center' }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(77, 124, 51, 0.25) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <CheckCircle size={36} color="#10B981" />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 22,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 6
            }}
          >
            Invoice Saved Successfully!
          </h2>

          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Record saved to your permanent Neon Cloud PostgreSQL database.
          </p>
        </div>

        {/* Details Card */}
        <div style={{ padding: '0 32px 24px 32px' }}>
          <div
            style={{
              background: 'rgba(11, 20, 16, 0.75)',
              border: '1px solid var(--tb-card-border)',
              borderRadius: 16,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            {/* Invoice No & Copy */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Invoice Number</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: 15,
                    color: 'var(--tb-orange)',
                    letterSpacing: 0.5
                  }}
                >
                  {invoice.invoiceNo}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNo}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--tb-card-border)',
                    color: copied ? '#10B981' : 'var(--text-muted)',
                    borderRadius: 6,
                    padding: '3px 7px',
                    fontSize: 11,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                  title="Copy Invoice Number"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Client Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Client Name</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>
                {invoice.clientName}
              </span>
            </div>

            {/* Destination */}
            {invoice.destination && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Destination</span>
                <span style={{ fontSize: 13, color: 'var(--text-main)' }}>
                  {invoice.destination}
                </span>
              </div>
            )}

            {/* Total Amount */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: 10
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Total Amount</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#10B981'
                }}
              >
                ₹{formattedTotal}
              </span>
            </div>

            {/* Email notification status */}
            {invoice.clientEmail ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: 12,
                  color: '#34D399'
                }}
              >
                <Mail size={15} color="#10B981" />
                <span>Voucher automatically emailed to <strong>{invoice.clientEmail}</strong></span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            padding: '18px 32px 28px 32px',
            background: 'rgba(10, 18, 14, 0.65)',
            borderTop: '1px solid var(--tb-card-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          {/* Primary Action: Print / View Voucher */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onPrintPreview) onPrintPreview(invoice);
            }}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, var(--tb-orange) 0%, #D94E00 100%)',
              boxShadow: '0 8px 24px rgba(242, 92, 5, 0.35)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <Printer size={18} />
            <span>Print / View Official Voucher</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onCreateAnother) onCreateAnother();
              }}
              style={{
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--tb-card-border)',
                borderRadius: 10,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Plus size={15} />
              <span>Create Another</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onViewList) onViewList();
              }}
              style={{
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--tb-card-border)',
                borderRadius: 10,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <List size={15} />
              <span>Invoices List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
