const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./orders.db');

db.serialize(() => {
    db.run(`CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderName TEXT,
        mailLocation TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Route to save order data
app.post('/save-order', (req, res) => {
    const { orderName, mailLocation, data } = req.body;
    const jsonData = JSON.stringify(data);

    db.run(`INSERT INTO orders (orderName, mailLocation, data) VALUES (?, ?, ?)`, [orderName, mailLocation, jsonData], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route to get all orders
app.get('/orders', (req, res) => {
    db.all(`SELECT * FROM orders`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ orders: rows });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
