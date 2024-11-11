const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController.js');
const loginController = require('../controllers/loginController.js');
const dishController = require('../controllers/dishController.js');
const doctorController = require('../controllers/doctorController.js');

// Routes for login
router.post('/login', loginController.generalLogin);                  // General login for patients and doctors

// Routes for patients
router.post('/patients', patientController.createPatient);             // Create a new patient
router.get('/patients', patientController.getPatients);                // Get all patients (basic info)
router.get('/patients/details', patientController.getPatientsWithDetails);  // Get patients with all details
router.put('/patients/:id', patientController.updatePatient);          // Update a patient by ID
router.delete('/patients/:id', patientController.deletePatient);       // Delete a patient by ID

// Routes for dishes
router.post('/dishes', dishController.createDish);                     // Create a new dish
router.get('/dishes', dishController.getAllDishes);                     // Get all dishes
router.get('/dishes/:id/ingredients', dishController.getIngredientsByDish); // Get ingredients of a specific dish

// Routes for ingredients
router.post('/ingredients', dishController.createIngredient);           // Create a new ingredient
router.get('/ingredients', dishController.getAllIngredients);           // Get all ingredients

// Routes for dish-ingredient relationships
router.post('/dish_ingredients', dishController.addIngredientToDish);   // Associate an ingredient to a dish

// Routes for doctors
router.post('/doctors', doctorController.createDoctor);                 // Create a new doctor
router.get('/doctors', doctorController.getDoctors);                    // Get all doctors (basic info)
router.get('/doctors', doctorController.getDoctorsWithDetails);         // Get all doctors with details
router.put('/doctors/:id', doctorController.updateDoctor);              // Update a doctor by ID
router.delete('/doctors/:id', doctorController.deleteDoctor);           // Delete a doctor by ID


// Export the routes
module.exports = router;
