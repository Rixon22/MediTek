// index.js
const express = require('express');
const cors = require('cors');  // Import cors
const routes = require('./api/endpoints');

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS with specified options

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
 