const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const invoiceCountRow = await db.prepare('SELECT COUNT(*) as count FROM invoices').get();
    const invoiceCount = Number(invoiceCountRow ? invoiceCountRow.count : 0);

    const revenueRow = await db.prepare('SELECT SUM(total) as revenue FROM invoices').get();
    const totalRevenue = Number(revenueRow && revenueRow.revenue ? revenueRow.revenue : 0);

    const paidRow = await db.prepare("SELECT SUM(total) as paid, COUNT(*) as count FROM invoices WHERE status = 'Paid'").get();
    const paidAmount = Number(paidRow && paidRow.paid ? paidRow.paid : 0);
    const paidCount = Number(paidRow && paidRow.count ? paidRow.count : 0);

    const pendingRow = await db.prepare("SELECT SUM(total) as pending, COUNT(*) as count FROM invoices WHERE status != 'Paid'").get();
    const pendingAmount = Number(pendingRow && pendingRow.pending ? pendingRow.pending : 0);
    const pendingCount = Number(pendingRow && pendingRow.count ? pendingRow.count : 0);

    res.json({
      success: true,
      stats: {
        totalInvoices: invoiceCount,
        totalRevenue,
        paidAmount,
        paidCount,
        pendingAmount,
        pendingCount
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
