const db = require('../config/db');

// 1. Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const rows = await db.prepare('SELECT * FROM bookings ORDER BY createdat DESC').all();
    res.json({ success: true, count: rows.length, bookings: rows });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Create new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      packageId, packageTitle, customerName, customerEmail,
      customerPhone, travelDate, travelers, specialRequests, totalAmount
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !travelDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking details.' });
    }

    const id = `bk-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO bookings (id, packageid, packagetitle, customername, customeremail, customerphone, traveldate, travelers, specialrequests, totalamount, status, createdat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(
      id,
      packageId || '',
      packageTitle || 'Custom Itinerary',
      customerName,
      customerEmail,
      customerPhone,
      travelDate,
      Number(travelers) || 2,
      specialRequests || '',
      Number(totalAmount) || 0,
      'Confirmed',
      new Date().toISOString()
    );

    const created = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    // Trigger SMTP email confirmation
    const { sendBookingConfirmation } = require('../config/email');
    try {
      await sendBookingConfirmation(created);
      console.log(`✅ Booking confirmation email sent to ${created.customeremail}`);
    } catch (e) {
      console.error('Booking email error:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully! Confirmation email sent.',
      booking: created
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status || 'Confirmed', id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updated = await db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    res.json({ success: true, message: 'Booking status updated', booking: updated });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
