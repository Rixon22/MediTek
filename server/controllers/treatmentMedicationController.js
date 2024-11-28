const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de medicamentos de tratamientos conectado a la base de datos.');
    }
});

// Crear un tratamiento con medicamentos
const createTreatmentWithMedications = (req, res) => {
    const { treatment, medications } = req.body;

    if (!treatment || !medications || !Array.isArray(medications)) {
        return res.status(400).json({ error: "Faltan campos obligatorios o el formato es incorrecto" });
    }

    const { patient_id, doctor_id, description, start_date, end_date } = treatment;

    // Validaciones de los campos obligatorios
    if (!patient_id || !doctor_id || !description || !start_date) {
        return res.status(400).json({ error: "Faltan campos obligatorios para el tratamiento" });
    }

    // Verificar que los tipos de datos sean correctos
    if (typeof patient_id !== "number" || typeof doctor_id !== "number" || typeof description !== "string" || typeof start_date !== "string" || typeof end_date !== "string") {
        return res.status(400).json({ error: "Tipos de datos incorrectos para el tratamiento" });
    }

    // Verificar que el paciente y el doctor existan (opcional, dependiendo de la lógica de negocio)
    db.get(`SELECT 1 FROM patients WHERE id = ?`, [patient_id], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ error: "Paciente no encontrado" });
        }

        db.get(`SELECT 1 FROM doctors WHERE id = ?`, [doctor_id], (err, row) => {
            if (err || !row) {
                return res.status(400).json({ error: "Doctor no encontrado" });
            }

            // Inicia una transacción para garantizar la consistencia
            db.run("BEGIN TRANSACTION");

            db.run(
                `INSERT INTO treatments (patient_id, doctor_id, description, start_date, end_date) 
                 VALUES (?, ?, ?, ?, ?)`,

                [patient_id, doctor_id, description, start_date, end_date],
                function (err) {
                    if (err) {
                        db.run("ROLLBACK");
                        return res.status(500).json({ error: err.message });
                    }

                    const treatmentId = this.lastID; // ID del tratamiento recién creado

                    const placeholders = medications.map(() => "(?, ?, ?, ?)").join(", ");
                    const values = medications.flatMap(({ medication_id, dose, frequency }) => [
                        treatmentId,
                        medication_id,
                        dose,
                        frequency,
                    ]);

                    db.run(
                        `INSERT INTO treatment_medications (treatment_id, medication_id, dose, frequency) 
                         VALUES ${placeholders}`,
                        values,
                        function (err) {
                            if (err) {
                                db.run("ROLLBACK");
                                return res.status(500).json({ error: err.message });
                            }

                            db.run("COMMIT");
                            res.status(201).json({
                                treatment_id: treatmentId,
                                treatment,
                                medications,
                            });
                        }
                    );
                }
            );
        });
    });
};


// Agregar medicamento a un tratamiento
const createTreatmentMedication = (req, res) => {
    const { treatment_id, medication_id, dose, frequency } = req.body;

    if (!treatment_id || !medication_id || !dose || !frequency) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    db.run(
        `INSERT INTO treatment_medications (treatment_id, medication_id, dose, frequency) 
         VALUES (?, ?, ?, ?)`,
        [treatment_id, medication_id, dose, frequency],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                treatment_id,
                medication_id,
                dose,
                frequency,
            });
        }
    );
};


// Obtener medicamentos asignados a un tratamiento
const getMedicationsByTreatment = (req, res) => {
    const { treatment_id } = req.params;

    db.all(
        `SELECT tm.*, m.name AS medication_name, m.description AS medication_description 
         FROM treatment_medications tm
         JOIN medications m ON tm.medication_id = m.id
         WHERE tm.treatment_id = ?`,
        [treatment_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
};

// Actualizar dosis y frecuencia de un medicamento
const updateTreatmentMedication = (req, res) => {
    const { treatment_id, medication_id } = req.params;
    const { dose, frequency } = req.body;

    db.run(
        `UPDATE treatment_medications SET dose = ?, frequency = ? 
         WHERE treatment_id = ? AND medication_id = ?`,
        [dose, frequency, treatment_id, medication_id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Asignación no encontrada" });
            }
            res.status(200).json({ message: "Asignación actualizada" });
        }
    );
};

// Eliminar un medicamento de un tratamiento
const deleteTreatmentMedication = (req, res) => {
    const { treatment_id, medication_id } = req.params;

    db.run(
        `DELETE FROM treatment_medications WHERE treatment_id = ? AND medication_id = ?`,
        [treatment_id, medication_id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Asignación no encontrada" });
            }
            res.status(200).json({ message: "Asignación eliminada" });
        }
    );
};

module.exports = {
    createTreatmentWithMedications,
    createTreatmentMedication,
    getMedicationsByTreatment,
    updateTreatmentMedication,
    deleteTreatmentMedication,
};