const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js'); 

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos.');
    }
});

// Crear un nuevo paciente
const crearPaciente = (req, res) => {
    const { name, birth_date, email, phone } = req.body;
    db.run(`INSERT INTO patients (name, birth_date, email, phone) VALUES (?, ?, ?, ?)`, [name, birth_date, email, phone], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, birth_date, email, phone });
    });
};

// Obtener todos los pacientes
const obtenerPacientes = (req, res) => {
    console.log('Obteniendo pacientes...');
    db.all("SELECT * FROM patients", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Actualizar un paciente por ID
const actualizarPaciente = (req, res) => {
    const { id } = req.params;
    const { name, birth_date, email, phone } = req.body;
    db.run(`UPDATE patients SET name = ?, birth_date = ?, email = ?, phone = ? WHERE id = ?`, [name, birth_date, email, phone, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Paciente con ID ${id} actualizado` });
    });
};

// Eliminar un paciente por ID
const eliminarPaciente = (req, res) => {
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
    crearPaciente,
    obtenerPacientes,
    actualizarPaciente,
    eliminarPaciente,
};