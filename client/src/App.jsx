import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InvoiceBuilder from './components/InvoiceBuilder';
import InvoiceListView from './components/InvoiceListView';
import InvoicePrintModal from './components/InvoicePrintModal';
import { api } from './services/api';

export default function App() {
  // 'list' | 'builder'
  const [currentView, setCurrentView] = useState('list');
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active invoice for editing
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Active invoice for print modal
  const [activePrintInvoice, setActivePrintInvoice] = useState(null);

  // Load Invoices & Financial Stats
  const loadInvoiceData = async () => {
    try {
      setLoading(true);
      const [iRes, sRes] = await Promise.all([
        api.getInvoices().catch(() => ({ invoices: [] })),
        api.getStats().catch(() => ({ stats: {} }))
      ]);
      setInvoices(iRes.invoices || []);
      setStats(sRes.stats || {});
    } catch (err) {
      console.error('Error loading invoices data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoiceData();
  }, []);

  // Action: Save New Invoice
  const handleSaveInvoice = async (invoiceData) => {
    const res = await api.createInvoice(invoiceData);
    await loadInvoiceData();
    return res;
  };

  // Action: Update Existing Invoice
  const handleUpdateInvoice = async (id, invoiceData) => {
    const res = await api.updateInvoice(id, invoiceData);
    await loadInvoiceData();
    setEditingInvoice(null);
    return res;
  };

  // Action: Update Status from List table
  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateInvoice(id, { status });
      setInvoices(prev => prev.map(inv => (inv.id === id ? { ...inv, status } : inv)));
      // Refresh stats
      const sRes = await api.getStats().catch(() => ({ stats: {} }));
      setStats(sRes.stats || {});
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  // Action: Delete Invoice
  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this invoice record from SQLite?')) {
      return;
    }
    try {
      await api.deleteInvoice(id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      const sRes = await api.getStats().catch(() => ({ stats: {} }));
      setStats(sRes.stats || {});
    } catch (err) {
      console.error('Error deleting invoice:', err);
      alert('Failed to delete invoice: ' + err.message);
    }
  };

  // Action: Start Editing
  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setCurrentView('builder');
  };

  // Action: Start Fresh New Invoice
  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setCurrentView('builder');
  };

  // Action: Cancel Edit
  const handleCancelEdit = () => {
    setEditingInvoice(null);
    setCurrentView('list');
  };

  return (
    <div className="trekbest-app">
      {/* Top Invoice Header */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'builder' && editingInvoice) {
            setEditingInvoice(null);
          }
          setCurrentView(view);
        }}
        invoiceCount={invoices.length}
        onNewInvoiceClick={handleNewInvoice}
      />

      {/* Main App Body */}
      <main style={{ minHeight: 'calc(100vh - 75px - 140px)' }}>
        {currentView === 'list' && (
          <InvoiceListView
            invoices={invoices}
            stats={stats}
            loading={loading}
            onOpenInvoice={(inv) => setActivePrintInvoice(inv)}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onUpdateStatus={handleUpdateStatus}
            onCreateNew={handleNewInvoice}
          />
        )}

        {currentView === 'builder' && (
          <InvoiceBuilder
            editingInvoice={editingInvoice}
            onSaveInvoice={handleSaveInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onOpenPrintPreview={(inv) => setActivePrintInvoice(inv)}
            onCancelEdit={handleCancelEdit}
          />
        )}
      </main>

      {/* Printable Voucher Modal */}
      {activePrintInvoice && (
        <InvoicePrintModal
          invoice={activePrintInvoice}
          onClose={() => setActivePrintInvoice(null)}
        />
      )}

      {/* Footer */}
      <footer style={{
        background: 'var(--tb-dark-card)',
        borderTop: '1px solid var(--tb-card-border)',
        padding: '36px 24px',
        textAlign: 'center',
        marginTop: 60
      }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/trekbest-logo.png"
              alt="TrekBest"
              style={{ height: 36 }}
              onError={(e) => { e.target.src = '/assets/trekbest-logo.png'; }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>trek<span style={{ color: 'var(--tb-orange)' }}>best</span></div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>TRAVEL & TOURS • INVOICE SYSTEM</div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span>📞 +91 98249 99054 / +91 95104 42740</span>
            <span>✉️ trekbest30@gmail.com</span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} TrekBest Travel & Tours. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
