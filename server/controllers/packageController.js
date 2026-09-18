const db = require('../config/db');

// Helper to parse JSON fields safely
function formatPackage(p) {
  if (!p) return null;
  return {
    ...p,
    isHoneymoon: Boolean(p.isHoneymoon || p.ishoneymoon),
    highlights: p.highlights ? (typeof p.highlights === 'string' ? JSON.parse(p.highlights) : p.highlights) : [],
    itinerary: p.itinerary ? (typeof p.itinerary === 'string' ? JSON.parse(p.itinerary) : p.itinerary) : [],
    inclusions: p.inclusions ? (typeof p.inclusions === 'string' ? JSON.parse(p.inclusions) : p.inclusions) : [],
    invoiceItems: (p.invoiceItems || p.invoiceitems) ? (typeof (p.invoiceItems || p.invoiceitems) === 'string' ? JSON.parse(p.invoiceItems || p.invoiceitems) : (p.invoiceItems || p.invoiceitems)) : []
  };
}

// 1. Get all packages with filter & search
exports.getAllPackages = async (req, res) => {
  try {
    const { search, category, maxPrice } = req.query;
    let query = 'SELECT * FROM packages WHERE 1=1';
    const params = [];

    if (category && category !== 'ALL') {
      if (category === 'HONEYMOON') {
        query += ' AND ishoneymoon = 1';
      } else {
        query += ' AND UPPER(category) = ?';
        params.push(category.toUpperCase());
      }
    }

    if (maxPrice && !isNaN(maxPrice)) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    query += ' ORDER BY price ASC';

    const rows = await db.prepare(query).all(...params);
    let packages = rows.map(formatPackage);

    if (search) {
      const q = search.toLowerCase();
      packages = packages.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.dest.toLowerCase().includes(q) ||
        (p.highlights && p.highlights.some(h => h.toLowerCase().includes(q)))
      );
    }

    res.json({ success: true, count: packages.length, packages });
  } catch (err) {
    console.error('Error fetching packages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Get single package by ID
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await db.prepare('SELECT * FROM packages WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, package: formatPackage(row) });
  } catch (err) {
    console.error('Error fetching package:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Create package
exports.createPackage = async (req, res) => {
  try {
    const {
      title, dest, category, isHoneymoon, duration, price,
      currency, rating, reviewCount, image, highlights, itinerary, inclusions, invoiceItems
    } = req.body;

    if (!title || !dest || !duration || !price) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const id = `pkg-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO packages (id, title, dest, category, ishoneymoon, duration, price, currency, rating, reviewcount, image, highlights, itinerary, inclusions, invoiceitems, createdat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(
      id,
      title,
      dest,
      category || 'DOMESTIC',
      isHoneymoon ? 1 : 0,
      duration,
      Number(price),
      currency || 'INR',
      rating || '4.8',
      Number(reviewCount) || 1,
      image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      JSON.stringify(highlights || []),
      JSON.stringify(itinerary || []),
      JSON.stringify(inclusions || []),
      JSON.stringify(invoiceItems || []),
      new Date().toISOString()
    );

    const created = await db.prepare('SELECT * FROM packages WHERE id = ?').get(id);
    res.status(201).json({ success: true, message: 'Package created', package: formatPackage(created) });
  } catch (err) {
    console.error('Error creating package:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Update package
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.prepare('SELECT * FROM packages WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const b = req.body;
    const stmt = db.prepare(`
      UPDATE packages SET
        title = ?,
        dest = ?,
        category = ?,
        ishoneymoon = ?,
        duration = ?,
        price = ?,
        rating = ?,
        image = ?,
        highlights = ?,
        itinerary = ?,
        inclusions = ?,
        invoiceitems = ?
      WHERE id = ?
    `);

    await stmt.run(
      b.title !== undefined ? b.title : existing.title,
      b.dest !== undefined ? b.dest : existing.dest,
      b.category !== undefined ? b.category : existing.category,
      b.isHoneymoon !== undefined ? (b.isHoneymoon ? 1 : 0) : (existing.isHoneymoon ? 1 : 0),
      b.duration !== undefined ? b.duration : existing.duration,
      b.price !== undefined ? Number(b.price) : existing.price,
      b.rating !== undefined ? b.rating : existing.rating,
      b.image !== undefined ? b.image : existing.image,
      b.highlights !== undefined ? JSON.stringify(b.highlights) : (typeof existing.highlights === 'string' ? existing.highlights : JSON.stringify(existing.highlights)),
      b.itinerary !== undefined ? JSON.stringify(b.itinerary) : (typeof existing.itinerary === 'string' ? existing.itinerary : JSON.stringify(existing.itinerary)),
      b.inclusions !== undefined ? JSON.stringify(b.inclusions) : (typeof existing.inclusions === 'string' ? existing.inclusions : JSON.stringify(existing.inclusions)),
      b.invoiceItems !== undefined ? JSON.stringify(b.invoiceItems) : (typeof existing.invoiceItems === 'string' ? existing.invoiceItems : JSON.stringify(existing.invoiceItems)),
      id
    );

    const updated = await db.prepare('SELECT * FROM packages WHERE id = ?').get(id);
    res.json({ success: true, message: 'Package updated', package: formatPackage(updated) });
  } catch (err) {
    console.error('Error updating package:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Delete package
exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.prepare('DELETE FROM packages WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (err) {
    console.error('Error deleting package:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
