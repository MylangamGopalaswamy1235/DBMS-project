const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { rows } = await pool.query(
      'SELECT id, name, specialization, experience_years FROM doctors ORDER BY id'
    );
    return res.json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Database error: ' + e.message });
  }
};
