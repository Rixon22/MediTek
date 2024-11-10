const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de pacientes conectado a la base de datos.');
    }
});

// Crear un nuevo paciente
const createPatient = (req, res) => {
    const { first_name, last_name, birth_date, email, phone, password, curp } = req.body;

    // Validar CURP único
    db.get(`SELECT id FROM patients WHERE curp = ?`, [curp], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ message: 'CURP ya registrado' });
        }

        // Hash de la contraseña
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: err.message });

            // Insertar nuevo paciente
            db.run(`INSERT INTO patients (first_name, last_name, birth_date, email, phone, password, curp) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [first_name, last_name, birth_date, email, phone, hash, curp], function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ id: this.lastID, first_name, last_name, birth_date, email, phone });
                });
        });
    });
};

// Obtener todos los pacientes con detalles
const getPatientsWithDetails = (req, res) => {
    const query = `
        SELECT 
            patients.id, 
            patients.first_name, 
            patients.last_name, 
            patients.birth_date, 
            patients.email, 
            patients.phone,
            GROUP_CONCAT(DISTINCT medical_conditions.name) AS conditions,
            GROUP_CONCAT(DISTINCT allergies.name) AS allergies,
            GROUP_CONCAT(DISTINCT treatments.description) AS treatments
        FROM 
            patients
        LEFT JOIN 
            patient_conditions ON patients.id = patient_conditions.patient_id
        LEFT JOIN 
            medical_conditions ON patient_conditions.condition_id = medical_conditions.id
        LEFT JOIN 
            patient_allergies ON patients.id = patient_allergies.patient_id
        LEFT JOIN 
            allergies ON patient_allergies.allergy_id = allergies.id
        LEFT JOIN 
            treatments ON patients.id = treatments.patient_id
        GROUP BY 
            patients.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Obtener todos los pacientes
const getPatients = (req, res) => {
    console.log('Obteniendo pacientes...');
    db.all("SELECT * FROM patients", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Actualizar paciente por ID
const updatePatient = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, birth_date, email, phone, curp } = req.body;

    // Validar CURP único
    db.get(`SELECT id FROM patients WHERE curp = ? AND id != ?`, [curp, id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ message: 'CURP ya registrado' });
        }

        // Actualizar paciente
        db.run(`UPDATE patients SET first_name = ?, last_name = ?, birth_date = ?, email = ?, phone = ?, curp = ? WHERE id = ?`,
            [first_name, last_name, birth_date, email, phone, curp, id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: `Paciente con ID ${id} actualizado` });
            });
    });
};

// Eliminar paciente por ID
const deletePatient = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM patients WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Paciente con ID ${id} eliminado` });
    });
};

// Exportar las funciones del controlador
module.exports = {
    createPatient,
    getPatientsWithDetails,
    updatePatient,
    deletePatient,
    getPatients
};
