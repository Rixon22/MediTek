const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController.js');

// Rutas para pacientes
router.post('/pacientes', patientController.crearPaciente);
router.get('/pacientes', patientController.obtenerPacientes);
router.put('/pacientes/:id', patientController.actualizarPaciente);
router.delete('/pacientes/:id', patientController.eliminarPaciente);

// Exportar las rutas
module.exports = router;
