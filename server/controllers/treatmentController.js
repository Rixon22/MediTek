const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de tratamientos conectado a la base de datos.');
    }
});


// Crear un tratamiento
const createTreatment = (req, res) => {
    const { patient_id, doctor_id, description, start_date, end_date } = req.body;

    if (!patient_id || !doctor_id || !description || !start_date) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    db.run(
        `INSERT INTO treatments (patient_id, doctor_id, description, start_date, end_date) 
         VALUES (?, ?, ?, ?, ?)`,
        [patient_id, doctor_id, description, start_date, end_date],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                patient_id,
                doctor_id,
                description,
                start_date,
                end_date,
            });
        }
    );
};

// Obtener tratamientos por paciente
const getTreatmentsByPatient = (req, res) => {
    const { patient_id } = req.params;

    db.all(
        `SELECT t.*, d.first_name || ' ' || d.last_name AS doctor_name 
         FROM treatments t
         JOIN doctors d ON t.doctor_id = d.id
         WHERE t.patient_id = ?`,
        [patient_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
};

// Obtener tratamientos con medicamentos y detalles por paciente 
const getTreatmentsWithMedications = (req, res) => {
    const { patient_id } = req.params;

    db.all(
        `SELECT 
            t.id AS treatment_id, 
            t.description AS treatment_description, 
            t.start_date, 
            t.end_date, 
            d.first_name || ' ' || d.last_name AS doctor_name, 
            m.name AS medication_name, 
            tm.dose AS medication_dose, 
            tm.frequency AS medication_frequency
         FROM treatments t
         JOIN doctors d ON t.doctor_id = d.id
         LEFT JOIN treatment_medications tm ON t.id = tm.treatment_id
         LEFT JOIN medications m ON tm.medication_id = m.id
         WHERE t.patient_id = ?`,
        [patient_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
};

// Actualizar un tratamiento
const updateTreatment = (req, res) => {
    const { id } = req.params;
    const { description, start_date, end_date } = req.body;

    db.run(
        `UPDATE treatments SET description = ?, start_date = ?, end_date = ? 
         WHERE id = ?`,
        [description, start_date, end_date, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Tratamiento no encontrado" });
            }
            res.status(200).json({ message: "Tratamiento actualizado" });
        }
    );
};

// Eliminar un tratamiento
const deleteTreatment = (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM treatments WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Tratamiento no encontrado" });
        }
        res.status(200).json({ message: "Tratamiento eliminado" });
    });
};

module.exports = {
    createTreatment,
    getTreatmentsByPatient,
    updateTreatment,
    deleteTreatment,
    getTreatmentsWithMedications,
};