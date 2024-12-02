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
    // Verificar que los tipos de datos sean correctos
    if (typeof patient_id !== 'number' || typeof doctor_id !== 'number' || typeof description !== 'string' ||
        typeof start_date !== 'string' || typeof end_date !== 'string' || typeof time !== 'string' || typeof dish_id !== 'number') {
        return res.status(400).json({ error: "Tipos de datos incorrectos" });
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

// Obtener los detalles de una dieta (incluyendo sus tablas relacionadas)
const getDietDetails = (req, res) => {
    const { diet_id } = req.params;

    // Verificar que el id sea un número
    if (isNaN(diet_id)) {
        return res.status(400).json({ error: "ID de dieta inválido" });
    }

    db.get(` SELECT 
        d.id AS diet_id,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        doc.first_name AS doctor_first_name,
        doc.last_name AS doctor_last_name,
        d.description AS diet_description,
        d.start_date AS diet_start_date,
        d.end_date AS diet_end_date,
        d.time AS diet_time,
        dis.name AS dish_name,
        dis.description AS dish_description,
        ing.name AS ingredient_name,
        di.quantity AS ingredient_quantity
    FROM
        diets d
    JOIN
        patients p ON d.patient_id = p.id
    JOIN
        doctors doc ON d.doctor_id = doc.id
    JOIN
        dishes dis ON d.dish_id = dis.id
    JOIN
        dish_ingredients di ON dis.id = di.dish_id
    JOIN
        ingredients ing ON di.ingredient_id = ing.id
    WHERE
        d.id = ?`, [diet_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Dieta no encontrada" });
        }
        res.json(row);
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

// Obtener todas las dietas activas de un paciente con el nombre del platillo
const getAllDietsForPatient = (req, res) => {
    const { patient_id } = req.params;

    db.all(`
        SELECT 
            diets.id, 
            diets.patient_id, 
            diets.doctor_id, 
            diets.description, 
            diets.start_date, 
            diets.end_date, 
            diets.time, 
            diets.is_active, 
            dishes.name AS dish_name
        FROM diets
        JOIN dishes ON diets.dish_id = dishes.id
        WHERE diets.patient_id = ? AND diets.is_active = 1
    `, [patient_id], (err, rows) => {
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
    getAllDietsForPatient,  // Ahora correctamente cerrada
    getActiveDietsForDoctor,
    updateDiet,
    deleteDiet,
    getDietDetails
};