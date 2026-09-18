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

if (isPostgres) {
  const isCloudOrSsl = process.env.PG_SSL === 'true' || 
    (process.env.PG_HOST && process.env.PG_HOST !== 'localhost') ||
    Boolean(process.env.DATABASE_URL);

  const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isCloudOrSsl ? { rejectUnauthorized: false } : false
      }
    : {
        host: process.env.PG_HOST || 'localhost',
        port: Number(process.env.PG_PORT) || 5432,
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE || 'trekbest',
        ssl: isCloudOrSsl ? { rejectUnauthorized: false } : false
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
} else {
  // SQLite Fallback
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
