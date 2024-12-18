const mysql = require('mysql2');

// Create a connection pool
const db = mysql.createPool({
    host: 'sql12.freesqldatabase.com',       // Replace with your MySQL host (e.g., 'localhost' or IP address)
    user: 'sql12752883',            // Replace with your MySQL username
    password: 'iqdlkfT34R',    // Replace with your MySQL password
    database: 'sql12752883'  // Replace with your database name
});

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database!');
    connection.release();
});

module.exports = db;
