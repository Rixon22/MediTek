const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController.js');
const loginController = require('../controllers/loginController.js');
const dishController = require('../controllers/dishController.js');
const doctorController = require('../controllers/doctorController.js');
const authenticateToken = require('../middleware/authMiddleware'); // Middleware de autenticación

// Rutas para login
router.post('/login', loginController.generalLogin); // Login general para pacientes y doctores

// Rutas para pacientes (protegidas)
router.post('/patients/add', patientController.createPatient); // Crear un nuevo paciente
router.get('/patients', authenticateToken, patientController.getPatients); // Obtener todos los pacientes (info básica)
router.post('/patients/details', authenticateToken, patientController.getPatientDetails); // Obtener detalles de un paciente específico
router.put('/patients/:id', authenticateToken, patientController.updatePatient); // Actualizar un paciente por ID
router.delete('/patients/:id', authenticateToken, patientController.deletePatient); // Eliminar un paciente por ID
router.post('/patients/doctor', authenticateToken, patientController.getPatientsByDoctor); // Obtener todos los pacientes de un doctor específico

// Rutas para platillos (protegidas)
router.post('/dishes/add', authenticateToken, dishController.createDish); // Crear un nuevo platillo
router.get('/dishes', authenticateToken, dishController.getAllDishes); // Obtener todos los platillos
router.get('/dishes/:id/ingredients', authenticateToken, dishController.getIngredientsByDish); // Obtener ingredientes de un platillo específico

// Rutas para ingredientes (protegidas)
router.post('/ingredients', authenticateToken, dishController.createIngredient); // Crear un nuevo ingrediente
router.get('/ingredients', authenticateToken, dishController.getAllIngredients); // Obtener todos los ingredientes

// Rutas para relaciones de platillo-ingrediente (protegidas)
router.post('/dish_ingredients', authenticateToken, dishController.addIngredientToDish); // Asociar un ingrediente a un platillo

// Rutas para doctores (protegidas)
router.post('/doctors/add', doctorController.createDoctor); // Crear un nuevo doctor
router.get('/doctors', authenticateToken, doctorController.getDoctors); // Obtener todos los doctores (info básica)
router.get('/doctors/details', authenticateToken, doctorController.getDoctorsWithDetails); // Obtener todos los doctores con detalles
router.put('/doctors/:id', authenticateToken, doctorController.updateDoctor); // Actualizar un doctor por ID
router.delete('/doctors/:id', authenticateToken, doctorController.deleteDoctor); // Eliminar un doctor por ID

// Exportar las rutas
module.exports = router;
