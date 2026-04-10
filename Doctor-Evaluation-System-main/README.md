# Doctor Evaluation System

This is a comprehensive Doctor Evaluation System designed with a Python Flask backend, MySQL database, and HTML/CSS/JS frontend. It allows for tracking doctor performance, collecting patient feedback, and generating performance reports.

## Prerequisites
- Python 3.8+
- MySQL Server

## Project Structure
- `backend/`: Contains the Python Flask application and requirements.
- `frontend/`: Contains the HTML, CSS, and JS files for the user interface.
- `setup_db.sql`: The SQL script to initialize the MySQL database scheme and populate dummy data.

## Setup Instructions

### 1. Database Setup
1. Ensure your MySQL server is running locally.
2. Execute the `setup_db.sql` script to create the database and tables. You can do this via command line or an interface like MySQL Workbench:
   ```bash
   mysql -u root -p < setup_db.sql
   ```
   *(Note: The `backend/app.py` script connects using the user `root` with a blank password. If your MySQL root user has a password, please update `backend/app.py` matching your configuration).*

### 2. Backend Setup
1. Open your terminal and navigate to the `backend` directory.
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```bash
   python app.py
   ```
   *The backend server should now be running on http://localhost:5000.*

### 3. Frontend Setup
1. Open the `frontend/index.html` file in your preferred web browser. 
2. Use the following mock credentials to log in:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Enjoy navigating via the dashboard, submitting feedback forms, and viewing charts on the report page.
