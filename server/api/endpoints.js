const express = require('express');
const router = express.Router();

const { testController } = require('../controllers/testController');

router.get('/test', testController); // Ruta para obtener un registro de la tabla "test" de Airtable

module.exports = router;