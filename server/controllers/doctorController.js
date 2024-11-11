const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de doctores conectado a la base de datos.');
    }
});

// Crear un nuevo doctor
const createDoctor = (req, res) => {
    const { first_name, last_name, specialty_id, email, phone, password, clinic_id, consulting_room } = req.body;

    // Validar email único
    db.get(`SELECT id FROM doctors WHERE email = ?`, [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ message: 'Email ya registrado' });
        }

        // Hash de la contraseña
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: err.message });

            // Insertar nuevo doctor
            db.run(`INSERT INTO doctors (first_name, last_name, specialty_id, email, phone, password, clinic_id, consulting_room) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [first_name, last_name, specialty_id, email, phone, hash, clinic_id, consulting_room], function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ id: this.lastID, first_name, last_name, specialty_id, email, phone, clinic_id, consulting_room });
                });
        });
    });
};

// Obtener todos los doctores con detalles
const getDoctorsWithDetails = (req, res) => {
    const query = `
        SELECT 
            doctors.id, 
            doctors.first_name, 
            doctors.last_name, 
            doctors.email, 
            doctors.phone,
            clinics.name AS clinic_name,
            clinics.address AS clinic_address,
            specialties.name AS specialty
        FROM 
            doctors
        LEFT JOIN 
            clinics ON doctors.clinic_id = clinics.id
        LEFT JOIN 
            specialties ON doctors.specialty_id = specialties.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Obtener todos los doctores
const getDoctors = (req, res) => {
    console.log('Obteniendo doctores...');
    db.all("SELECT * FROM doctors", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Actualizar doctor por ID
const updateDoctor = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, specialty_id, email, phone, clinic_id, consulting_room } = req.body;

    // Validar email único
    db.get(`SELECT id FROM doctors WHERE email = ? AND id != ?`, [email, id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ message: 'Email ya registrado' });
        }

        // Actualizar doctor
        db.run(`UPDATE doctors SET first_name = ?, last_name = ?, specialty_id = ?, email = ?, phone = ?, clinic_id = ?, consulting_room = ? WHERE id = ?`,
            [first_name, last_name, specialty_id, email, phone, clinic_id, consulting_room, id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: `Doctor con ID ${id} actualizado` });
            });
    });
};

// Eliminar doctor por ID
const deleteDoctor = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM doctors WHERE id = ?`, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Doctor con ID ${id} eliminado` });
    });
};

// Exportar las funciones del controlador
module.exports = {
    createDoctor,
    getDoctorsWithDetails,
    updateDoctor,
    deleteDoctor,
    getDoctors
};
