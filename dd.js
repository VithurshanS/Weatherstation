const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./weatherdata.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create the "weatherdata" table
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS weatherdata (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Date TEXT DEFAULT (DATE('now')),
        Time TEXT DEFAULT (TIME('now')),
        Tempreature REAL,
        Humidity REAL
    )
`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Table "weatherdata" created successfully.');
    }
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
