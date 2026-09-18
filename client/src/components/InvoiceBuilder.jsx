import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Printer,
  Save,
  CheckCircle,
  Check,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  X,
  PlusCircle
} from 'lucide-react';

const INITIAL_FORM_STATE = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientAddress: '',
  destination: '',
  travelDate: '',
  pax: 1,
  discount: 0,
  gstPercent: 5,
  status: 'Paid',
  notes: ''
};

const INITIAL_ITEMS_STATE = [
  {
    id: 1,
    title: '',
    sub: '',
    qty: 1,
    rate: ''
  }
];

export default function InvoiceBuilder({
  editingInvoice,
  onSaveInvoice,
  onUpdateInvoice,
  onOpenPrintPreview,
  onCancelEdit
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [items, setItems] = useState(INITIAL_ITEMS_STATE);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Custom Quick Add Inclusions State (persisted to localStorage)
  const [presets, setPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('tb_custom_inclusions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved inclusions:', e);
    }
    return [];
  });

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    title: '',
    sub: ''
  });

  const [activeItemId, setActiveItemId] = useState(() => (INITIAL_ITEMS_STATE[0]?.id || 1));

  // Keep activeItemId valid if items change
  useEffect(() => {
    if (items.length > 0 && (!activeItemId || !items.some(it => it.id === activeItemId))) {
      setActiveItemId(items[0].id);
    }
  }, [items, activeItemId]);

  const savePresets = (newPresets) => {
    setPresets(newPresets);
    try {
      localStorage.setItem('tb_custom_inclusions', JSON.stringify(newPresets));
    } catch (e) {
      console.error('Failed to save inclusions:', e);
    }
  };

  const handleToggleInclusion = (preset, forceAdd = false) => {
    // Target the currently active item, or fallback to the first item
    const targetItem = items.find(it => it.id === activeItemId) || items[0];
    if (!targetItem) return;

    const inclusionText = preset.sub ? `${preset.title} (${preset.sub})` : preset.title;
    const currentSub = (targetItem.sub || '').trim();
    const titleLower = preset.title.trim().toLowerCase();

    // Check if preset is already present in this item's Details/Inclusions sub field
    const isAlreadyPresent = currentSub.toLowerCase().includes(titleLower);

    let newSub = '';
    if (isAlreadyPresent && !forceAdd) {
      // Toggle off / remove from the Details/Inclusions field
      const parts = currentSub.split(',').map(p => p.trim()).filter(Boolean);
      const filtered = parts.filter(p => !p.toLowerCase().includes(titleLower));
      newSub = filtered.join(', ');
    } else if (!isAlreadyPresent) {
      // Toggle on / append to the Details/Inclusions field
      if (!currentSub) {
        newSub = inclusionText;
      } else {
        const cleaned = currentSub.replace(/,\s*$/, '');
        newSub = `${cleaned}, ${inclusionText}`;
      }
    } else {
      newSub = currentSub;
    }

    updateItem(targetItem.id, 'sub', newSub);
  };

  const handleAddCustomPreset = (e) => {
    e.preventDefault();
    if (!customForm.title.trim()) return;

    const newPreset = {
      id: 'incl-' + Date.now(),
      title: customForm.title.trim(),
      sub: customForm.sub.trim(),
      isCustom: true
    };

    const updated = [...presets, newPreset];
    savePresets(updated);

    // Also immediately add it to the active item's Details / Inclusions field!
    handleToggleInclusion(newPreset, true);

    // Reset and close
    setCustomForm({ title: '', sub: '' });
    setShowCustomModal(false);
  };

  const handleDeletePreset = (id, e) => {
    e.stopPropagation();
    const updated = presets.filter(p => p.id !== id);
    savePresets(updated);
  };

  // If editing an existing invoice
  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        clientName: editingInvoice.clientName || '',
        clientEmail: editingInvoice.clientEmail || '',
        clientPhone: editingInvoice.clientPhone || '',
        clientAddress: editingInvoice.clientAddress || '',
        destination: editingInvoice.destination || '',
        travelDate: editingInvoice.travelDate || '',
        pax: editingInvoice.pax || 1,
        discount: editingInvoice.discount || 0,
        gstPercent: editingInvoice.gstPercent !== undefined ? editingInvoice.gstPercent : 5,
        status: editingInvoice.status || 'Paid',
        notes: editingInvoice.notes || ''
      });

      if (editingInvoice.items && editingInvoice.items.length > 0) {
        const mappedItems = editingInvoice.items.map((it, idx) => ({
          id: it.id || idx + 1,
          title: it.title || '',
          sub: it.sub || '',
          qty: it.qty || 1,
          rate: it.rate || 0
        }));
        setItems(mappedItems);
        setActiveItemId(mappedItems[0].id);
      }
    } else {
      setFormData(INITIAL_FORM_STATE);
      setItems(INITIAL_ITEMS_STATE);
      if (INITIAL_ITEMS_STATE[0]) {
        setActiveItemId(INITIAL_ITEMS_STATE[0].id);
      }
    }
  }, [editingInvoice]);

  const addItem = () => {
    const newId = Date.now();
    setItems([
      ...items,
      {
        id: newId,
        title: '',
        sub: '',
        qty: 1,
        rate: ''
      }
    ]);
    setActiveItemId(newId);
  };

  const addPresetItem = (preset) => {
    handleToggleInclusion(preset);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const resetForm = () => {
    if (confirm('Clear form and reset to a fresh blank invoice?')) {
      const newId = Date.now();
      setFormData(INITIAL_FORM_STATE);
      setItems([
        {
          id: newId,
          title: '',
          sub: '',
          qty: 1,
          rate: ''
        }
      ]);
      setActiveItemId(newId);
    }
  };

  // Calculations
  const rawSubtotal = items.reduce((sum, item) => sum + ((Number(item.qty) || 0) * (Number(item.rate) || 0)), 0);
  const discountAmount = Number(formData.discount) || 0;
  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);
  const gstRate = Number(formData.gstPercent) || 0;
  const taxAmount = Math.round((taxableAmount * gstRate) / 100);
  const grandTotal = taxableAmount + taxAmount;

  const handleSave = async () => {
    if (!formData.clientName.trim()) {
      alert('Please enter client name');
      return;
    }
    if (!items.length || items.every(i => !i.title.trim())) {
      alert('Please add at least one line item with a title');
      return;
    }

    setSaving(true);
    setSaveSuccess(null);

    const invoicePayload = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      destination: formData.destination,
      travelDate: formData.travelDate,
      pax: Number(formData.pax),
      items: items.map(it => ({
        title: it.title,
        sub: it.sub,
        qty: Number(it.qty) || 1,
        rate: Number(it.rate) || 0
      })),
      discount: discountAmount,
      gstPercent: gstRate,
      subtotal: rawSubtotal,
      tax: taxAmount,
      total: grandTotal,
      currency: 'INR',
      status: formData.status,
      notes: formData.notes
    };

    try {
      if (editingInvoice) {
        await onUpdateInvoice(editingInvoice.id, invoicePayload);
        setSaveSuccess(`Updated invoice ${editingInvoice.invoiceNo}`);
      } else {
        const res = await onSaveInvoice(invoicePayload);
        const invNo = res?.invoice?.invoiceNo || '';
        const emailNotice = invoicePayload.clientEmail
          ? ` ✉️ Voucher automatically emailed to ${invoicePayload.clientEmail}!`
          : '';
        setSaveSuccess(`Created invoice ${invNo}!${emailNotice}`);
      }
      setTimeout(() => setSaveSuccess(null), 8000);
    } catch (err) {
      alert('Error saving invoice: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const previewData = {
      invoiceNo: editingInvoice ? editingInvoice.invoiceNo : `TB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: editingInvoice ? editingInvoice.createdAt : new Date().toISOString(),
      ...formData,
      items,
      subtotal: rawSubtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal
    };
    onOpenPrintPreview(previewData);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {editingInvoice && (
              <button
                onClick={onCancelEdit}
                style={{
                  background: 'var(--tb-dark-card)',
                  border: '1px solid var(--tb-card-border)',
                  color: 'var(--text-muted)',
                  borderRadius: 8,
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0, color: '#fff' }}>
              {editingInvoice ? 'Edit' : 'Create'} <span style={{ color: 'var(--tb-orange)' }}>Travel Invoice & Voucher</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6, marginBottom: 0 }}>
            {editingInvoice
              ? `Editing invoice ${editingInvoice.invoiceNo} stored in SQLite database.`
              : 'Generate itemized travel quotes, calculate GST, and record directly to SQLite database.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={resetForm}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 14px',
              background: 'var(--tb-dark-card)',
              border: '1px solid var(--tb-card-border)',
              color: 'var(--text-muted)',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer'
            }}
            title="Clear Form"
          >
            <RotateCcw size={15} /> Reset
          </button>

          <button
            type="button"
            onClick={handlePreview}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              background: 'var(--tb-dark-card)',
              border: '1px solid var(--tb-card-border)',
              color: '#fff',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Printer size={16} /> Print / PDF Preview
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              background: 'var(--tb-orange)',
              border: 'none',
              color: '#fff',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(242, 92, 5, 0.35)'
            }}
          >
            <Save size={16} /> {saving ? 'Saving & Sending Email...' : editingInvoice ? 'Update in SQLite' : 'Save & Send to Client'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div style={{
          padding: '14px 18px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--tb-green)',
          color: 'var(--tb-green)',
          borderRadius: 10,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 14
        }}>
          <CheckCircle size={20} />
          <span>
            {saveSuccess} successfully!
          </span>
        </div>
      )}

      {/* Quick Service Presets Banner */}
      <div style={{
        background: 'var(--tb-dark-card)',
        padding: '16px 20px',
        borderRadius: 14,
        border: '1px solid var(--tb-card-border)',
        marginBottom: 24
      }}>
        {/* Banner Header with Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Sparkles size={16} color="var(--tb-orange)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
              PACKAGE INCLUSIONS (QUICK ADD):
            </span>
            <span style={{
              fontSize: 11,
              background: 'rgba(242, 92, 5, 0.15)',
              color: 'var(--tb-orange)',
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 700
            }}>
              {presets.length} Saved Inclusions
            </span>
            {items.length > 1 && (
              <span style={{
                fontSize: 11,
                color: 'var(--tb-orange)',
                background: 'rgba(242, 92, 5, 0.08)',
                padding: '2px 9px',
                borderRadius: 10,
                border: '1px solid rgba(242, 92, 5, 0.25)',
                fontWeight: 600
              }}>
                Target: Item #{items.findIndex(it => it.id === activeItemId) + 1 || 1}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setShowCustomModal(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                background: showCustomModal ? 'var(--tb-orange)' : 'rgba(242, 92, 5, 0.12)',
                border: '1px solid var(--tb-orange)',
                color: showCustomModal ? '#fff' : 'var(--tb-orange)',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <PlusCircle size={14} />
              <span>{showCustomModal ? 'Close Form' : '+ Add Inclusion'}</span>
            </button>
          </div>
        </div>

        {/* Custom Inclusion Creator Drawer */}
        {showCustomModal && (
          <form
            onSubmit={handleAddCustomPreset}
            style={{
              background: 'var(--tb-dark-elevated)',
              border: '1px solid rgba(242, 92, 5, 0.4)',
              borderRadius: 12,
              padding: '16px 18px',
              marginBottom: 16,
              boxShadow: '0 6px 20px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={15} color="var(--tb-orange)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  Create Package Inclusion
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  (Saves to quick-add & applies to "Details / Inclusions" field)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr auto', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Inclusion Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4★ Luxury Hotel Stay, Breakfast, Sightseeing Cab"
                  value={customForm.title}
                  onChange={e => setCustomForm({ ...customForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Details / Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Daily buffet breakfast & dinner, private AC vehicle"
                  value={customForm.sub}
                  onChange={e => setCustomForm({ ...customForm, sub: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 12 }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    background: 'var(--tb-orange)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(242, 92, 5, 0.3)'
                  }}
                >
                  + Save & Add to Field
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Inclusions Chips Grid */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {presets.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic', padding: '4px 0' }}>
              No custom inclusions saved yet. Click <strong>"+ Add Inclusion"</strong> above to add services/amenities included in your packages.
            </div>
          ) : (
            presets.map((preset) => {
              const targetItem = items.find(it => it.id === activeItemId) || items[0];
              const isSelected = targetItem && targetItem.sub
                ? targetItem.sub.toLowerCase().includes(preset.title.trim().toLowerCase())
                : false;

              return (
                <div
                  key={preset.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: isSelected ? 'rgba(242, 92, 5, 0.16)' : 'var(--tb-dark)',
                    border: isSelected ? '1.5px solid var(--tb-orange)' : '1px solid rgba(242, 92, 5, 0.35)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: isSelected ? '0 0 10px rgba(242, 92, 5, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleInclusion(preset)}
                    title={
                      isSelected
                        ? `Selected in "${targetItem?.title || 'Package'}". Click to remove.`
                        : `Click to add "${preset.title}" into Details / Inclusions field`
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '7px 12px',
                      background: 'transparent',
                      border: 'none',
                      color: isSelected ? '#fff' : '#e2e8f0',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) e.currentTarget.parentElement.style.borderColor = 'var(--tb-orange)';
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) e.currentTarget.parentElement.style.borderColor = 'rgba(242, 92, 5, 0.35)';
                    }}
                  >
                    {isSelected ? (
                      <Check size={13} color="var(--tb-orange)" strokeWidth={2.8} />
                    ) : (
                      <Sparkles size={13} color="var(--tb-orange)" />
                    )}
                    <span style={{ fontWeight: isSelected ? 700 : 600 }}>{preset.title}</span>
                    {preset.sub && (
                      <span style={{
                        fontSize: 11,
                        color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        ({preset.sub})
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeletePreset(preset.id, e)}
                    title="Delete this inclusion preset"
                    style={{
                      padding: '7px 8px',
                      background: 'transparent',
                      border: 'none',
                      borderLeft: '1px solid var(--tb-card-border)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--tb-red)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Left Column: Client Details & Line Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Client Details Section */}
          <div style={{ background: 'var(--tb-dark-card)', padding: 24, borderRadius: 16, border: '1px solid var(--tb-card-border)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--tb-orange)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Client & Itinerary Overview
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Client Full Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Destination / Tour Title</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Kashmir Paradise Tour"
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Client Phone</label>
                <input
                  type="text"
                  value={formData.clientPhone}
                  onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Client Email <span style={{ color: 'var(--tb-green)', fontSize: 11, fontWeight: 600 }}>• Auto-sends voucher ✉️</span>
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Travel Date</label>
                <input
                  type="text"
                  value={formData.travelDate}
                  onChange={e => setFormData({ ...formData, travelDate: e.target.value })}
                  placeholder="e.g. 15 Oct 2026"
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Number of Guests (Pax)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.pax}
                  onChange={e => setFormData({ ...formData, pax: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Client Billing Address</label>
                <input
                  type="text"
                  value={formData.clientAddress}
                  onChange={e => setFormData({ ...formData, clientAddress: e.target.value })}
                  placeholder="Street, City, State, PIN"
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div style={{ background: 'var(--tb-dark-card)', padding: 24, borderRadius: 16, border: '1px solid var(--tb-card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--tb-orange)', textTransform: 'uppercase', letterSpacing: 1 }}>
                Itemized Travel Services ({items.length})
              </h4>
              <button
                type="button"
                onClick={addItem}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  background: 'var(--tb-forest-light)',
                  border: '1px solid var(--tb-card-border)',
                  color: 'var(--text-main)',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} /> + Add Custom Row
              </button>
            </div>

            {/* Column Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 75px 120px 40px',
              gap: 12,
              padding: '0 14px 6px',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              <span>Service Description & Inclusions</span>
              <span style={{ textAlign: 'center' }}>Qty</span>
              <span style={{ textAlign: 'right' }}>Rate (₹)</span>
              <span></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item) => {
                const isActive = item.id === activeItemId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItemId(item.id)}
                    style={{
                      background: 'var(--tb-dark)',
                      padding: 14,
                      borderRadius: 10,
                      border: isActive ? '1px solid rgba(242, 92, 5, 0.45)' : '1px solid var(--tb-card-border)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 75px 120px 40px',
                      gap: 12,
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 2px 10px rgba(242, 92, 5, 0.08)' : 'none'
                    }}
                  >
                    {/* Title & Sub */}
                    <div>
                      <input
                        type="text"
                        placeholder="Service / Package title"
                        value={item.title}
                        onFocus={() => setActiveItemId(item.id)}
                        onChange={e => updateItem(item.id, 'title', e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 6, fontSize: 13, marginBottom: 4 }}
                      />
                      <input
                        type="text"
                        value={item.sub}
                        onFocus={() => setActiveItemId(item.id)}
                        onChange={e => updateItem(item.id, 'sub', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          background: isActive ? 'rgba(242, 92, 5, 0.05)' : 'transparent',
                          border: isActive ? '1px solid rgba(242, 92, 5, 0.5)' : '1px solid #22382f',
                          color: '#e2e8f0',
                          borderRadius: 6,
                          fontSize: 11,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>

                    {/* Qty */}
                    <div>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.qty}
                        onFocus={() => setActiveItemId(item.id)}
                        onChange={e => updateItem(item.id, 'qty', e.target.value)}
                        style={{ width: '100%', padding: '7px 8px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 6, fontSize: 13, textAlign: 'center' }}
                      />
                    </div>

                    {/* Rate */}
                    <div>
                      <input
                        type="number"
                        placeholder="Rate (₹)"
                        value={item.rate}
                        onFocus={() => setActiveItemId(item.id)}
                        onChange={e => updateItem(item.id, 'rate', e.target.value)}
                        style={{ width: '100%', padding: '7px 8px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 6, fontSize: 13, textAlign: 'right' }}
                      />
                    </div>

                  {/* Delete */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: items.length === 1 ? '#444' : 'var(--tb-red)',
                        cursor: items.length === 1 ? 'not-allowed' : 'pointer',
                        padding: 4
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary & Taxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'var(--tb-dark-card)', padding: 24, borderRadius: 16, border: '1px solid var(--tb-card-border)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--tb-orange)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Pricing & GST Breakdown
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Discount (INR)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>GST Rate (%)</label>
                <select
                  value={formData.gstPercent}
                  onChange={e => setFormData({ ...formData, gstPercent: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                >
                  <option value="0">0% (Zero Tax / International)</option>
                  <option value="5">5% (Tour Operator Standard)</option>
                  <option value="12">12% (Hotel & Services)</option>
                  <option value="18">18% (Luxury / Corporate)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>GST Amount ({gstRate}%):</span>
                <span>₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--tb-card-border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Grand Total:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--tb-orange)' }}>
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Payment Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 13 }}
                >
                  <option value="Paid">Paid / Confirmed</option>
                  <option value="Pending">Pending / Proforma</option>
                  <option value="Draft">Draft Quote</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Voucher Notes & Terms</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 8, fontSize: 12 }}
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--tb-orange)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  marginTop: 8
                }}
              >
                {saving ? 'Saving...' : editingInvoice ? 'Update Invoice in SQLite' : 'Save & Record Invoice'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
