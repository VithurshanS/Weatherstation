const express = require('express');
//const mysql = require('mysql2');
const cors = require('cors');
//const db = require('./database')
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./weatherdata.db');

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
    const localDate = currentDate.toISOString().slice(0, 10);
    const localTime = currentDate.toTimeString().slice(0, 8);
    console.log(`Temperature: ${temperature}°C, Humidity: ${humidity}%, Time: ${localTime}`);

    const query = `INSERT INTO weatherdata (Date, Time, Tempreature, Humidity) VALUES (?, ?, ?, ?)`;

    db.run(query, [localDate, localTime, temperature, humidity], function (err) {
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

    db.all(query, [], (err, rows) => {
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
