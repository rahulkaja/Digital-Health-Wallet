// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // <--- NEW: Needed to serve file paths
const db = require('./database'); 

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports'); // <--- NEW: Import reports
const vitalRoutes = require('./routes/vitals');
const shareRoutes = require('./routes/share');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// --- NEW: Make the 'uploads' folder public so we can view files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes); // <--- NEW: Use reports routes
app.use('/api/vitals', vitalRoutes);
app.use('/api/share', shareRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Health Wallet Backend is Running!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});