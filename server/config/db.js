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
const hasCloudDb = Boolean(process.env.DATABASE_URL || (process.env.PG_HOST && process.env.PG_HOST !== 'localhost'));

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

if (isPostgres && (!isVercel || hasCloudDb)) {
  const isCloudOrSsl = process.env.PG_SSL === 'true' || 
    (process.env.PG_HOST && process.env.PG_HOST !== 'localhost') ||
    Boolean(process.env.DATABASE_URL);

  const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isCloudOrSsl ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 5000
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

  const targetDisplay = process.env.DATABASE_URL ? 'Cloud DATABASE_URL' : `${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432}/${process.env.PG_DATABASE || 'trekbest'}`;
  console.log(`🗄️ Database: PostgreSQL (${targetDisplay})`);

  dbInterface = {
    isPostgres: true,
    pool,
    query: async (sql, params = []) => {
      const pgSql = convertPlaceholders(sql);
      const res = await pool.query(pgSql, params);
      return res;
    },
    prepare: (sql) => {
      const pgSql = convertPlaceholders(sql);
      return {
        all: async (...params) => {
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(pgSql, flatParams);
          return res.rows.map(normalizeRow);
        },
        get: async (...params) => {
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(pgSql, flatParams);
          return res.rows.length > 0 ? normalizeRow(res.rows[0]) : null;
        },
        run: async (...params) => {
          const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(pgSql, flatParams);
          return { changes: res.rowCount };
        }
      };
    },
    exec: async (sql) => {
      return pool.query(sql);
    }
  };
} else if (isVercel && !hasCloudDb) {
  // On Vercel without a cloud Postgres configured, use the resilient /tmp storage engine
  dbInterface = createFallbackInterface();
} else {
  // SQLite Fallback for local dev
  const { DatabaseSync } = require('node:sqlite');
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
    }
  };
}

module.exports = dbInterface;
