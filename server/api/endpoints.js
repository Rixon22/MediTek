const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController.js');

// Routes for patients
router.post('/patients', patientController.createPatient);             // Create a new patient
router.get('/patients', patientController.getPatients);                // Get all patients
router.put('/patients/:id', patientController.updatePatient);         // Update a patient by ID
router.delete('/patients/:id', patientController.deletePatient);      // Delete a patient by ID
router.post('/patients/login', patientController.loginPatient);        // Login a patient

// Export the routes
module.exports = router;
