const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Controlador de platillos conectado a la base de datos.');
    }
});

// Crear un nuevo platillo
const createDish = (req, res) => {
    const { name, description } = req.body;

    db.run(`INSERT INTO dishes (name, description) VALUES (?, ?)`,
        [name, description], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                name,
                description
            });
        });
};

// Crear un nuevo ingrediente
const createIngredient = (req, res) => {
    const { name } = req.body;

    db.run(`INSERT INTO ingredients (name) VALUES (?)`,
        [name], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                name
            });
        });
};

// Asociar ingredientes con platillo
const addIngredientToDish = (req, res) => {
    const { dish_id, ingredient_id, quantity } = req.body;

    db.run(`INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity) 
            VALUES (?, ?, ?)`,
        [dish_id, ingredient_id, quantity], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                dish_id,
                ingredient_id,
                quantity
            });
        });
};

// Obtener todos los platillos
const getAllDishes = (req, res) => {
    db.all(`SELECT * FROM dishes`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Obtener todos los ingredientes
const getAllIngredients = (req, res) => {
    db.all(`SELECT * FROM ingredients`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Obtener ingredientes de un platillo específico
const getIngredientsByDish = (req, res) => {
    const { dish_id } = req.params;

    db.all(`SELECT ingredients.name, dish_ingredients.quantity 
            FROM dish_ingredients
            JOIN ingredients ON dish_ingredients.ingredient_id = ingredients.id
            WHERE dish_ingredients.dish_id = ?`, [dish_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Exportar las funciones
module.exports = {
    createDish,
    createIngredient,
    addIngredientToDish,
    getAllDishes,
    getAllIngredients,
    getIngredientsByDish
};
