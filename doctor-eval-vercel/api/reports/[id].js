const { Pool } = require('pg');

const FALLBACK_DOCTORS = [
  { id: 1, name: 'Dr. G. Gopalaswamy', specialization: 'Gynaecologist', qualification: 'FRCS', experience_years: 20 },
  { id: 2, name: 'Dr. Prashanth Krishna', specialization: 'Cardiologist', qualification: 'MD', experience_years: 15 },
  { id: 3, name: 'Dr. Geetha Haripriya', specialization: 'Dermatologist', qualification: 'MBBS', experience_years: 12 },
  { id: 4, name: 'Dr. Gnyalabalan', specialization: 'Neurologist', qualification: 'DM', experience_years: 18 },
  { id: 5, name: 'Dr. Maya Vedha Murthy', specialization: 'Paediatrician', qualification: 'DCH', experience_years: 10 },
  { id: 6, name: 'Dr. Pradeep', specialization: 'Orthopaedic Surgeon', qualification: 'MS', experience_years: 14 },
  { id: 7, name: 'Dr. Nallaperumal', specialization: 'General Surgeon', qualification: 'MBBS, MS', experience_years: 22 },
  { id: 8, name: 'Dr. Lakshmanan', specialization: 'ENT Specialist', qualification: 'MS ENT', experience_years: 16 },
  { id: 9, name: 'Dr. Velaruvi Sabesan', specialization: 'Ophthalmologist', qualification: 'DO', experience_years: 11 },
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const doctorId = parseInt(req.query.id, 10);
  if (isNaN(doctorId)) return res.status(400).json({ error: 'Invalid doctor ID' });

  // Demo mode: no database — return empty feedback list
  if (!process.env.DATABASE_URL) {
    const doctor = FALLBACK_DOCTORS.find(d => d.id === doctorId) || FALLBACK_DOCTORS[0];
    return res.json({
      doctor,
      feedbacks: [],
      stats: { total_feedback: 0, average_rating: 0 },
      demo: true
    });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
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
  } finally {
    await pool.end();
  }
};
