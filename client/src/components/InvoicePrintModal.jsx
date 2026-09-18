import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2, Mail, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function InvoicePrintModal({ invoice, onClose }) {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!invoice.id) {
      alert('Please save the invoice first before emailing.');
      return;
    }
    if (!invoice.clientEmail) {
      alert('This invoice does not have a client email specified.');
      return;
    }
    try {
      setSendingEmail(true);
      setEmailStatus(null);
      const res = await api.sendInvoiceEmail(invoice.id);
      setEmailStatus(res.message || `Sent to ${invoice.clientEmail}!`);
      setTimeout(() => setEmailStatus(null), 5000);
    } catch (err) {
      alert('Failed to send email: ' + err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: '#fff',
        color: '#1a1a1a',
        width: '100%',
        maxWidth: 820,
        maxHeight: '94vh',
        overflowY: 'auto',
        borderRadius: 16,
        padding: '36px 40px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Floating Print Bar */}
        <div className="no-print" style={{
          position: 'sticky',
          top: -20,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(6px)',
          padding: '10px 0 20px',
          borderBottom: '1px solid #eee',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: invoice.status === 'Paid' ? '#10B981' : '#F59E0B',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 6
            }}>
              {invoice.status || 'Paid'}
            </span>
            <span style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>
              Invoice #: {invoice.invoiceNo}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {invoice.clientEmail && (
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  background: '#f25c05',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: sendingEmail ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(242, 92, 5, 0.3)'
                }}
                title={`Send invoice voucher directly to ${invoice.clientEmail}`}
              >
                <Mail size={15} />
                <span>{sendingEmail ? 'Sending...' : 'Email Voucher'}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: '#0B1310',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Printer size={15} /> Print / Save as PDF
            </button>

            <button
              onClick={onClose}
              style={{
                background: '#f3f4f6',
                border: 'none',
                color: '#333',
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {emailStatus && (
          <div className="no-print" style={{
            padding: '10px 16px',
            background: '#ecfdf5',
            border: '1px solid #10B981',
            color: '#065F46',
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <CheckCircle2 size={17} color="#10B981" />
            <span>{emailStatus}</span>
          </div>
        )}

        {/* Printable Invoice Sheet */}
        <div id="printable-voucher">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0B1310', paddingBottom: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src="/trekbest-logo.png" alt="TrekBest Logo" style={{ height: 60, width: 'auto', borderRadius: 6 }} onError={(e) => { e.target.src = '/assets/trekbest-logo.png'; }} />
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5, color: '#0B1310' }}>
                  trek<span style={{ color: '#F25C05' }}>best</span>
                </h1>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4D7C33', letterSpacing: 2 }}>
                  TRAVEL & TOURS
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>
                  📞 +91 98249 99054 / +91 95104 42740 | ✉ trekbest30@gmail.com
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0B1310', textTransform: 'uppercase' }}>
                TRAVEL VOUCHER / INVOICE
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F25C05', marginTop: 4 }}>
                {invoice.invoiceNo}
              </div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                Date: {new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>

          {/* Client & Booking Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: '#f9fafb', padding: 20, borderRadius: 10, marginBottom: 24, fontSize: 13 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
                BILLED TO (CLIENT)
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{invoice.clientName}</div>
              {invoice.clientPhone && <div style={{ color: '#444', marginTop: 2 }}>Phone: {invoice.clientPhone}</div>}
              {invoice.clientEmail && <div style={{ color: '#444' }}>Email: {invoice.clientEmail}</div>}
              {invoice.clientAddress && <div style={{ color: '#666', marginTop: 2 }}>{invoice.clientAddress}</div>}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
                ITINERARY DETAILS
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{invoice.destination || 'Special Tour'}</div>
              <div style={{ color: '#444', marginTop: 2 }}>Travel Date: <strong>{invoice.travelDate || 'Flexible'}</strong></div>
              <div style={{ color: '#444' }}>Number of Guests: <strong>{invoice.pax || 2} Pax</strong></div>
              <div style={{ color: '#444' }}>Currency: <strong>{invoice.currency || 'INR'}</strong></div>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#0B1310', color: '#fff' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', borderRadius: '6px 0 0 0' }}>Service Description</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.map((item, idx) => {
                const rowTotal = (Number(item.qty) || 1) * (Number(item.rate) || 0);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                    <td style={{ padding: '12px', textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color: '#111' }}>{item.title}</div>
                      {item.sub && <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{item.sub}</div>}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>₹{Number(item.rate).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>₹{rowTotal.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals Calculation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <div style={{ width: 280, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#666' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600, color: '#111' }}>₹{Number(invoice.subtotal).toLocaleString('en-IN')}</span>
              </div>

              {Number(invoice.discount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#EF4444' }}>
                  <span>Special Discount:</span>
                  <span>- ₹{Number(invoice.discount).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#666' }}>
                <span>GST ({invoice.gstPercent || 5}%):</span>
                <span style={{ fontWeight: 600, color: '#111' }}>₹{Number(invoice.tax).toLocaleString('en-IN')}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderTop: '2px solid #0B1310',
                marginTop: 6,
                fontSize: 16,
                fontWeight: 800,
                color: '#0B1310'
              }}>
                <span>Total Amount:</span>
                <span style={{ color: '#F25C05' }}>₹{Number(invoice.total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {invoice.notes && (
            <div style={{ background: '#f8fafc', borderLeft: '4px solid #F25C05', padding: '10px 14px', borderRadius: 4, marginBottom: 24, fontSize: 12, color: '#444' }}>
              <strong>Voucher Remarks:</strong> {invoice.notes}
            </div>
          )}

          {/* Signatures & Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40, paddingTop: 20, borderTop: '1px solid #eee', fontSize: 11, color: '#888' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#222' }}>TrekBest Travel & Tours Desk</div>
              <div style={{ color: '#444', marginTop: 2 }}>trekbest30@gmail.com | +91 98249 99054 / +91 95104 42740</div>
              <div style={{ marginTop: 4, color: '#888' }}>This is a computer generated travel invoice.</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #333', width: 140, marginBottom: 6 }}></div>
              <div style={{ fontWeight: 700, color: '#111' }}>Authorized Signatory</div>
              <div>TrekBest Pvt. Ltd.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
