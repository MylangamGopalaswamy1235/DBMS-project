CREATE DATABASE IF NOT EXISTS doctor_eval_db;
USE doctor_eval_db;

CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT,
    patient_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    treatment_result VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Insert dummy data
INSERT INTO doctors (id, name, specialization, experience_years) VALUES
(1, 'Dr. Smith', 'Cardiology', 15),
(2, 'Dr. Adams', 'Neurology', 10),
(3, 'Dr. Lee', 'Pediatrics', 8)
ON DUPLICATE KEY UPDATE name=VALUES(name), specialization=VALUES(specialization), experience_years=VALUES(experience_years);

INSERT INTO patients (id, name, contact) VALUES
(1, 'John Doe', '123-456-7890'),
(2, 'Jane Doe', '098-765-4321')
ON DUPLICATE KEY UPDATE name=VALUES(name), contact=VALUES(contact);
