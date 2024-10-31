const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos.');
    }
});

// Create a new patient
const createPatient = (req, res) => {
    const { first_name, last_name, birth_date, email, phone, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err.message });

        db.run(`INSERT INTO patients (first_name, last_name, birth_date, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)`, 
            [first_name, last_name, birth_date, email, phone, hash], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID, first_name, last_name, birth_date, email, phone });
            });
    });
};

// Get all patients with details
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

// Get all patients
const getPatients = (req, res) => {
    console.log('Getting patients...');
    db.all("SELECT * FROM patients", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Update a patient by ID
const updatePatient = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, birth_date, email, phone } = req.body;
    db.run(`UPDATE patients SET first_name = ?, last_name = ?, birth_date = ?, email = ?, phone = ? WHERE id = ?`, 
        [first_name, last_name, birth_date, email, phone, id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: `Patient with ID ${id} updated` });
        });
};

// Delete a patient by ID
const deletePatient = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM patients WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Patient with ID ${id} deleted` });
    });
};

// Login a patient
const loginPatient = (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM patients WHERE email = ?`, [email], (err, patient) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!patient) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored one
        bcrypt.compare(password, patient.password, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!result) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ id: patient.id, email: patient.email }, 'your_secret_key', { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        });
    });
};

// Export the controller functions
module.exports = {
    createPatient,
    getPatientsWithDetails,
    updatePatient,
    deletePatient,
    loginPatient,
    getPatients
};
