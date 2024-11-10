const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de login conectado a la base de datos.');
    }
});

// Login general (para pacientes y doctores)
const generalLogin = (req, res) => {
    const { email, password } = req.body;

    // Primero, buscar en la tabla de pacientes
    db.get(`SELECT * FROM patients WHERE email = ?`, [email], (err, patient) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Si se encuentra un paciente, verificar la contraseña
        if (patient) {
            bcrypt.compare(password, patient.password, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (!result) {
                    return res.status(401).json({ message: 'Credenciales inválidas' });
                }

                // Generar un token JWT para paciente
                const token = jwt.sign({ id: patient.id, email: patient.email, role: 'patient' }, 'your_secret_key', { expiresIn: '1h' });
                return res.json({ message: 'Login exitoso', role: 'patient', token });
            });
        } else {
            // Si no es un paciente, buscar en la tabla de doctores
            db.get(`SELECT * FROM doctors WHERE email = ?`, [email], (err, doctor) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                // Si se encuentra un doctor, verificar la contraseña
                if (doctor) {
                    bcrypt.compare(password, doctor.password, (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        if (!result) {
                            return res.status(401).json({ message: 'Credenciales inválidas' });
                        }

                        // Generar un token JWT para doctor
                        const token = jwt.sign({ id: doctor.id, email: doctor.email, role: 'doctor' }, 'your_secret_key', { expiresIn: '1h' });
                        return res.json({ message: 'Login exitoso', role: 'doctor', token });
                    });
                } else {
                    return res.status(401).json({ message: 'Credenciales inválidas' });
                }
            });
        }
    });
};

module.exports = {
    generalLogin,
};
