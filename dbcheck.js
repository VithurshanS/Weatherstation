const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./weatherdata.db');

const query = `SELECT AVG(Humidity),AVG(Tempreature) FROM weatherdata group by date`;

db.all(query, [], (err, rows) => {
    if (err) {
        console.error('Error retrieving data:', err.message);
    } else {
        console.log(rows);
    }
});