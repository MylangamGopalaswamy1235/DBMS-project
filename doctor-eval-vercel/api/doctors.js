const { Pool } = require('pg');

const FALLBACK_DOCTORS = [
  { id: 1,  name: 'Dr. Smith',               specialization: 'Cardiology',                     experience_years: 15 },
  { id: 2,  name: 'Dr. Adams',               specialization: 'Neurology',                      experience_years: 10 },
  { id: 3,  name: 'Dr. Lee',                 specialization: 'Pediatrics',                     experience_years: 8  },
  { id: 4,  name: 'Dr. G. Gopalaswamy',      specialization: 'Gynaecologist, FRCS',            experience_years: 20 },
  { id: 5,  name: 'Dr. Prashanth Krishna',   specialization: 'Gynaecologist, Robotic Surgeon', experience_years: 15 },
  { id: 6,  name: 'Dr. G. Geetha Haripriya',specialization: 'Obstetrics & Gynaecology',       experience_years: 12 },
  { id: 7,  name: 'Dr. Gnyalabalan',         specialization: 'Neonatologist & Paediatrician',  experience_years: 18 },
  { id: 8,  name: 'Dr. Maya Vedha Murthy',   specialization: 'Dermatologist',                  experience_years: 10 },
  { id: 9,  name: 'Dr. Pradeep',             specialization: 'General Physician',              experience_years: 14 },
  { id: 10, name: 'Dr. Nallaperumal',        specialization: 'Diabetologist',                  experience_years: 16 },
  { id: 11, name: 'Dr. Lakshmanan',          specialization: 'Anaesthetics & Pain Management', experience_years: 22 },
  { id: 12, name: 'Dr. Velaruvi Sabesan',    specialization: 'Cardiologist',                   experience_years: 19 },
  { id: 13, name: 'Dr. Ramesh Kumar',        specialization: 'Orthopaedic Surgeon',            experience_years: 17 },
  { id: 14, name: 'Dr. Sunitha Rajan',       specialization: 'Ophthalmologist',                experience_years: 11 },
  { id: 15, name: 'Dr. Karthik Narayanan',   specialization: 'Pulmonologist',                  experience_years: 13 },
  { id: 16, name: 'Dr. Meenakshi Sundaram',  specialization: 'ENT Specialist',                 experience_years: 9  },
  { id: 17, name: 'Dr. Vijayalakshmi',       specialization: 'Oncologist',                     experience_years: 21 },
  { id: 18, name: 'Dr. Anand Babu',          specialization: 'Gastroenterologist',             experience_years: 15 },
  { id: 19, name: 'Dr. Kavitha Mohan',       specialization: 'Rheumatologist',                 experience_years: 8  },
  { id: 20, name: 'Dr. Srinivasan',          specialization: 'Urologist',                      experience_years: 24 },
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.DATABASE_URL) {
    return res.json(FALLBACK_DOCTORS);
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    const { rows } = await pool.query(
      'SELECT id, name, specialization, experience_years FROM doctors ORDER BY id'
    );
    return res.json(rows.length > 0 ? rows : FALLBACK_DOCTORS);
  } catch (e) {
    console.error('DB error, using fallback:', e.message);
    return res.json(FALLBACK_DOCTORS);
  }
};
