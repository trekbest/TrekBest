const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const SEED_JSON_PATH = path.join(__dirname, '..', '..', 'data', 'database.json');
const isPostgres = (process.env.DB_TYPE || 'postgres').toLowerCase() === 'postgres';

// Row key normalizer to ensure seamless camelCase compatibility
function normalizeRow(row) {
  if (!row || typeof row !== 'object') return row;
  const mapped = {};
  for (const [k, v] of Object.entries(row)) {
    mapped[k] = v;
    if (k === 'invoiceno') mapped.invoiceNo = v;
    if (k === 'clientname') mapped.clientName = v;
    if (k === 'clientemail') mapped.clientEmail = v;
    if (k === 'clientphone') mapped.clientPhone = v;
    if (k === 'clientaddress') mapped.clientAddress = v;
    if (k === 'traveldate') mapped.travelDate = v;
    if (k === 'gstpercent') mapped.gstPercent = Number(v);
    if (k === 'createdat') mapped.createdAt = v;
    if (k === 'ishoneymoon') mapped.isHoneymoon = Boolean(v);
    if (k === 'reviewcount') mapped.reviewCount = Number(v);
    if (k === 'invoiceitems') mapped.invoiceItems = v;
    if (k === 'packageid') mapped.packageId = v;
    if (k === 'packagetitle') mapped.packageTitle = v;
    if (k === 'customername') mapped.customerName = v;
    if (k === 'customeremail') mapped.customerEmail = v;
    if (k === 'customerphone') mapped.customerPhone = v;
    if (k === 'specialrequests') mapped.specialRequests = v;
    if (k === 'totalamount') mapped.totalAmount = Number(v);
    if (k === 'price') mapped.price = Number(v);
    if (k === 'discount') mapped.discount = Number(v);
    if (k === 'subtotal') mapped.subtotal = Number(v);
    if (k === 'tax') mapped.tax = Number(v);
    if (k === 'total') mapped.total = Number(v);
    if (k === 'pax') mapped.pax = Number(v);
    if (k === 'travelers') mapped.travelers = Number(v);
  }
  return mapped;
}

// Convert SQLite '?' placeholders to PostgreSQL '$1, $2, $3...'
function convertPlaceholders(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

let dbInterface;

const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
const NEON_DEFAULT_DB_URL = "postgresql://neondb_owner:npg_h7MYdtB6vwlJ@ep-curly-bread-b5i4u7el-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";
const activeDbUrl = process.env.DATABASE_URL || (isVercel ? NEON_DEFAULT_DB_URL : null);
const hasCloudDb = Boolean(activeDbUrl || (process.env.PG_HOST && process.env.PG_HOST !== 'localhost'));

function loadFallbackData() {
  const tmpFile = path.join('/tmp', 'trekbest_db.json');
  try {
    if (fs.existsSync(tmpFile)) {
      return JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    }
  } catch (e) {}

  try {
    if (fs.existsSync(SEED_JSON_PATH)) {
      const data = JSON.parse(fs.readFileSync(SEED_JSON_PATH, 'utf8'));
      saveFallbackData(data);
      return data;
    }
  } catch (e) {}

  return { packages: [], invoices: [], bookings: [], contacts: [], reviews: [] };
}

function saveFallbackData(data) {
  try {
    const tmpFile = path.join('/tmp', 'trekbest_db.json');
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save /tmp fallback data:', e.message);
  }
}

function createFallbackInterface() {
  console.log('🗄️ Database: Serverless In-Memory /tmp Store (Initialized from database.json)');

  return {
    isPostgres: false,
    isFallback: true,
    query: async () => ({ rows: [] }),
    exec: async () => {},
    prepare: (sql) => {
      const sqlLower = sql.trim().toLowerCase();

      return {
        all: async (...params) => {
          const inMemoryData = loadFallbackData();
          if (sqlLower.includes('from invoices')) return (inMemoryData.invoices || []).map(normalizeRow);
          if (sqlLower.includes('from packages')) return (inMemoryData.packages || []).map(normalizeRow);
          if (sqlLower.includes('from bookings')) return (inMemoryData.bookings || []).map(normalizeRow);
          if (sqlLower.includes('from reviews')) return (inMemoryData.reviews || []).map(normalizeRow);
          return [];
        },

        get: async (...params) => {
          const inMemoryData = loadFallbackData();
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;

          if (sqlLower.includes('from invoices')) {
            const idOrNo = flatParams[0];
            const found = (inMemoryData.invoices || []).find(
              i => String(i.id) === String(idOrNo) || String(i.invoiceNo) === String(idOrNo) || String(i.invoiceno) === String(idOrNo)
            );
            return found ? normalizeRow(found) : null;
          }
          if (sqlLower.includes('from packages')) {
            const id = flatParams[0];
            const found = (inMemoryData.packages || []).find(p => String(p.id) === String(id));
            return found ? normalizeRow(found) : null;
          }
          if (sqlLower.includes('from bookings')) {
            const id = flatParams[0];
            const found = (inMemoryData.bookings || []).find(b => String(b.id) === String(id));
            return found ? normalizeRow(found) : null;
          }
          return null;
        },

        run: async (...params) => {
          const inMemoryData = loadFallbackData();
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;

          if (sqlLower.startsWith('insert into invoices')) {
            const [
              id, invoiceno, clientname, clientemail, clientphone, clientaddress, destination, traveldate, pax, items, discount, gstpercent, subtotal, tax, total, currency, status, notes, createdat
            ] = flatParams;

            const newInv = {
              id,
              invoiceNo: invoiceno,
              invoiceno,
              clientName: clientname,
              clientname,
              clientEmail: clientemail,
              clientemail,
              clientPhone: clientphone,
              clientphone,
              clientAddress: clientaddress,
              clientaddress,
              destination,
              travelDate: traveldate,
              traveldate,
              pax: Number(pax) || 1,
              items: typeof items === 'string' ? JSON.parse(items) : items,
              discount: Number(discount) || 0,
              gstPercent: Number(gstpercent) || 0,
              gstpercent: Number(gstpercent) || 0,
              subtotal: Number(subtotal) || 0,
              tax: Number(tax) || 0,
              total: Number(total) || 0,
              currency: currency || 'INR',
              status: status || 'Paid',
              notes: notes || '',
              createdAt: createdat || new Date().toISOString(),
              createdat: createdat || new Date().toISOString()
            };

            inMemoryData.invoices = [newInv, ...(inMemoryData.invoices || [])];
            saveFallbackData(inMemoryData);
            return { changes: 1 };
          }

          if (sqlLower.startsWith('update invoices')) {
            if (sqlLower.includes('set status = ? where id = ?')) {
              const [newStatus, id] = flatParams;
              const idx = (inMemoryData.invoices || []).findIndex(i => String(i.id) === String(id));
              if (idx !== -1) {
                inMemoryData.invoices[idx].status = newStatus;
                saveFallbackData(inMemoryData);
                return { changes: 1 };
              }
            } else {
              const [
                destination, traveldate, pax, items, discount, gstpercent, subtotal, tax, total, status, notes, id
              ] = flatParams;

              const idx = (inMemoryData.invoices || []).findIndex(i => String(i.id) === String(id));
              if (idx !== -1) {
                inMemoryData.invoices[idx] = {
                  ...inMemoryData.invoices[idx],
                  destination,
                  travelDate: traveldate,
                  traveldate,
                  pax: Number(pax) || 1,
                  items: typeof items === 'string' ? JSON.parse(items) : items,
                  discount: Number(discount) || 0,
                  gstPercent: Number(gstpercent) || 0,
                  subtotal: Number(subtotal) || 0,
                  tax: Number(tax) || 0,
                  total: Number(total) || 0,
                  status,
                  notes
                };
                saveFallbackData(inMemoryData);
                return { changes: 1 };
              }
            }
            return { changes: 0 };
          }

          if (sqlLower.startsWith('delete from invoices')) {
            const id = flatParams[0];
            const before = (inMemoryData.invoices || []).length;
            inMemoryData.invoices = (inMemoryData.invoices || []).filter(i => String(i.id) !== String(id));
            saveFallbackData(inMemoryData);
            return { changes: before - inMemoryData.invoices.length };
          }

          if (sqlLower.startsWith('insert into bookings')) {
            const [
              id, packageid, packagetitle, customername, customeremail, customerphone, traveldate, travelers, specialrequests, totalamount, status, createdat
            ] = flatParams;

            const newBooking = {
              id,
              packageId: packageid,
              packageName: packagetitle,
              customerName: customername,
              email: customeremail,
              phone: customerphone,
              travelDate: traveldate,
              pax: Number(travelers) || 1,
              amount: Number(totalamount) || 0,
              status: status || 'Pending',
              specialRequests: specialrequests || '',
              createdAt: createdat || new Date().toISOString()
            };

            inMemoryData.bookings = [newBooking, ...(inMemoryData.bookings || [])];
            saveFallbackData(inMemoryData);
            return { changes: 1 };
          }

          return { changes: 1 };
        }
      };
    }
  };
}

let initPostgresPromise = null;

async function initPostgresSchema(pool) {
  try {
    // 1. Create tables if they do not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS packages (
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

      CREATE TABLE IF NOT EXISTS bookings (
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

      CREATE TABLE IF NOT EXISTS invoices (
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

      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        trip VARCHAR(255),
        rating NUMERIC DEFAULT 5,
        comment TEXT NOT NULL,
        avatar TEXT,
        createdat TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        createdat TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Check if packages table is empty, seed initial data from database.json if so
    const countRes = await pool.query('SELECT COUNT(*) as count FROM packages');
    const count = parseInt(countRes.rows[0].count, 10);

    if (count === 0 && fs.existsSync(SEED_JSON_PATH)) {
      console.log('🌱 Auto-seeding initial packages & invoices into PostgreSQL...');
      const seedData = JSON.parse(fs.readFileSync(SEED_JSON_PATH, 'utf8'));

      if (Array.isArray(seedData.packages)) {
        for (const p of seedData.packages) {
          await pool.query(`
            INSERT INTO packages (id, title, dest, category, ishoneymoon, duration, price, currency, rating, reviewcount, image, highlights, itinerary, inclusions, invoiceitems, createdat)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
            ON CONFLICT (id) DO NOTHING
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
      }

      if (Array.isArray(seedData.invoices)) {
        for (const inv of seedData.invoices) {
          await pool.query(`
            INSERT INTO invoices (id, invoiceno, clientname, clientemail, clientphone, clientaddress, destination, traveldate, pax, items, discount, gstpercent, subtotal, tax, total, currency, status, notes, createdat)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
            ON CONFLICT (id) DO NOTHING
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
      }

      if (Array.isArray(seedData.reviews)) {
        for (const r of seedData.reviews) {
          await pool.query(`
            INSERT INTO reviews (id, name, location, trip, rating, comment, avatar, createdat)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (id) DO NOTHING
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
      }
      console.log('✅ PostgreSQL auto-seeding completed.');
    }
  } catch (err) {
    console.error('⚠️ PostgreSQL schema auto-init warning:', err.message);
  }
}

if (isPostgres && (!isVercel || hasCloudDb)) {
  const isCloudOrSsl = process.env.PG_SSL === 'true' || 
    (process.env.PG_HOST && process.env.PG_HOST !== 'localhost') ||
    Boolean(activeDbUrl);

  const poolConfig = activeDbUrl
    ? {
        connectionString: activeDbUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
      }
    : {
        host: process.env.PG_HOST || 'localhost',
        port: Number(process.env.PG_PORT) || 5432,
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE || 'trekbest',
        ssl: isCloudOrSsl ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 5000
      };

  const pool = new Pool(poolConfig);

  const targetDisplay = activeDbUrl ? 'Cloud Neon PostgreSQL' : `${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432}/${process.env.PG_DATABASE || 'trekbest'}`;
  console.log(`🗄️ Database: PostgreSQL (${targetDisplay})`);

  // Auto-initialize schema in background
  initPostgresPromise = initPostgresSchema(pool);

  dbInterface = {
    isPostgres: true,
    pool,
    query: async (sql, params = []) => {
      if (initPostgresPromise) await initPostgresPromise;
      const pgSql = convertPlaceholders(sql);
      const res = await pool.query(pgSql, params);
      return res;
    },
    prepare: (sql) => {
      const pgSql = convertPlaceholders(sql);
      return {
        all: async (...params) => {
          if (initPostgresPromise) await initPostgresPromise;
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(pgSql, flatParams);
          return res.rows.map(normalizeRow);
        },
        get: async (...params) => {
          if (initPostgresPromise) await initPostgresPromise;
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(pgSql, flatParams);
          return res.rows.length > 0 ? normalizeRow(res.rows[0]) : null;
        },
        run: async (...params) => {
          if (initPostgresPromise) await initPostgresPromise;
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(pgSql, flatParams);
          return { changes: res.rowCount };
        }
      };
    },
    exec: async (sql) => {
      if (initPostgresPromise) await initPostgresPromise;
      return pool.query(sql);
    },
    getDbStatus: async () => {
      if (initPostgresPromise) await initPostgresPromise;
      const invRes = await pool.query('SELECT COUNT(*) as c FROM invoices').catch(() => ({ rows: [{ c: 0 }] }));
      const pkgRes = await pool.query('SELECT COUNT(*) as c FROM packages').catch(() => ({ rows: [{ c: 0 }] }));
      return {
        type: 'PostgreSQL',
        target: targetDisplay,
        persistent: true,
        invoicesCount: parseInt(invRes.rows[0].c, 10),
        packagesCount: parseInt(pkgRes.rows[0].c, 10)
      };
    }
  };
} else if (isVercel && !hasCloudDb) {
  // On Vercel without a cloud Postgres configured, use the resilient /tmp storage engine
  dbInterface = createFallbackInterface();
  dbInterface.getDbStatus = async () => {
    const data = loadFallbackData();
    return {
      type: 'Serverless Fallback (/tmp)',
      target: '/tmp/trekbest_db.json',
      persistent: false,
      warning: '⚠️ Data will NOT permanently persist across cold starts. Please configure DATABASE_URL in your Vercel Project Settings.',
      invoicesCount: (data.invoices || []).length,
      packagesCount: (data.packages || []).length
    };
  };
} else {
  // SQLite Fallback for local dev
  let DatabaseSync;
  try {
    DatabaseSync = require('node:sqlite').DatabaseSync;
  } catch (e) {
    DatabaseSync = null;
  }

  if (!DatabaseSync) {
    dbInterface = createFallbackInterface();
    dbInterface.getDbStatus = async () => ({
      type: 'Fallback',
      persistent: false
    });
  } else {
    const DB_PATH = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(__dirname, '..', '..', 'data', 'trekbest.db');
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const sqliteDb = new DatabaseSync(DB_PATH);
    sqliteDb.exec('PRAGMA journal_mode = WAL;');

    console.log(`🗄️ Database: SQLite (${DB_PATH})`);

    dbInterface = {
      isPostgres: false,
      sqliteDb,
      prepare: (sql) => {
        const stmt = sqliteDb.prepare(sql);
        return {
          all: async (...params) => {
            const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
            return stmt.all(...flatParams).map(normalizeRow);
          },
          get: async (...params) => {
            const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
            const row = stmt.get(...flatParams);
            return row ? normalizeRow(row) : null;
          },
          run: async (...params) => {
            const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
            return stmt.run(...flatParams);
          }
        };
      },
      exec: async (sql) => {
        return sqliteDb.exec(sql);
      },
      getDbStatus: async () => ({
        type: 'SQLite',
        target: DB_PATH,
        persistent: true
      })
    };
  }
}

module.exports = dbInterface;
