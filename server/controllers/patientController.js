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

        // Validar correo electrónico único
        db.get(`SELECT id FROM patients WHERE email = ?`, [email], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) {
                return res.status(400).json({ message: 'Correo electrónico ya registrado' });
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
    });
};

// Obtener los detalles de un paciente por ID usando POST
const getPatientDetails = (req, res) => {
    const { patient_id } = req.body;  // Obtener patient_id del cuerpo de la solicitud
    const query = `
        SELECT 
            patients.id, 
            patients.first_name, 
            patients.last_name, 
            patients.birth_date, 
            patients.email, 
            patients.phone,
            patients.CURP,
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
        WHERE 
            patients.id = ?  -- Condición para filtrar por ID
        GROUP BY 
            patients.id
    `;

    db.get(query, [patient_id], (err, row) => {  // db.get para obtener un solo registro
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        res.json(row);
    });
};


// Obtener todos los pacientes
const getPatients = (req, res) => {
    db.all("SELECT * FROM patients", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};


// Obtener todos los pacientes conectados a un médico
const getPatientsByDoctor = (req, res) => {
    const { doctor_id } = req.body;
    const query = `
        SELECT 
            patients.id, 
            patients.first_name, 
            patients.last_name, 
            patients.birth_date, 
            patients.email, 
            patients.phone,
            patients.CURP
        FROM 
            patients
        JOIN 
            patient_doctor ON patients.id = patient_doctor.patient_id
        WHERE 
            patient_doctor.doctor_id = ?
    `;

    db.all(query, [doctor_id], (err, rows) => {
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

// Obtener a un paciente por ID con todos sus detalles
const getPatientDetailsById = (req, res) => {
    const { patient_id } = req.params;
    const query = `
        SELECT 
            patients.id, 
            patients.first_name, 
            patients.last_name, 
            patients.birth_date, 
            patients.email, 
            patients.phone,
            patients.CURP,
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
        WHERE 
            patients.id = ?
        GROUP BY 
            patients.id
    `;

    db.get(query, [patient_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        res.json(row);
    });
};

// Exportar las funciones del controlador
module.exports = {
    createPatient,
    getPatientDetails,
    updatePatient,
    deletePatient,
    getPatients,
    getPatientsByDoctor,
    getPatientDetailsById
};
