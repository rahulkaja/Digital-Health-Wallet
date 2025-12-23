// server/routes/share.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "health-wallet-secret-key"; 

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ error: "Failed to authenticate token" });
        req.userId = decoded.id; 
        next();
    });
};

// 1. SHARE A REPORT (POST)
router.post('/grant', verifyToken, (req, res) => {
    const { email, report_id } = req.body; // User types email, we find ID

    // First, find the user ID of the person we want to share with
    db.get(`SELECT id FROM users WHERE email = ?`, [email], (err, user) => {
        if (!user) return res.status(404).json({ error: "User with this email not found" });
        
        // Prevent sharing with yourself
        if (user.id === req.userId) return res.status(400).json({ error: "Cannot share with yourself" });

        // Insert permission record
        const sql = `INSERT INTO shared_access (owner_id, viewer_id, report_id) VALUES (?, ?, ?)`;
        db.run(sql, [req.userId, user.id, report_id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: `Report shared with ${email}!` });
        });
    });
});

// 2. GET REPORTS SHARED WITH ME (GET)
router.get('/shared-with-me', verifyToken, (req, res) => {
    // Join tables to get report details for reports shared with the logged-in user
    const sql = `
        SELECT r.*, u.name as owner_name 
        FROM reports r
        JOIN shared_access s ON r.id = s.report_id
        JOIN users u ON r.user_id = u.id
        WHERE s.viewer_id = ?
    `;
    
    db.all(sql, [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;