Fit Track Application:
Fit Track is a full-stack fitness tracking application designed to help users organize their workout routines, log exercise metrics, and visualize their physical progress. The application utilizes a decoupled architecture with a RESTful Flask backend and a responsive React frontend.

Project Overview:
Fit Track addresses the need for a distraction-free workout logger. It allows users to create accounts, manage profiles, browse a pre-seeded library of exercises, log specific workout details (sets, reps, weights), and view dashboard analytics such as activity streaks and volume metrics.

Features:
1. User Authentication: Secure signup and login functionality using JWT (JSON Web Tokens).
2. Interactive Dashboard: Visual overview of workout activity, calories burned, and activity streaks.
3. Workout Management: Create custom workout routines and log specific exercises.
4. Exercise Library: Browse exercises categorized by muscle group (e.g., Strength, Cardio, Flexibility).
5. Metric Tracking: Log daily water intake and body weight.
6. Profile Management: Update user details and account settings.
7. Responsive UI: Optimized for both desktop and mobile web usage.

Technology Stack:
1. Backend
Language: Python 3.11+
Framework: Flask
ORM: SQLAlchemy (Flask-SQLAlchemy)
Migrations: Flask-Migrate (Alembic)
Authentication: Flask-JWT-Extended
CORS: Flask-CORS
Server: Gunicorn (Production)

2. Frontend
Library: React
Build Tool: Vite
HTTP Client: Axios
State Management: React Context API
Form Handling: Formik & Yup
Styling: CSS3

3. Database
Local Development: SQLite
Production: PostgreSQL

Prerequisites
Ensure the following tools are installed on your system:
1. Node.js (v16 or higher)
2. npm (Node Package Manager)
3. Python (v3.10 or higher)
4. Git

Local Development Setup:
1. Frontend:
Clone the Repository
git clone https://github.com/Praxcedes/Frontend-Fit-track-app.git
cd Frontend-Fit-track-app
    Install dependencies:
        npm install
        Start the Vite development server:
        npm run dev
        The frontend runs on http://localhost:5173

2. Backend
Clone the Repository
    git clone https://github.com/Praxcedes/Backend-Fit-track-app.git
cd Backend-Fit-track-app
Set up the Python environment
    python -m venv venv
Activate the virtual environment:
    Windows: venv\Scripts\activate
    MacOS/Linux: source venv/bin/activate
Install dependencies:
    pip install -r requirements.txt

Initialize the local SQLite database:
    cd server
    flask db upgrade
    python seed.py
Start the local development server:
    python app.py
The backend runs on http://127.0.0.1:5555

API Endpoints
Authentication:
POST /auth/signup - Register a new user.

POST /auth/login - Authenticate a user and receive an access token.

GET /auth/check_session - Validate the current session token.

Workouts & Exercises:
GET /exercises - Retrieve all available exercises.

GET /workouts - Retrieve workout history for the authenticated user.

POST /workouts - Log a new workout.

Metrics:
POST /metrics/log_water - Log water intake.

POST /metrics/log_weight - Log body weight.

GET /metrics/summary - Retrieve dashboard analytics.