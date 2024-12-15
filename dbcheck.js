const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./weatherdata.db');

const query = `SELECT * FROM weatherdata ORDER BY Time DESC LIMIT 25`;

db.all(query, [], (err, rows) => {
    if (err) {
        console.error('Error retrieving data:', err.message);
    } else {
        console.log(rows);
    }
});