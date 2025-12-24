// index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Use body-parser to parse JSON requests
app.use(bodyParser.json());

// In-memory "database" for demo purposes
let users = [];

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
    }

    // Save user
    users.push({ username, password });
    return res.status(201).json({ message: "Signup successful!" });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    return res.status(200).json({ message: "Login successful!" });
});

// Homepage endpoint
app.get('/home', (req, res) => {
    return res.status(200).json({ message: "Welcome to HaqPay homepage!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
