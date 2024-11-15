const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController.js');
const loginController = require('../controllers/loginController.js');
const dishController = require('../controllers/dishController.js');
const doctorController = require('../controllers/doctorController.js');
const dietController = require('../controllers/dietController.js');
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

// Rutas para doctores (protegidas)
router.post('/doctors/add', doctorController.createDoctor); // Crear un nuevo doctor
router.get('/doctors', authenticateToken, doctorController.getDoctors); // Obtener todos los doctores (info básica)
router.get('/doctors/details', authenticateToken, doctorController.getDoctorsWithDetails); // Obtener todos los doctores con detalles
router.put('/doctors/:id', authenticateToken, doctorController.updateDoctor); // Actualizar un doctor por ID
router.delete('/doctors/:id', authenticateToken, doctorController.deleteDoctor); // Eliminar un doctor por ID

// Rutas para dietas (protegidas)
router.post('/diets/add', authenticateToken, dietController.createDiet); // Crear una nueva dieta
router.get('/diets/:patient_id/:doctor_id/active', authenticateToken, dietController.getActiveDietsForPatient); // Obtener dietas activas de un paciente asignadas a un doctor específico
router.get('/diets/:patient_id/:doctor_id/all', authenticateToken, dietController.getAllDietsForPatient); // Obtener todas las dietas de un paciente asignadas a un doctor específico
router.get('/diets/:doctor_id/active', authenticateToken, dietController.getActiveDietsForDoctor); // Obtener todas las dietas activas de un doctor
router.put('/diets/:id', authenticateToken, dietController.updateDiet); // Actualizar una dieta por ID
router.delete('/diets/:id', authenticateToken, dietController.deleteDiet); // Eliminar una dieta por ID

// Exportar las rutas
module.exports = router;
