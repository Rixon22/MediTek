const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de dietas conectado a la base de datos.');
    }
});

// Crear una nueva dieta
const createDiet = (req, res) => {
    const { patient_id, doctor_id, description, start_date, end_date, time, dish_id } = req.body;

    // Verificar si los campos requeridos están presentes
    if (!patient_id || !doctor_id || !description || !start_date || !end_date) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    db.run(`INSERT INTO diets (patient_id, doctor_id, description, start_date, end_date, time, dish_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [patient_id, doctor_id, description, start_date, end_date, time, dish_id], function (err) {
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
                time,
                dish_id
            });
        });
};

// Obtener las dietas activas de un paciente asignadas a un doctor específico
const getActiveDietsForPatient = (req, res) => {
    const { patient_id, doctor_id } = req.params;

    db.all(`SELECT * FROM diets WHERE patient_id = ? AND doctor_id = ? AND is_active = 1`, [patient_id, doctor_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Obtener todas las dietas de un paciente asignadas a un doctor específico
const getAllDietsForPatient = (req, res) => {
    const { patient_id, doctor_id } = req.params;

    db.all(`SELECT * FROM diets WHERE patient_id = ? AND doctor_id = ?`, [patient_id, doctor_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Obtener todas las dietas activas de un doctor
const getActiveDietsForDoctor = (req, res) => {
    const { doctor_id } = req.params;

    db.all(`SELECT * FROM diets WHERE doctor_id = ? AND is_active = 1`, [doctor_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Editar una dieta (actualizar detalles, pero no paciente ni doctor)
const updateDiet = (req, res) => {
    const { diet_id } = req.params;
    const { description, start_date, end_date, time, dish_id, is_active } = req.body;

    // Actualizamos solo los campos que pueden cambiar, sin modificar paciente ni doctor
    db.run(`UPDATE diets SET description = ?, start_date = ?, end_date = ?, time = ?, dish_id = ?, is_active = ? 
            WHERE id = ?`,
        [description, start_date, end_date, time, dish_id, is_active, diet_id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Dieta no encontrada" });
            }
            res.status(200).json({
                message: 'Dieta actualizada',
                diet_id
            });
        });
};

// Eliminar una dieta
const deleteDiet = (req, res) => {
    const { diet_id } = req.params;

    db.run(`DELETE FROM diets WHERE id = ?`, [diet_id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Dieta no encontrada" });
        }
        res.status(200).json({
            message: 'Dieta eliminada',
            diet_id
        });
    });
};

// Exportar las funciones
module.exports = {
    createDiet,
    getActiveDietsForPatient,
    getAllDietsForPatient,
    getActiveDietsForDoctor,
    updateDiet,
    deleteDiet
};
