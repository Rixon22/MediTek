const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de medicamentos conectado a la base de datos.');
    }
});

// Crear un nuevo medicamento
const createMedication = async (req, res) => {
    try {
      const { name, description } = req.body;
  
      if (!name || !description) {
        return res.status(400).json({ message: "El nombre y la descripción son obligatorios" });
      }
  
      const result = await db.run(
        `INSERT INTO medications (name, description) VALUES (?, ?)`,
        [name, description]
      );
  
      res.status(201).json({
        message: "Medicamento creado exitosamente",
        medication: { id: result.lastID, name, description },
      });
    } catch (error) {
      console.error("Error al crear medicamento:", error);
      res.status(500).json({ message: "Error al crear medicamento" });
    }
  };
  
  // Obtener todos los medicamentos
  const getAllMedications = async (req, res) => {
    try {
      const medications = await db.all(`SELECT * FROM medications`);
  
      res.status(200).json({ medications });
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      res.status(500).json({ message: "Error al obtener medicamentos" });
    }
  };
  
  // Obtener un medicamento por ID
  const getMedicationById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const medication = await db.get(`SELECT * FROM medications WHERE id = ?`, [id]);
  
      if (!medication) {
        return res.status(404).json({ message: "Medicamento no encontrado" });
      }
  
      res.status(200).json({ medication });
    } catch (error) {
      console.error("Error al obtener medicamento:", error);
      res.status(500).json({ message: "Error al obtener medicamento" });
    }
  };
  
  // Actualizar un medicamento
  const updateMedication = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
  
      const result = await db.run(
        `UPDATE medications SET name = ?, description = ? WHERE id = ?`,
        [name, description, id]
      );
  
      if (result.changes === 0) {
        return res.status(404).json({ message: "Medicamento no encontrado" });
      }
  
      res.status(200).json({ message: "Medicamento actualizado exitosamente" });
    } catch (error) {
      console.error("Error al actualizar medicamento:", error);
      res.status(500).json({ message: "Error al actualizar medicamento" });
    }
  };
  
  // Eliminar un medicamento
  const deleteMedication = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await db.run(`DELETE FROM medications WHERE id = ?`, [id]);
  
      if (result.changes === 0) {
        return res.status(404).json({ message: "Medicamento no encontrado" });
      }
  
      res.status(200).json({ message: "Medicamento eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar medicamento:", error);
      res.status(500).json({ message: "Error al eliminar medicamento" });
    }
  };
  
  module.exports = {
    createMedication,
    getAllMedications,
    getMedicationById,
    updateMedication,
    deleteMedication,
  };