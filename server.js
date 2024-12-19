const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const db = require('./database')
const bodyParser = require('body-parser');
//const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database('./weatherdata.db');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());


// Enable CORS for all routes
app.use(cors());

counr = 0;

// Endpoint to receive data
/*app.post('/sensor-data', (req, res) => {
    const { temperature, humidity } = req.body;
    console.log(`Temperature: ${temperature}°C, Humidity: ${humidity}%`);
    const query = `INSERT INTO weatherdata (Tempreature,Humidity) VALUES (?,?)`;
    db.run(query, [temperature, humidity], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error inserting data into the database');
            return;
        }
    
        counr++; // Increment the counter for each data point received.
        console.log(counr,'Data inserted successfully!');
        res.send('Data received successfully!');
    })
});*/

app.post('/sensor-data', (req, res) => {
    const { temperature, humidity } = req.body;
    //console.log(req.body);

    if (temperature == null || humidity == null) {
        res.status(400).send('Temperature and Humidity are required.');
        return;
    }

    // Get the local date and time
    const currentDate = new Date();

    // Format date for Sri Lanka
    const sriLankaDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(currentDate);

    // Format time for Sri Lanka
    const sriLankaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(currentDate);
    const localDate = sriLankaDate.toISOString();
    const localTime = sriLankaTime.toTimeString();
    console.log(`Temperature: ${temperature}°C, Humidity: ${humidity}%, Time: ${localTime}`);

    const query = `INSERT INTO weatherdata (Date, Time, Tempreature, Humidity) VALUES (?, ?, ?, ?)`;

    db.query(query, [localDate, localTime, temperature, humidity], function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            res.status(500).send('Error inserting data into the database');
            return;
        }
        counr++; // Increment the counter for each data point received.
        console.log(counr,'Data inserted successfully!');
        //console.log(`Data point inserted successfully!`);
        res.send('Data received successfully!');
    });
});


app.get('/weatherdata', (req, res) => {
    const query = `SELECT * FROM weatherdata ORDER BY ID DESC`;

    db.query(query, (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            res.status(500).send('Error retrieving data');
        } else {
            res.json(rows);
        }
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
