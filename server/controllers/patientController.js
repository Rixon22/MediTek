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
    const { name, birth_date, email, phone, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err.message });

        db.run(`INSERT INTO patients (name, birth_date, email, phone, password) VALUES (?, ?, ?, ?, ?)`, 
            [name, birth_date, email, phone, hash], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID, name, birth_date, email, phone });
            });
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
    const { name, birth_date, email, phone } = req.body;
    db.run(`UPDATE patients SET name = ?, birth_date = ?, email = ?, phone = ? WHERE id = ?`, 
        [name, birth_date, email, phone, id], function (err) {
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
    getPatients,
    updatePatient,
    deletePatient,
    loginPatient,
};
