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

// Función auxiliar para verificar usuario y generar token
const verifyUserAndGenerateToken = async (user, role, res) => {
    const token = jwt.sign({ id: user.id, email: user.email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login exitoso', role, id: user.id, token });
};

// Función para buscar en una tabla y comparar la contraseña
const findUserAndComparePassword = (email, password, tableName, role, res) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM ${tableName} WHERE email = ?`, [email], async (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                const match = await bcrypt.compare(password, row.password);
                if (match) {
                    resolve({ user: row, role });
                } else {
                    reject('Credenciales inválidas');
                }
            } else {
                reject('Credenciales inválidas');
            }
        });
    });
};

const generalLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar en la tabla de pacientes
        try {
            const { user, role } = await findUserAndComparePassword(email, password, 'patients', 'patient', res);
            return await verifyUserAndGenerateToken(user, role, res);
        } catch (error) {
            if (error !== 'Credenciales inválidas') {
                return res.status(500).json({ error: error.message });
            }
        }

        // Buscar en la tabla de doctores
        try {
            const { user, role } = await findUserAndComparePassword(email, password, 'doctors', 'doctor', res);
            return await verifyUserAndGenerateToken(user, role, res);
        } catch (error) {
            if (error !== 'Credenciales inválidas') {
                return res.status(500).json({ error: error.message });
            }
        }

        // Si no se encuentra en ninguna tabla
        return res.status(401).json({ message: 'Credenciales inválidas' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    generalLogin,
};
