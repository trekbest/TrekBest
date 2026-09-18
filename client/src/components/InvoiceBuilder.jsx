import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Printer,
  Save,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Plane,
  Hotel,
  Car,
  Ticket,
  Ship,
  FileCheck,
  ArrowLeft
} from 'lucide-react';

const SERVICE_PRESETS = [
  {
    icon: Hotel,
    category: 'HOTEL',
    title: '4★ / 5★ Luxury Resort Stay (MAP Plan)',
    sub: 'Includes Welcome Drink, Daily Buffet Breakfast & Dinner',
    rate: 14500
  },
  {
    icon: Car,
    category: 'TRANSFER',
    title: 'Private AC Innova Crysta Cab Sightseeing',
    sub: 'Includes fuel, driver allowance, tolls, parking, and airport transfers',
    rate: 12000
  },
  {
    icon: Plane,
    category: 'FLIGHT',
    title: 'Roundtrip Domestic Flight Tickets',
    sub: 'Includes 15kg check-in + 7kg cabin baggage with seat selection',
    rate: 16800
  },
  {
    icon: Ship,
    category: 'PACKAGE',
    title: 'Dal Lake Premium Heritage Houseboat Stay',
    sub: 'Includes 1 Hr Shikara Ride & Candlelight Dinner for 2 Guests',
    rate: 8500
  },
  {
    icon: Ticket,
    category: 'ACTIVITY',
    title: 'Cable Car / Gondola Phase 1 & 2 Passes',
    sub: 'Direct VIP access barcode passes with guide assistance',
    rate: 3700
  },
  {
    icon: FileCheck,
    category: 'VISA',
    title: 'Travel Insurance & Tourist Permits / Passes',
    sub: 'Emergency medical coverage, flight cancellation protection & local permits',
    rate: 2200
  }
];

const INITIAL_FORM_STATE = {
  clientName: 'Rahul & Priya Sharma',
  clientEmail: 'rahul.sharma@example.com',
  clientPhone: '+91 98112 34567',
  clientAddress: 'Andheri West, Mumbai, Maharashtra 400053',
  destination: 'Enchanting Kashmir Paradise Tour',
  travelDate: '15 Oct 2026',
  pax: 2,
  discount: 1000,
  gstPercent: 5,
  status: 'Paid',
  notes: 'Includes all luxury houseboat stays, private Shikara rides, Gondola Phase 1 & 2 tickets, airport transfers, and MAP meal plan.'
};

const INITIAL_ITEMS_STATE = [
  {
    id: 1,
    category: 'PACKAGE',
    title: '6 Days / 5 Nights Kashmir Deluxe Tour Package',
    sub: 'Luxury Houseboat, Gulmarg Resort, Pahalgam Pine Hotel (MAP Plan)',
    qty: 2,
    rate: 24999
  },
  {
    id: 2,
    category: 'TRANSFER',
    title: 'Private AC Innova Crysta for 6 Days Complete Sightseeing',
    sub: 'Tolls, parking, driver allowance, and airport transfers included',
    qty: 1,
    rate: 14500
  },
  {
    id: 3,
    category: 'ACTIVITY',
    title: 'Gulmarg Gondola Phase 1 & 2 Cable Car Passes',
    sub: 'Instant VIP skip-the-line barcode passes for 2 adults',
    qty: 2,
    rate: 1850
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
        setItems(editingInvoice.items.map((it, idx) => ({
          id: it.id || idx + 1,
          category: it.category || 'PACKAGE',
          title: it.title || '',
          sub: it.sub || '',
          qty: it.qty || 1,
          rate: it.rate || 0
        })));
      }
    } else {
      setFormData(INITIAL_FORM_STATE);
      setItems(INITIAL_ITEMS_STATE);
    }
  }, [editingInvoice]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        category: 'HOTEL',
        title: 'Custom Travel Service / Excursion',
        sub: 'Includes transfers & taxes',
        qty: 1,
        rate: 5000
      }
    ]);
  };

  const addPresetItem = (preset) => {
    setItems([
      ...items,
      {
        id: Date.now() + Math.random(),
        category: preset.category,
        title: preset.title,
        sub: preset.sub,
        qty: 1,
        rate: preset.rate
      }
    ]);
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
      setFormData({
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
        notes: 'Thank you for choosing TrekBest. Have a wonderful trip!'
      });
      setItems([
        {
          id: Date.now(),
          category: 'PACKAGE',
          title: 'Custom Travel Package',
          sub: 'Detailed itinerary and inclusions',
          qty: 1,
          rate: 15000
        }
      ]);
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
        category: it.category,
        title: it.title,
        sub: it.sub,
        qty: Number(it.qty),
        rate: Number(it.rate)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Sparkles size={16} color="var(--tb-orange)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
            QUICK ADD TRAVEL SERVICES (1-CLICK PRESETS):
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SERVICE_PRESETS.map((preset, idx) => {
            const IconComp = preset.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => addPresetItem(preset)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 12px',
                  background: 'var(--tb-dark)',
                  border: '1px solid var(--tb-card-border)',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--tb-orange)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--tb-card-border)'}
              >
                <IconComp size={14} color="var(--tb-orange)" />
                <span>{preset.title.split('(')[0].trim()}</span>
                <span style={{ color: 'var(--tb-green)', fontWeight: 600 }}>+₹{preset.rate.toLocaleString('en-IN')}</span>
              </button>
            );
          })}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--tb-dark)',
                    padding: 14,
                    borderRadius: 10,
                    border: '1px solid var(--tb-card-border)',
                    display: 'grid',
                    gridTemplateColumns: '120px 2fr 70px 110px 40px',
                    gap: 10,
                    alignItems: 'center'
                  }}
                >
                  {/* Category */}
                  <div>
                    <select
                      value={item.category}
                      onChange={e => updateItem(item.id, 'category', e.target.value)}
                      style={{ width: '100%', padding: '7px 8px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: 'var(--tb-orange)', borderRadius: 6, fontSize: 11, fontWeight: 700 }}
                    >
                      <option value="PACKAGE">PACKAGE</option>
                      <option value="HOTEL">HOTEL</option>
                      <option value="FLIGHT">FLIGHT</option>
                      <option value="TRANSFER">TRANSFER</option>
                      <option value="ACTIVITY">ACTIVITY</option>
                      <option value="VISA">VISA</option>
                    </select>
                  </div>

                  {/* Title & Sub */}
                  <div>
                    <input
                      type="text"
                      placeholder="Service title"
                      value={item.title}
                      onChange={e => updateItem(item.id, 'title', e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 6, fontSize: 13, marginBottom: 4 }}
                    />
                    <input
                      type="text"
                      placeholder="Details / Inclusions"
                      value={item.sub}
                      onChange={e => updateItem(item.id, 'sub', e.target.value)}
                      style={{ width: '100%', padding: '4px 10px', background: 'transparent', border: '1px solid #22382f', color: 'var(--text-muted)', borderRadius: 6, fontSize: 11 }}
                    />
                  </div>

                  {/* Qty */}
                  <div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={e => updateItem(item.id, 'qty', e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 6, fontSize: 13, textAlign: 'center' }}
                    />
                  </div>

                  {/* Rate */}
                  <div>
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={e => updateItem(item.id, 'rate', e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', background: 'var(--tb-input-bg)', border: '1px solid var(--tb-input-border)', color: '#fff', borderRadius: 6, fontSize: 13, textAlign: 'right' }}
                    />
                  </div>

                  {/* Delete */}
                  <div>
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
              ))}
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
