// Example using Express.js
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON en las solicitudes


// Example defining a route in Express
app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

// Include route files
const patientsRoutesHandler = require('./routes/patients');
const turnsRouteHandler = require('./routes/medical-dates');

// Use routes
app.use('/patients', patientsRoutesHandler);
app.use('/medical-dates', turnsRouteHandler);

// Example specifying the port and starting the server
const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});