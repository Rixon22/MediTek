const path = require('path');

// Definir la ruta del archivo de la base de datos
const dbPath = path.join(__dirname, 'meditek.db');

// Exportar la ruta
module.exports = dbPath;
