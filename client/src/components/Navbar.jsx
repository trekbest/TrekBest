import React from 'react';
import { FileText, List } from 'lucide-react';

export default function Navbar({ currentView, onViewChange, invoiceCount = 0, onNewInvoiceClick }) {
  return (
    <header className="app-header">
      <div
        className="brand-section"
        onClick={() => onViewChange('list')}
        style={{ cursor: 'pointer' }}
        title="TrekBest Travel Invoice Suite"
      >
        <img
          src="/trekbest-logo.png"
          alt="TrekBest Logo"
          className="brand-logo"
          onError={(e) => { e.target.src = '/assets/trekbest-logo.png'; }}
        />
        <div className="brand-title-wrap">
          <div className="brand-name">
            trek<span>best</span>
          </div>
          <div className="brand-tagline">INVOICE & VOUCHER SUITE</div>
        </div>
      </div>

      {/* Direct Live Helpline & Email Info */}
      <div className="tb-nav-helpline" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(242, 92, 5, 0.08)',
        border: '1px solid rgba(242, 92, 5, 0.25)',
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 12
      }}>
        <a
          href="tel:+919824999054"
          style={{ color: 'var(--tb-orange)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
          title="Call Primary Helpline"
        >
          📞 +91 98249 99054 / 95104 42740
        </a>
        <span style={{ color: 'var(--tb-card-border)', opacity: 0.6 }}>|</span>
        <a
          href="mailto:trekbest30@gmail.com"
          style={{ color: '#CCDCD4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          title="Email TrekBest Desk"
        >
          ✉ trekbest30@gmail.com
        </a>
      </div>

      <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="view-mode-toggle">
          {/* All Invoices Tab */}
          <button
            className={`mode-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
          >
            <List size={15} style={{ marginRight: 6 }} />
            <span>All Invoices</span>
            {invoiceCount > 0 && (
              <span style={{
                marginLeft: 6,
                background: currentView === 'list' ? '#fff' : 'var(--tb-orange)',
                color: currentView === 'list' ? 'var(--tb-forest)' : '#fff',
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 10
              }}>
                {invoiceCount}
              </span>
            )}
          </button>

          {/* Create / Edit Invoice Tab */}
          <button
            className={`mode-btn ${currentView === 'builder' ? 'active' : ''}`}
            onClick={() => onNewInvoiceClick ? onNewInvoiceClick() : onViewChange('builder')}
          >
            <FileText size={15} style={{ marginRight: 6 }} />
            <span>Create Invoice</span>
          </button>
        </div>

      </div>
    </header>
  );
}
