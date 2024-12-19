const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const db = require('./database');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

let counr = 0;

// Endpoint to receive data
app.post('/sensor-data', (req, res) => {
    const { temperature, humidity } = req.body;

    if (temperature == null || humidity == null) {
        res.status(400).send('Temperature and Humidity are required.');
        return;
    }

    // Get the local date and time in Sri Lanka timezone
    const currentDate = new Date();

    const sriLankaDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(currentDate); // Format as YYYY-MM-DD

    const sriLankaTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(currentDate); // Format as HH:mm:ss

    console.log(`Temperature: ${temperature}°C, Humidity: ${humidity}%, Date: ${sriLankaDate}, Time: ${sriLankaTime}`);

    const query = `INSERT INTO weatherdata (Date, Time, Tempreature, Humidity) VALUES (?, ?, ?, ?)`;

    db.query(query, [sriLankaDate, sriLankaTime, temperature, humidity], function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            res.status(500).send('Error inserting data into the database');
            return;
        }
        counr++; // Increment the counter for each data point received.
        console.log(counr, 'Data inserted successfully!');
        res.send('Data received successfully!');
    });
});

// Endpoint to retrieve weather data
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
