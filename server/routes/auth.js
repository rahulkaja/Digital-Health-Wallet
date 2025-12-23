// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating the "Access Card"
const db = require('../database');

const SECRET_KEY = "health-wallet-secret-key"; // In a real app, hide this in a .env file

// 1. REGISTER ROUTE
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;

    // Security: Hash the password (encrypt it) so even admins can't read it
    const hashedPassword = bcrypt.hashSync(password, 8);

    // SQL: Insert new user
    const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [name, email, hashedPassword, role || 'viewer'], function(err) {
        if (err) {
            // Error 19 usually means the email is already taken (UNIQUE constraint)
            if(err.errno === 19) return res.status(400).json({ error: "Email already exists" });
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User registered successfully!", userId: this.lastID });
    });
});

// 2. LOGIN ROUTE
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // SQL: Find user by email
    const sql = `SELECT * FROM users WHERE email = ?`;
    
    db.get(sql, [email], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Security: Compare the password sent with the hashed password in DB
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ error: "Invalid password" });

        // Generate Token (The "Access Card")
        // This token expires in 24 hours
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: 86400 });

        res.json({ auth: true, token: token, user: { id: user.id, name: user.name, role: user.role } });
    });
});

module.exports = router;