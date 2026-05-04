const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const doctorId = parseInt(req.query.id, 10);
  if (isNaN(doctorId)) return res.status(400).json({ error: 'Invalid doctor ID' });

  try {
    const drResult = await pool.query('SELECT * FROM doctors WHERE id = $1', [doctorId]);
    if (drResult.rows.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    const doctor = drResult.rows[0];

    const fbResult = await pool.query(
      `SELECT f.id, f.rating, f.comments, f.treatment_result, f.created_at, p.name AS patient_name
       FROM feedback f
       JOIN patients p ON f.patient_id = p.id
       WHERE f.doctor_id = $1
       ORDER BY f.created_at DESC`,
      [doctorId]
    );
    const feedbacks = fbResult.rows;
    const total_feedback = feedbacks.length;
    const average_rating = total_feedback > 0
      ? Math.round((feedbacks.reduce((s, f) => s + f.rating, 0) / total_feedback) * 100) / 100
      : 0;

    return res.json({ doctor, feedbacks, stats: { total_feedback, average_rating } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Database error: ' + e.message });
  }
};
