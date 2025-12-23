// server/routes/vitals.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "health-wallet-secret-key"; 

// Middleware to verify user
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ error: "Failed to authenticate token" });
        req.userId = decoded.id; 
        next();
    });
};

// 1. ADD VITAL LOG (POST)
router.post('/add', verifyToken, (req, res) => {
    const { vital_type, value, unit } = req.body;
    
    // Example: vital_type="Heart Rate", value=72, unit="bpm"
    const sql = `INSERT INTO vitals (user_id, vital_type, value, unit) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [req.userId, vital_type, value, unit], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Vital logged successfully!" });
    });
});

// 2. GET VITALS HISTORY (GET)
router.get('/', verifyToken, (req, res) => {
    // Get all logs for this user, sorted by oldest to newest (for the graph)
    const sql = `SELECT * FROM vitals WHERE user_id = ? ORDER BY logged_at ASC`;
    
    db.all(sql, [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;