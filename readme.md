🩺 Digital Health Wallet

A secure, full-stack personal health record application. This "Health Wallet" allows users to upload medical reports, track health vitals (like Blood Pressure & Sugar) with interactive graphs, and securely share specific records with doctors or family members.

Built as a technical assessment submission.

🚀 Features

User Management: Secure Registration and Login (JWT Authentication & Bcrypt Hashing).

Medical Reports: Upload PDF or Image reports with metadata (Title, Type).

Document Viewer: Preview uploaded files directly within the dashboard without downloading.

Vitals Tracking: Log health metrics (Heart Rate, BP, Sugar) and visualize trends via dynamic line charts.

Secure Sharing: Grant read-only access to specific reports to other registered users (e.g., Doctors).

Access Control: Users can only view their own data or data explicitly shared with them.

🛠️ Tech Stack

Frontend: React.js, Bootstrap (UI), Recharts (Data Visualization), Axios

Backend: Node.js, Express.js

Database: SQLite (Lightweight, serverless relational database)

Authentication: JSON Web Tokens (JWT)

File Storage: Local storage using Multer

⚙️ Installation & Setup Guide

Follow these steps to run the application locally.

1. Prerequisites

Ensure you have Node.js installed on your machine.

2. Clone the Repository

git clone [https://github.com/rahulkaja/Digital-Health-Wallet.git](https://github.com/rahulkaja/Digital-Health-Wallet.git)
cd Digital-Health-Wallet


3. Backend Setup (Server)

The backend runs on Port 5001.

# Navigate to the server folder
cd server

# Install dependencies
npm install

# Start the server
npx nodemon index.js


You should see: "Server is running on http://localhost:5001" and "Connected to the SQLite database."

4. Frontend Setup (Client)

Open a new terminal window (keep the server running).

# Navigate to the client folder
cd client

# Install dependencies
npm install

# Start the React application
npm start


The app will automatically open at http://localhost:3000.

📂 API Documentation

The backend exposes the following REST API endpoints:

Authentication

POST /api/auth/register

Description: Register a new user

Body: { name, email, password }

POST /api/auth/login

Description: Login user & get Token

Body: { email, password }

Reports

POST /api/reports/upload

Description: Upload a file

Body: FormData with file, title, type

GET /api/reports

Description: Get all my reports

Vitals

POST /api/vitals/add

Description: Log a health vital

Body: { vital_type, value, unit }

GET /api/vitals

Description: Get vitals history for graph

Sharing

POST /api/share/grant

Description: Share a specific report with another user

Body: { email, report_id }

GET /api/share/shared-with-me

Description: Get a list of reports shared with me by others

🏗️ Project Structure

Digital-Health-Wallet/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Dashboard, Login, Vitals, etc.
│   │   ├── App.js          # Main Router
│   │   └── index.js
├── server/                 # Node.js Backend
│   ├── routes/             # API Routes (auth, reports, vitals, share)
│   ├── uploads/            # Storage for uploaded files
│   ├── database.js         # SQLite connection & schema
│   ├── index.js            # Server entry point
│   └── health-wallet.db    # SQLite Database file (auto-generated)
└── README.md


🔐 Security Considerations

Passwords: Stored as hashes using bcryptjs (never plain text).

Tokens: API routes are protected using JWT verification middleware.

File Access: Files are served statically but access logic is controlled via the dashboard.

Validation: Basic checks to ensure users cannot share reports with themselves or access unauthorized data.

Author

Rahul Kaja