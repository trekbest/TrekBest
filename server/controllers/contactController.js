const db = require('../config/db');

exports.getAllMessages = async (req, res) => {
  try {
    const rows = await db.prepare('SELECT * FROM contact_messages ORDER BY createdAt DESC').all();
    res.json({ success: true, count: rows.length, messages: rows });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    const id = `msg-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO contact_messages (id, name, email, phone, subject, message, createdat)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(
      id,
      name,
      email,
      phone || '',
      subject || 'General Inquiry',
      message,
      new Date().toISOString()
    );

    const contactPayload = { name, email, phone, subject, message };
    const { sendContactNotification } = require('../config/email');
    sendContactNotification(contactPayload).catch(e => console.error('Contact email error:', e.message));

    res.status(201).json({
      success: true,
      message: 'Message sent! Confirmation email sent and our travel consultant will call you shortly.'
    });
  } catch (err) {
    console.error('Error creating contact message:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
