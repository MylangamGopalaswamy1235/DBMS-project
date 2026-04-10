from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='Vignesh@1235',
            database='doctor_eval_db'
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    conn = create_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctors")
        doctors = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(doctors)
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    doctor_id = data.get('doctor_id')
    patient_name = data.get('patient_name')
    patient_contact = data.get('patient_contact')
    rating = data.get('rating')
    comments = data.get('comments')
    treatment_result = data.get('treatment_result')

    conn = create_connection()
    if conn:
        try:
            cursor = conn.cursor()
            
            # Create or find patient
            cursor.execute("SELECT id FROM patients WHERE name = %s AND contact = %s", (patient_name, patient_contact))
            result = cursor.fetchone()
            if result:
                patient_id = result[0]
            else:
                cursor.execute("INSERT INTO patients (name, contact) VALUES (%s, %s)", (patient_name, patient_contact))
                patient_id = cursor.lastrowid
            
            # Insert feedback
            cursor.execute("""
                INSERT INTO feedback (doctor_id, patient_id, rating, comments, treatment_result)
                VALUES (%s, %s, %s, %s, %s)
            """, (doctor_id, patient_id, rating, comments, treatment_result))
            
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Feedback submitted successfully!"}), 201
        except Error as e:
            return jsonify({"error": str(e)}), 400
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/reports/<int:doctor_id>', methods=['GET'])
def get_report(doctor_id):
    conn = create_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        
        # Get doctor info
        cursor.execute("SELECT * FROM doctors WHERE id = %s", (doctor_id,))
        doctor = cursor.fetchone()
        
        if not doctor:
            return jsonify({"error": "Doctor not found"}), 404
            
        # Get feedbacks
        cursor.execute("""
            SELECT f.*, p.name as patient_name 
            FROM feedback f
            JOIN patients p ON f.patient_id = p.id
            WHERE doctor_id = %s
            ORDER BY created_at DESC
        """, (doctor_id,))
        feedbacks = cursor.fetchall()
        
        # Calculate stats
        total_feedback = len(feedbacks)
        avg_rating = sum(f['rating'] for f in feedbacks) / total_feedback if total_feedback > 0 else 0
        
        report = {
            "doctor": doctor,
            "feedbacks": feedbacks,
            "stats": {
                "total_feedback": total_feedback,
                "average_rating": round(avg_rating, 2)
            }
        }
        
        cursor.close()
        conn.close()
        return jsonify(report)
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    # Dummy login for admin or regular user
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username == "admin" and password == "admin123":
        return jsonify({"token": "fake-jwt-token-admin", "role": "admin", "name": "Administrator"})
    elif username == "user" and password == "user123":
        return jsonify({"token": "fake-jwt-token-user", "role": "user", "name": "Regular User"})
        
    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)
