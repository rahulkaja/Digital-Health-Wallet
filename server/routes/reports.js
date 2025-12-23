// server/routes/reports.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // Handles file uploads
const db = require('../database');
const path = require('path');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "health-wallet-secret-key"; 

// --- 1. SETUP FILE STORAGE ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure this folder exists in your server directory!
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Name the file: report-[timestamp].pdf to prevent duplicates
        cb(null, 'report-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- 2. MIDDLEWARE: VERIFY LOGIN ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ error: "Failed to authenticate token" });
        req.userId = decoded.id; 
        next();
    });
};

// --- 3. UPLOAD ROUTE (POST) ---
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
    const { title, type } = req.body;
    
    // Check if file was actually uploaded
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const file_path = req.file.filename; 

    const sql = `INSERT INTO reports (user_id, title, type, file_path) VALUES (?, ?, ?, ?)`;
    db.run(sql, [req.userId, title, type, file_path], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "File uploaded successfully!" });
    });
});

// --- 4. GET REPORTS ROUTE (GET) ---
router.get('/', verifyToken, (req, res) => {
    const sql = `SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(sql, [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;