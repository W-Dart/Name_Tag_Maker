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
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'", (err, row) => {
        if (err) {
            console.error('Error checking for table existence:', err.message);
            return;
        }

        if (row === undefined) {
            // Table doesn't exist, so create it
            db.run(`CREATE TABLE orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                orderName TEXT,
                mailLocation TEXT,
                data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'new'
            )`, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log('Orders table created successfully.');
                }
            });
        } else {
            console.log('Orders table already exists.');
        }
    });
});

// Route to save order data
app.post('/save-order', (req, res) => {
    const { orderName, mailLocation, data, status = 'new' } = req.body;
    const jsonData = JSON.stringify(data);

    db.run(`INSERT INTO orders (orderName, mailLocation, data, status) VALUES (?, ?, ?, ?)`, [orderName, mailLocation, jsonData, status], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route to update order status
app.put('/update-order/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const correctStatuses = ['new', 'in progress', 'completed'];
    if (!correctStatuses.includes(status)) {
        return res.status(400).json({ error: 'Incorrect status' });
    }

    db.run(`UPDATE orders SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ updated: this.changes });
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
