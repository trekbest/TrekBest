import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Trash2,
  Edit3,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

function formatTravelDate(dateStr) {
  if (!dateStr || dateStr === 'Flexible') return dateStr || 'Flexible';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-');
    const dObj = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(dObj.getTime())) {
      return dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  return dateStr;
}

export default function InvoiceListView({
  invoices = [],
  stats,
  loading = false,
  onOpenInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onUpdateStatus,
  onCreateNew
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Filter & Search
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        (inv.invoiceNo && inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (inv.clientName && inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (inv.clientPhone && inv.clientPhone.includes(searchTerm)) ||
        (inv.destination && inv.destination.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'highest') return (b.total || 0) - (a.total || 0);
      if (sortBy === 'lowest') return (a.total || 0) - (b.total || 0);
      return 0;
    });
  }, [invoices, searchTerm, statusFilter, sortBy]);

  // Compute live totals
  const totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
  const paidRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
  const pendingRevenue = invoices
    .filter(inv => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>
      {/* Header & New Invoice Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 28
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            margin: 0,
            color: '#fff'
          }}>
            Travel Invoice <span style={{ color: 'var(--tb-orange)' }}>Management</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6, marginBottom: 0 }}>
            Track, edit, print travel vouchers, and manage billing records stored in SQLite database.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 22px',
            background: 'var(--tb-orange)',
            border: 'none',
            color: '#fff',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(242, 92, 5, 0.35)',
            transition: 'transform 0.15s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={18} /> + Create New Invoice
        </button>
      </div>

      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 18,
        marginBottom: 32
      }}>
        {/* Total Invoiced */}
        <div style={{
          background: 'var(--tb-dark-card)',
          padding: 22,
          borderRadius: 14,
          border: '1px solid var(--tb-card-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            background: 'rgba(242, 92, 5, 0.15)',
            padding: 14,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={26} color="var(--tb-orange)" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Total Invoiced
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: 2 }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              Across {invoices.length} invoices
            </div>
          </div>
        </div>

        {/* Paid / Collected */}
        <div style={{
          background: 'var(--tb-dark-card)',
          padding: 22,
          borderRadius: 14,
          border: '1px solid var(--tb-card-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            padding: 14,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={26} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Paid & Collected
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: 2 }}>
              ₹{paidRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {invoices.filter(i => i.status === 'Paid').length} paid invoices
            </div>
          </div>
        </div>

        {/* Pending Due */}
        <div style={{
          background: 'var(--tb-dark-card)',
          padding: 22,
          borderRadius: 14,
          border: '1px solid var(--tb-card-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            padding: 14,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={26} color="#F59E0B" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Pending Balance
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B', marginTop: 2 }}>
              ₹{pendingRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {invoices.filter(i => i.status !== 'Paid').length} awaiting payment
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        background: 'var(--tb-dark-card)',
        borderRadius: 14,
        border: '1px solid var(--tb-card-border)',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--tb-dark)',
          border: '1px solid var(--tb-card-border)',
          borderRadius: 8,
          padding: '8px 14px',
          flex: '1 1 280px',
          maxWidth: 400
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by invoice #, client name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 13,
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Status filter buttons */}
          <div style={{ display: 'flex', gap: 6, background: 'var(--tb-dark)', padding: 4, borderRadius: 8, border: '1px solid var(--tb-card-border)' }}>
            {['ALL', 'Paid', 'Pending', 'Draft'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: statusFilter === status ? 'var(--tb-orange)' : 'transparent',
                  color: statusFilter === status ? '#fff' : 'var(--text-muted)',
                  transition: 'background 0.15s ease'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'var(--tb-dark)',
                color: '#fff',
                border: '1px solid var(--tb-card-border)',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Amount: High to Low</option>
              <option value="lowest">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice List Table */}
      <div style={{
        background: 'var(--tb-dark-card)',
        borderRadius: 16,
        border: '1px solid var(--tb-card-border)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading invoices from database...
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <FileText size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 8 }}>No invoices found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try adjusting your search or status filter.'
                : 'Create your first travel invoice with the Invoice Builder.'}
            </p>
            <button
              onClick={onCreateNew}
              style={{
                padding: '10px 20px',
                background: 'var(--tb-orange)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              + Create First Invoice
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--tb-dark)', color: 'var(--text-muted)', borderBottom: '1px solid var(--tb-card-border)' }}>
                  <th style={{ padding: '14px 18px', textAlign: 'left' }}>Invoice #</th>
                  <th style={{ padding: '14px 18px', textAlign: 'left' }}>Client Info</th>
                  <th style={{ padding: '14px 18px', textAlign: 'left' }}>Destination / Tour</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Travel Date & Pax</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total Amount</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Payment Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    style={{
                      borderBottom: '1px solid var(--tb-card-border)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Invoice # */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--tb-orange)', fontSize: 14 }}>
                        {inv.invoiceNo}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                      </div>
                    </td>

                    {/* Client Info */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>
                        {inv.clientName}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {inv.clientPhone || 'No phone'}
                      </div>
                      {inv.clientEmail && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {inv.clientEmail}
                        </div>
                      )}
                    </td>

                    {/* Destination */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#e5e7eb' }}>
                        {inv.destination || 'Custom Tour'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {inv.items ? `${inv.items.length} itemized services` : ''}
                      </div>
                    </td>

                    {/* Travel Date & Pax */}
                    <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                      <div style={{ color: '#fff' }}>{formatTravelDate(inv.travelDate)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {inv.pax ? `${inv.pax} Traveler${inv.pax > 1 ? 's' : ''}` : '1 Traveler'}
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>
                        ₹{Number(inv.total || 0).toLocaleString('en-IN')}
                      </div>
                      {inv.tax > 0 && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Incl. ₹{Number(inv.tax).toLocaleString('en-IN')} GST
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                      <select
                        value={inv.status || 'Paid'}
                        onChange={(e) => onUpdateStatus(inv.id, e.target.value)}
                        style={{
                          background:
                            inv.status === 'Paid'
                              ? 'rgba(16, 185, 129, 0.18)'
                              : inv.status === 'Pending'
                              ? 'rgba(245, 158, 11, 0.18)'
                              : 'rgba(156, 163, 175, 0.18)',
                          color:
                            inv.status === 'Paid'
                              ? '#10B981'
                              : inv.status === 'Pending'
                              ? '#F59E0B'
                              : '#9CA3AF',
                          border: `1px solid ${
                            inv.status === 'Paid'
                              ? '#10B981'
                              : inv.status === 'Pending'
                              ? '#F59E0B'
                              : '#9CA3AF'
                          }`,
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="Paid" style={{ background: '#18221b', color: '#10B981' }}>Paid</option>
                        <option value="Pending" style={{ background: '#262016', color: '#F59E0B' }}>Pending</option>
                        <option value="Draft" style={{ background: '#222', color: '#9CA3AF' }}>Draft</option>
                        <option value="Cancelled" style={{ background: '#2b1b1b', color: '#EF4444' }}>Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                        {/* Print / View */}
                        <button
                          onClick={() => onOpenInvoice(inv)}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--tb-card-border)',
                            color: '#fff',
                            borderRadius: 6,
                            padding: '6px 10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11
                          }}
                          title="View & Print Voucher"
                        >
                          <Printer size={14} /> Print
                        </button>

                        {/* Edit in Builder */}
                        <button
                          onClick={() => onEditInvoice(inv)}
                          style={{
                            background: 'rgba(242, 92, 5, 0.1)',
                            border: '1px solid rgba(242, 92, 5, 0.3)',
                            color: 'var(--tb-orange)',
                            borderRadius: 6,
                            padding: '6px 10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11
                          }}
                          title="Edit Invoice"
                        >
                          <Edit3 size={14} /> Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: 'var(--tb-red)',
                            borderRadius: 6,
                            padding: '6px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: 11
                          }}
                          title="Delete Invoice"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
