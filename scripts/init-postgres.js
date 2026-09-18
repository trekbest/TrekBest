require('dotenv').config();
const { Client, Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const SEED_JSON_PATH = path.join(__dirname, '..', 'data', 'database.json');

const pgConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
};

async function initPostgres() {
  const dbName = process.env.PG_DATABASE || 'trekbest';
  let pool;

  if (process.env.DATABASE_URL) {
    console.log('🚀 Connecting directly to PostgreSQL via DATABASE_URL...');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  } else {
    console.log('🚀 Step 1: Connecting to PostgreSQL server...');
    
    // 1. Connect to default 'postgres' database to check/create target database
    const adminClient = new Client({
      ...pgConfig,
      database: 'postgres'
    });

    await adminClient.connect();
    console.log('✅ Connected to PostgreSQL server.');

    const checkDb = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      console.log(`📦 Creating database "${dbName}"...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully!`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    }
    await adminClient.end();

    // 2. Connect to the target database
    console.log(`🚀 Step 2: Connecting to "${dbName}" database...`);
    pool = new Pool({
      ...pgConfig,
      database: dbName
    });
  }

  const client = await pool.connect();
  console.log(`✅ Connected to "${dbName}".`);

  // 3. Create Tables
  console.log('🔨 Step 3: Creating tables in PostgreSQL...');

  // Packages Table
  await client.query(`
    DROP TABLE IF EXISTS packages CASCADE;
    CREATE TABLE packages (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      dest VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      ishoneymoon INTEGER DEFAULT 0,
      duration VARCHAR(100) NOT NULL,
      price NUMERIC NOT NULL,
      currency VARCHAR(20) DEFAULT 'INR',
      rating VARCHAR(20) DEFAULT '4.8',
      reviewcount INTEGER DEFAULT 0,
      image TEXT,
      highlights TEXT,
      itinerary TEXT,
      inclusions TEXT,
      invoiceitems TEXT,
      createdat TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Bookings Table
  await client.query(`
    DROP TABLE IF EXISTS bookings CASCADE;
    CREATE TABLE bookings (
      id VARCHAR(255) PRIMARY KEY,
      packageid VARCHAR(255),
      packagetitle VARCHAR(255),
      customername VARCHAR(255) NOT NULL,
      customeremail VARCHAR(255) NOT NULL,
      customerphone VARCHAR(100) NOT NULL,
      traveldate VARCHAR(100) NOT NULL,
      travelers INTEGER DEFAULT 2,
      specialrequests TEXT,
      totalamount NUMERIC DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Confirmed',
      createdat TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Invoices Table
  await client.query(`
    DROP TABLE IF EXISTS invoices CASCADE;
    CREATE TABLE invoices (
      id VARCHAR(255) PRIMARY KEY,
      invoiceno VARCHAR(100) UNIQUE NOT NULL,
      clientname VARCHAR(255) NOT NULL,
      clientemail VARCHAR(255),
      clientphone VARCHAR(100),
      clientaddress TEXT,
      destination VARCHAR(255),
      traveldate VARCHAR(100),
      pax INTEGER DEFAULT 1,
      items TEXT NOT NULL,
      discount NUMERIC DEFAULT 0,
      gstpercent NUMERIC DEFAULT 5,
      subtotal NUMERIC NOT NULL,
      tax NUMERIC NOT NULL,
      total NUMERIC NOT NULL,
      currency VARCHAR(20) DEFAULT 'INR',
      status VARCHAR(50) DEFAULT 'Paid',
      notes TEXT,
      createdat TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Reviews Table
  await client.query(`
    DROP TABLE IF EXISTS reviews CASCADE;
    CREATE TABLE reviews (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      trip VARCHAR(255),
      rating NUMERIC DEFAULT 5,
      comment TEXT NOT NULL,
      avatar TEXT,
      createdat TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Contact Messages Table
  await client.query(`
    DROP TABLE IF EXISTS contact_messages CASCADE;
    CREATE TABLE contact_messages (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(100),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      createdat TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('✅ All PostgreSQL tables verified/created!');

  // 4. Seed Tables if empty
  console.log('🌱 Step 4: Seeding initial travel packages & invoices...');
  const countRes = await client.query('SELECT COUNT(*) as count FROM packages');
  const count = parseInt(countRes.rows[0].count, 10);

  if (count === 0 && fs.existsSync(SEED_JSON_PATH)) {
    console.log('🔄 Seeding from data/database.json into PostgreSQL...');
    const seedData = JSON.parse(fs.readFileSync(SEED_JSON_PATH, 'utf8'));

    // Packages
    if (Array.isArray(seedData.packages)) {
      for (const p of seedData.packages) {
        await client.query(`
          INSERT INTO packages (id, title, dest, category, ishoneymoon, duration, price, currency, rating, reviewcount, image, highlights, itinerary, inclusions, invoiceitems, createdat)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
        `, [
          p.id || `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          p.title || 'Untitled Tour',
          p.dest || 'India',
          p.category || 'DOMESTIC',
          p.isHoneymoon ? 1 : 0,
          p.duration || '4 Days / 3 Nights',
          p.price || 19999,
          p.currency || 'INR',
          p.rating || '4.8',
          p.reviewCount || 50,
          p.image || '',
          JSON.stringify(p.highlights || []),
          JSON.stringify(p.itinerary || []),
          JSON.stringify(p.inclusions || []),
          JSON.stringify(p.invoiceItems || [])
        ]);
      }
      console.log(`✅ Seeded ${seedData.packages.length} tour packages into PostgreSQL!`);
    }

    // Invoices
    if (Array.isArray(seedData.invoices)) {
      for (const inv of seedData.invoices) {
        await client.query(`
          INSERT INTO invoices (id, invoiceno, clientname, clientemail, clientphone, clientaddress, destination, traveldate, pax, items, discount, gstpercent, subtotal, tax, total, currency, status, notes, createdat)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
        `, [
          inv.id || `inv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          inv.invoiceNo || `TB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          inv.clientName || 'Valued Traveler',
          inv.clientEmail || 'client@example.com',
          inv.clientPhone || '+91 98765 43210',
          inv.clientAddress || '',
          inv.destination || 'Special Tour',
          inv.travelDate || 'Flexible',
          inv.pax || 2,
          JSON.stringify(inv.items || []),
          inv.discount || 0,
          inv.gstPercent || 5,
          inv.subtotal || inv.total || 0,
          inv.tax || 0,
          inv.total || 0,
          inv.currency || 'INR',
          inv.status || 'Paid',
          inv.notes || 'All permits and taxes included.'
        ]);
      }
      console.log(`✅ Seeded ${seedData.invoices.length} invoices into PostgreSQL!`);
    }

    // Reviews
    if (Array.isArray(seedData.reviews)) {
      for (const r of seedData.reviews) {
        await client.query(`
          INSERT INTO reviews (id, name, location, trip, rating, comment, avatar, createdat)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `, [
          r.id || `rev-${Date.now()}`,
          r.name || 'Anonymous',
          r.location || 'India',
          r.trip || 'Tour Package',
          r.rating || 5,
          r.comment || '',
          r.avatar || ''
        ]);
      }
      console.log(`✅ Seeded ${seedData.reviews.length} reviews into PostgreSQL!`);
    }

    // Contact Messages
    if (Array.isArray(seedData.contactMessages)) {
      for (const m of seedData.contactMessages) {
        await client.query(`
          INSERT INTO contact_messages (id, name, email, phone, subject, message, createdat)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `, [
          m.id || `msg-${Date.now()}`,
          m.name || 'Inquirer',
          m.email || 'info@example.com',
          m.phone || '',
          m.subject || 'Tour Query',
          m.message || ''
        ]);
      }
      console.log(`✅ Seeded ${seedData.contactMessages.length} inquiries into PostgreSQL!`);
    }
  } else {
    console.log(`ℹ️ PostgreSQL packages table already contains ${count} rows.`);
  }

  client.release();
  await pool.end();
  console.log('🎉 PostgreSQL setup completed successfully!');
}

initPostgres().catch(err => {
  console.error('❌ PostgreSQL setup failed:', err);
  process.exit(1);
});
