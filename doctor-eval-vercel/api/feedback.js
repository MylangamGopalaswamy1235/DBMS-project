const { Pool } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.DATABASE_URL) {
    return res.status(503).json({
      error: 'Database not connected. Please add DATABASE_URL in your Vercel project settings (Settings → Environment Variables). See README.md for setup steps.'
    });
  }

  const { doctor_id, patient_name, patient_contact, rating, comments, treatment_result } = req.body || {};
  if (!doctor_id || !patient_name || !patient_contact || !rating)
    return res.status(400).json({ error: 'Missing required fields: doctor, patient name, contact, and rating are required.' });

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT id FROM patients WHERE name = $1 AND contact = $2',
      [patient_name, patient_contact]
    );
    let patient_id;
    if (existing.rows.length > 0) {
      patient_id = existing.rows[0].id;
    } else {
      const ins = await client.query(
        'INSERT INTO patients (name, contact) VALUES ($1, $2) RETURNING id',
        [patient_name, patient_contact]
      );
      patient_id = ins.rows[0].id;
    }

    await client.query(
      'INSERT INTO feedback (doctor_id, patient_id, rating, comments, treatment_result) VALUES ($1,$2,$3,$4,$5)',
      [doctor_id, patient_id, rating, comments || '', treatment_result || '']
    );

    await client.query('COMMIT');
    return res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    return res.status(500).json({ error: 'Failed to save feedback: ' + e.message });
  } finally {
    client.release();
    await pool.end();
  }
};
