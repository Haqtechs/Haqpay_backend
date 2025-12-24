// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to PostgreSQL using your DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // needed for Render
});

// Create users table if it doesn't exist
pool.query(`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);
`).catch(err => console.error(err));

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required." });

    try {
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, password]
        );
        res.status(201).json({ message: "Signup successful!", user: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') res.status(400).json({ message: "User already exists." });
        else res.status(500).json({ message: "Server error." });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username=$1 AND password=$2",
            [username, password]
        );
        if (result.rows.length === 0) res.status(401).json({ message: "Invalid username or password." });
        else res.status(200).json({ message: "Login successful!", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

// Homepage
app.get('/home', (req, res) => {
    res.status(200).json({ message: "Welcome to HaqPay homepage!" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
