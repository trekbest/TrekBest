// TrekBest Backend Server Bootstrap
// Delegates to modular SQLite-backed server in server/index.js

const app = require('./server/index');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  const dbType = (process.env.DB_TYPE || 'postgres').toUpperCase();
  const dbTarget = dbType === 'POSTGRES' 
    ? `PostgreSQL (${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432}/${process.env.PG_DATABASE || 'trekbest'})`
    : `SQLite (${process.env.DB_PATH || 'data/trekbest.db'})`;

  console.log('====================================================');
  console.log(`🚀 TrekBest Backend Server running on http://localhost:${PORT}`);
  console.log(`🗄️ Database: ${dbTarget}`);
  console.log('====================================================');
});
