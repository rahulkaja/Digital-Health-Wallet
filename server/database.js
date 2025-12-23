// server/database.js
const sqlite3 = require('sqlite3').verbose();

// 1. Connect to SQLite database
// It creates a file named 'health-wallet.db' if it doesn't exist
const db = new sqlite3.Database('./health-wallet.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // 2. Create Tables inside the database
        db.serialize(() => {
            
            // Table 1: Users (Stores login info)
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                role TEXT DEFAULT 'viewer'
            )`);

            // Table 2: Reports (Stores file paths and metadata)
            db.run(`CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT,
                type TEXT,
                file_path TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);

            // Table 3: Vitals (Stores health data)
            db.run(`CREATE TABLE IF NOT EXISTS vitals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                vital_type TEXT, 
                value REAL,
                unit TEXT,
                logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);

            // Table 4: Shared Access (Tracks who can see what)
            db.run(`CREATE TABLE IF NOT EXISTS shared_access (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                owner_id INTEGER,
                viewer_id INTEGER,
                report_id INTEGER,
                permission TEXT DEFAULT 'read',
                FOREIGN KEY (owner_id) REFERENCES users(id),
                FOREIGN KEY (viewer_id) REFERENCES users(id),
                FOREIGN KEY (report_id) REFERENCES reports(id)
            )`);
        });
    }
});

module.exports = db;