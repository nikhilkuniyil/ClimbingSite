const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'climbing-tracker.db'), (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create the 'climbs' table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS climbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      location TEXT,
      elevation INTEGER,
      miles REAL
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err);
      } else {
        console.log('Climbs table created or already exists');
      }
    });
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello from the Climbing Tracker backend!');
});

// Example API route to get climbs
app.get('/climbs', (req, res) => {
  db.all('SELECT * FROM climbs', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

// Example API route to add a new climb
app.post('/climbs', (req, res) => {
  const { date, location, elevation } = req.body;
  const query = `INSERT INTO climbs (date, location, elevation, miles) VALUES (?, ?, ?)`;
  db.run(query, [date, location, elevation], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: { id: this.lastID, date, location, elevation, miles },
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
