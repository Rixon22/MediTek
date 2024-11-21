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
            return res.status(404).json({ message: 'No se encontraron citas médicas para este paciente.' });
        }

        // Enviar las citas médicas
        res.status(200).json(rows);
    });
};

// Exportar las funciones del controlador
module.exports = {
    getAppointmentsByPatient,
};