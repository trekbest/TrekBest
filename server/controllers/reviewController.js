const db = require('../config/db');

exports.getAllReviews = async (req, res) => {
  try {
    const rows = await db.prepare('SELECT * FROM reviews ORDER BY createdat DESC').all();
    res.json({ success: true, count: rows.length, reviews: rows });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { name, location, trip, rating, comment, avatar } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Name and comment are required' });
    }

    const id = `rev-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO reviews (id, name, location, trip, rating, comment, avatar, createdat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(
      id,
      name,
      location || 'India',
      trip || 'Custom Tour',
      Number(rating) || 5,
      comment,
      avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      new Date().toISOString()
    );

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
