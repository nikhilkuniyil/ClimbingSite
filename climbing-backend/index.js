const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Use CORS to allow requests from different origins
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'climbing-tracker.db'), (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create the 'climbs' table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS climbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      date TEXT,
      peak TEXT,
      location TEXT,
      elevation INTEGER,
      miles REAL,
      image TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err);
      } else {
        console.log('Climbs table created or already exists');
        
        // Add the 'peak' column if it doesn't exist
        db.run(`ALTER TABLE climbs ADD COLUMN peak TEXT`, (err) => {
          if (err) {
            if (err.message.includes("duplicate column name")) {
              console.log("Column peak already exists.");
            } else {
              console.error('Error adding peak column:', err.message);
            }
          } else {
            console.log('Column peak added successfully.');
          }
        });
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

// API route to get climbs
app.get('/climbs', (req, res) => {
  const { userId } = req.query;
  db.all('SELECT * FROM climbs WHERE userId = ?', [userId], (err, rows) => {
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

// API route to add a new climb
app.post('/climbs', (req, res) => {
  const { date, peak, location, elevation, miles, image, userId } = req.body;

  // Log the received data
  console.log('Received payload:', req.body);

  const query = `INSERT INTO climbs (userId, date, peak, location, elevation, miles, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [userId, date, peak, location, elevation, miles, image], function (err) {
    if (err) {
      console.error('Database error:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: { id: this.lastID, userId, date, peak, location, elevation, miles, image },
    });
  });
});

// DELETE route to remove a climb by ID
app.delete('/climbs/:id', (req, res) => {
    const climbId = req.params.id;
    
    const query = `DELETE FROM climbs WHERE id = ?`;
    db.run(query, climbId, function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'Climb deleted successfully',
        data: this.changes // Number of rows affected
      });
    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
