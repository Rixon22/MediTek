// index.js
const express = require('express');
const routes = require('./api/endpoints');

const app = express();
const PORT = 3001;

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas
app.use('/api', routes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
