const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController.js');
const loginController = require('../controllers/loginController.js');
const dishController = require('../controllers/dishController.js');
const doctorController = require('../controllers/doctorController.js');
const dietController = require('../controllers/dietController.js');
const treatmentController = require('../controllers/treatmentController.js');
const treatmentMedicationController = require('../controllers/treatmentMedicationController.js');
const medicationController = require('../controllers/medicationController.js');
const appointmentsController = require('../controllers/appointmentsController.js');
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
router.get('/patient/detail/:patient_id', authenticateToken, patientController.getPatientDetailsById); // Obtener todos los pacientes de un doctor específico por ID

// Rutas para doctores (protegidas)
router.post('/doctors/add', doctorController.createDoctor); // Crear un nuevo doctor
router.get('/doctors', authenticateToken, doctorController.getDoctors); // Obtener todos los doctores (info básica)
router.get('/doctors/details', authenticateToken, doctorController.getDoctorsWithDetails); // Obtener todos los doctores con detalles
router.put('/doctors/:id', authenticateToken, doctorController.updateDoctor); // Actualizar un doctor por ID
router.delete('/doctors/:id', authenticateToken, doctorController.deleteDoctor); // Eliminar un doctor por ID

// TABLAS QUE INTERACTUAN CON DIETAS 

// Rutas para dietas (protegidas)
router.post('/diets/add', authenticateToken, dietController.createDiet); // Crear una nueva dieta
router.get('/diets/:patient_id/:doctor_id/active', authenticateToken, dietController.getActiveDietsForPatient); // Obtener dietas activas de un paciente asignadas a un doctor específico
router.get('/diets/active/:patient_id', authenticateToken, dietController.getAllDietsForPatient); // Obtener todas las dietas de un paciente activas
router.get('/diets/:doctor_id/active', authenticateToken, dietController.getActiveDietsForDoctor); // Obtener todas las dietas activas de un doctor
router.put('/diets/:id', authenticateToken, dietController.updateDiet); // Actualizar una dieta por ID
router.delete('/diets/:id', authenticateToken, dietController.deleteDiet); // Eliminar una dieta por ID
router.get('/diets/details/:diet_id', authenticateToken, dietController.getDietDetails); // Obtener detalles de una dieta (incluyendo sus tablas relacionadas)

// TABLAS QUE INTERACTUAN CON TRATAMIENTOS

// Rutas para tratamientos (protegidas)
router.post('/treatments/add', authenticateToken, treatmentController.createTreatment); // Crear un nuevo tratamiento
router.get('/treatments/:patient_id', authenticateToken, treatmentController.getTreatmentsByPatient); // Obtener tratamientos por paciente
router.get('/treatments/details/:patient_id', authenticateToken, treatmentController.getTreatmentsWithMedications); // Obtener tratamientos con medicamentos y detalles por paciente
router.put('/treatments/:id', authenticateToken, treatmentController.updateTreatment); // Actualizar un tratamiento por ID
router.delete('/treatments/:id', authenticateToken, treatmentController.deleteTreatment); // Eliminar un tratamiento por ID
router.get('/treatments/details/view/:treatment_id', authenticateToken, treatmentController.getTreatmentDetailedById); // Obtener detalles de un tratamiento (incluyendo sus tablas relacionadas)

// Rutas para medicamentos de tratamientos (protegidas)
router.post('/treatment-medications/add', authenticateToken, treatmentMedicationController.createTreatmentMedication); // Crear un nuevo medicamento de tratamiento
router.post('/treatment-medications/add-treatment-with-medications', authenticateToken, treatmentMedicationController.createTreatmentWithMedications); // Crear un tratamiento con medicamentos
router.get('/treatment-medications/:treatment_id', authenticateToken, treatmentMedicationController.getMedicationsByTreatment); // Obtener medicamentos de un tratamiento
router.put('/treatment-medications/:id', authenticateToken, treatmentMedicationController.updateTreatmentMedication); // Actualizar un medicamento de tratamiento por ID
router.delete('/treatment-medications/:id', authenticateToken, treatmentMedicationController.deleteTreatmentMedication); // Eliminar un medicamento de tratamiento por ID

// Rutas para medicamentos (protegidas)
router.post('/medications/add', authenticateToken, medicationController.createMedication); // Crear un nuevo medicamento
router.get('/medications', authenticateToken, medicationController.getAllMedications); // Obtener todos los medicamentos
router.get('/medications/:id', authenticateToken, medicationController.getMedicationById); // Obtener un medicamento por ID
router.put('/medications/:id', authenticateToken, medicationController.updateMedication); // Actualizar un medicamento por ID

// Rutas para citas (protegidas)
router.get('/appointments/:patient_id', authenticateToken, appointmentsController.getAppointmentsByPatient); // Obtener citas por paciente
router.post('/appointments/add', authenticateToken, appointmentsController.createAppointment); // Crear una nueva cita
router.get('/appointments/details/:appointment_id', authenticateToken, appointmentsController.getAppointmentDetailsById); // Obtener detalles de una cita

// Exportar las rutas
module.exports = router;
