const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');  // Asumiendo que tienes un archivo de configuración para la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de citas médicas conectado a la base de datos.');
    }
});

// Obtener las citas médicas de un paciente
const getAppointmentsByPatient = (req, res) => {
    const { patient_id } = req.params;  // Obtenemos el patient_id desde los parámetros de la URL

    // Consulta para obtener las citas médicas del paciente
    const query = `
        SELECT ma.id, ma.appointment_date, ma.reason, ma.location, d.first_name AS doctor_name, d.last_name AS doctor_last_name
        FROM medical_appointments ma
        JOIN doctors d ON ma.doctor_id = d.id
        WHERE ma.patient_id = ?
        ORDER BY ma.appointment_date DESC
    `;

    db.all(query, [patient_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Si no hay citas médicas, devolvemos un mensaje informando que no se encontraron citas
        if (rows.length === 0) {
            return res.status(200).json({ message: 'No se encontraron citas médicas para este paciente.' });
        }

        // Enviar las citas médicas
        res.status(200).json(rows);
    });
};


// Crear una nueva cita médica 
const createAppointment = (req, res) => {
    const { patient_id, doctor_id, appointment_date, reason, location } = req.body;

    // Verificar si los campos requeridos están presentes
    if (!patient_id || !doctor_id || !appointment_date || !reason || !location) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Verificar que los tipos de datos sean correctos
    if (typeof patient_id !== 'number' || typeof doctor_id !== 'number' || typeof appointment_date !== 'string' ||
        typeof reason !== 'string' || typeof location !== 'string') {
        return res.status(400).json({ error: "Tipos de datos incorrectos" });
    }

    db.run(`INSERT INTO medical_appointments (patient_id, doctor_id, appointment_date, reason, location) 
            VALUES (?, ?, ?, ?, ?)`,

        [patient_id, doctor_id, appointment_date, reason, location], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                patient_id,
                doctor_id,
                appointment_date,
                reason,
                location
            });
        });
};

// Exportar las funciones del controlador
module.exports = {
    getAppointmentsByPatient,
    createAppointment
};