import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InvoiceBuilder from './components/InvoiceBuilder';
import InvoiceListView from './components/InvoiceListView';
import InvoicePrintModal from './components/InvoicePrintModal';
import ConfirmModal from './components/ConfirmModal';
import SuccessModal from './components/SuccessModal';
import { useToast } from './context/ToastContext';
import { api } from './services/api';

export default function App() {
  const toast = useToast();

  // 'list' | 'builder'
  const [currentView, setCurrentView] = useState('list');
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active invoice for editing
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Active invoice for print modal
  const [activePrintInvoice, setActivePrintInvoice] = useState(null);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success Celebration Modal State
  const [successInvoice, setSuccessInvoice] = useState(null);

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
    if (res?.invoice) {
      setSuccessInvoice(res.invoice);
    }
    toast.success(`Invoice ${res?.invoice?.invoiceNo || ''} created successfully!`);
    return res;
  };

  // Action: Update Existing Invoice
  const handleUpdateInvoice = async (id, invoiceData) => {
    const res = await api.updateInvoice(id, invoiceData);
    await loadInvoiceData();
    setEditingInvoice(null);
    if (res?.invoice) {
      setSuccessInvoice(res.invoice);
    }
    toast.success(`Invoice ${res?.invoice?.invoiceNo || id} updated successfully!`);
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
      toast.success(`Invoice status updated to ${status}.`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status: ' + err.message);
    }
  };

  // Action: Request Delete Invoice (Opens ConfirmModal)
  const handleDeleteInvoice = (invOrId) => {
    const target = typeof invOrId === 'object' && invOrId !== null
      ? invOrId
      : invoices.find(i => i.id === invOrId) || { id: invOrId };
    setDeleteTarget(target);
  };

  // Action: Confirm Delete Invoice
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteInvoice(deleteTarget.id);
      setInvoices(prev => prev.filter(inv => inv.id !== deleteTarget.id));
      const sRes = await api.getStats().catch(() => ({ stats: {} }));
      setStats(sRes.stats || {});
      toast.success(`Invoice ${deleteTarget.invoiceNo || ''} deleted permanently.`);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting invoice:', err);
      toast.error('Failed to delete invoice: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Key to force fresh clean form when creating new invoice
  const [builderKey, setBuilderKey] = useState(0);

  // Action: Start Editing
  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setCurrentView('builder');
  };

  // Action: Start Fresh New Invoice
  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setBuilderKey(prev => prev + 1);
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
          if (view === 'builder') {
            if (editingInvoice) setEditingInvoice(null);
            setBuilderKey(prev => prev + 1);
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
            key={editingInvoice ? `edit-${editingInvoice.id}` : `new-${builderKey}`}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Travel Invoice Record"
        subtitle={deleteTarget ? `${deleteTarget.invoiceNo || 'Draft'} • ${deleteTarget.clientName || 'Client'} • ₹${Number(deleteTarget.total || 0).toLocaleString('en-IN')}` : ''}
        message="Are you sure you want to permanently delete this invoice record from your cloud database? All billing calculations and items will be deleted permanently."
        confirmText="Yes, Delete Permanently"
        cancelText="Keep Invoice"
        variant="danger"
        loading={isDeleting}
      />

      {/* Invoice Saved Celebration Success Modal */}
      <SuccessModal
        isOpen={Boolean(successInvoice)}
        onClose={() => setSuccessInvoice(null)}
        invoice={successInvoice}
        onPrintPreview={(inv) => {
          setActivePrintInvoice(inv);
        }}
        onCreateAnother={() => {
          handleNewInvoice();
        }}
        onViewList={() => {
          setCurrentView('list');
        }}
      />

      {/* Footer */}
      <footer className="tb-footer">
        <div className="tb-footer-content" style={{
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

          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:+919824999054" style={{ color: 'inherit', textDecoration: 'none' }}>📞 +91 98249 99054 / +91 95104 42740</a>
            <a href="mailto:trekbest30@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>✉️ trekbest30@gmail.com</a>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} TrekBest Travel & Tours. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
