-- Run this on your PostgreSQL database (Neon / Supabase / Railway)
-- BEFORE deploying to Vercel.

CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  experience_years INT NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  doctor_id INT REFERENCES doctors(id),
  patient_id INT REFERENCES patients(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  treatment_result VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO doctors (name, specialization, experience_years) VALUES
('Dr. Smith', 'Cardiology', 15),
('Dr. Adams', 'Neurology', 10),
('Dr. Lee', 'Pediatrics', 8),
('Dr. G. Gopalaswamy', 'Gynaecologist, FRCS', 20),
('Dr. Prashanth Krishna', 'Gynaecologist, Robotic Surgeon', 15),
('Dr. G. Geetha Haripriya', 'Obstetrics & Gynaecology', 12),
('Dr. Gnyalabalan', 'Neonatologist & Paediatrician', 18),
('Dr. Maya Vedha Murthy', 'Dermatologist', 10),
('Dr. Pradeep', 'General Physician', 14),
('Dr. Nallaperumal', 'Diabetologist', 16),
('Dr. Lakshmanan', 'Anaesthetics & Pain Management', 22),
('Dr. Velaruvi Sabesan', 'Cardiologist', 19),
('Dr. Ramesh Kumar', 'Orthopaedic Surgeon', 17),
('Dr. Sunitha Rajan', 'Ophthalmologist', 11),
('Dr. Karthik Narayanan', 'Pulmonologist', 13),
('Dr. Meenakshi Sundaram', 'ENT Specialist', 9),
('Dr. Vijayalakshmi', 'Oncologist', 21),
('Dr. Anand Babu', 'Gastroenterologist', 15),
('Dr. Kavitha Mohan', 'Rheumatologist', 8),
('Dr. Srinivasan', 'Urologist', 24)
ON CONFLICT DO NOTHING;
