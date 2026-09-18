const db = require('../config/db');

function formatInvoice(inv) {
  if (!inv) return null;
  return {
    ...inv,
    items: inv.items ? (typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items) : []
  };
}

// 1. Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const rows = await db.prepare('SELECT * FROM invoices ORDER BY createdat DESC').all();
    res.json({ success: true, count: rows.length, invoices: rows.map(formatInvoice) });
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Get single invoice
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await db.prepare('SELECT * FROM invoices WHERE id = ? OR invoiceno = ?').get(id, id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, invoice: formatInvoice(row) });
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const {
      clientName, clientEmail, clientPhone, clientAddress, destination,
      travelDate, pax, items, discount, gstPercent, subtotal, tax, total,
      currency, status, notes
    } = req.body;

    if (!clientName || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Client name and line items are required' });
    }

    const id = `inv-${Date.now()}`;
    const invoiceNo = `TB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const stmt = db.prepare(`
      INSERT INTO invoices (id, invoiceno, clientname, clientemail, clientphone, clientaddress, destination, traveldate, pax, items, discount, gstpercent, subtotal, tax, total, currency, status, notes, createdat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(
      id,
      invoiceNo,
      clientName,
      clientEmail || '',
      clientPhone || '',
      clientAddress || '',
      destination || 'Custom Tour',
      travelDate || 'Flexible',
      Number(pax) || 1,
      JSON.stringify(items),
      Number(discount) || 0,
      Number(gstPercent) || 5,
      Number(subtotal) || 0,
      Number(tax) || 0,
      Number(total) || 0,
      currency || 'INR',
      status || 'Paid',
      notes || '',
      new Date().toISOString()
    );

    const created = await db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
    const formattedInvoice = formatInvoice(created);

    // Automatically send invoice email to client if clientEmail is provided
    let emailSent = false;
    if (formattedInvoice.clientEmail) {
      try {
        const { sendInvoiceEmail } = require('../config/email');
        sendInvoiceEmail(formattedInvoice).catch(err => {
          console.error('Async invoice email sending error:', err.message);
        });
        emailSent = true;
      } catch (emailErr) {
        console.error('Invoice email dispatch failed:', emailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: emailSent
        ? `Invoice created successfully and sent to ${formattedInvoice.clientEmail}!`
        : 'Invoice created successfully!',
      emailSent,
      invoice: formattedInvoice
    });
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.prepare('SELECT * FROM invoices WHERE id = ? OR invoiceno = ?').get(id, id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const {
      clientName, clientEmail, clientPhone, clientAddress, destination,
      travelDate, pax, items, discount, gstPercent, subtotal, tax, total,
      currency, status, notes
    } = req.body;

    const updatedClientName = clientName !== undefined ? clientName : existing.clientName;
    const updatedClientEmail = clientEmail !== undefined ? clientEmail : existing.clientEmail;
    const updatedClientPhone = clientPhone !== undefined ? clientPhone : existing.clientPhone;
    const updatedClientAddress = clientAddress !== undefined ? clientAddress : existing.clientAddress;
    const updatedDestination = destination !== undefined ? destination : existing.destination;
    const updatedTravelDate = travelDate !== undefined ? travelDate : existing.travelDate;
    const updatedPax = pax !== undefined ? Number(pax) : existing.pax;
    const updatedItems = items !== undefined ? JSON.stringify(items) : (typeof existing.items === 'string' ? existing.items : JSON.stringify(existing.items));
    const updatedDiscount = discount !== undefined ? Number(discount) : existing.discount;
    const updatedGst = gstPercent !== undefined ? Number(gstPercent) : existing.gstPercent;
    const updatedSubtotal = subtotal !== undefined ? Number(subtotal) : existing.subtotal;
    const updatedTax = tax !== undefined ? Number(tax) : existing.tax;
    const updatedTotal = total !== undefined ? Number(total) : existing.total;
    const updatedCurrency = currency !== undefined ? currency : existing.currency;
    const updatedStatus = status !== undefined ? status : existing.status;
    const updatedNotes = notes !== undefined ? notes : existing.notes;

    const stmt = db.prepare(`
      UPDATE invoices
      SET clientname = ?, clientemail = ?, clientphone = ?, clientaddress = ?,
          destination = ?, traveldate = ?, pax = ?, items = ?, discount = ?,
          gstpercent = ?, subtotal = ?, tax = ?, total = ?, currency = ?,
          status = ?, notes = ?
      WHERE id = ? OR invoiceno = ?
    `);

    await stmt.run(
      updatedClientName, updatedClientEmail, updatedClientPhone, updatedClientAddress,
      updatedDestination, updatedTravelDate, updatedPax, updatedItems, updatedDiscount,
      updatedGst, updatedSubtotal, updatedTax, updatedTotal, updatedCurrency,
      updatedStatus, updatedNotes,
      id, id
    );

    const updated = await db.prepare('SELECT * FROM invoices WHERE id = ? OR invoiceno = ?').get(id, id);
    res.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice: formatInvoice(updated)
    });
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.prepare('DELETE FROM invoices WHERE id = ? OR invoiceno = ?').run(id, id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 6. Manual trigger to send/resend invoice email to client
exports.sendEmailToClient = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await db.prepare('SELECT * FROM invoices WHERE id = ? OR invoiceno = ?').get(id, id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const formatted = formatInvoice(row);
    if (!formatted.clientEmail) {
      return res.status(400).json({
        success: false,
        message: 'No client email found on this invoice record'
      });
    }

    const { sendInvoiceEmail } = require('../config/email');
    const emailResult = await sendInvoiceEmail(formatted);

    res.json({
      success: true,
      message: `Invoice email successfully sent to ${formatted.clientEmail}!`,
      details: emailResult
    });
  } catch (err) {
    console.error('Error sending invoice email:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
