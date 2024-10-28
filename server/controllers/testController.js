// Ejemplo de un controlador que trae un registro de la tabla "test" de Airtable
const axios = require('axios');
const { apiKey } = require('../models/bdAirtable.js'); // Importar la API key

const testController = async (req, res) => {
    // Crear la consulta GraphQL
    const query = `
      query MyQuery {
        test {
            name
        }
      }
    `;

    try {
        // Hacer la petición a Airtable
        const response = await axios({
            method: 'post',
            url: 'https://api.baseql.com/airtable/graphql/appll3HnDoeuDBZj3',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            data: {
                query
            }
        });

        // Responder con los datos obtenidos
        res.json(response.data);
        // Imprimir en consola los datos obtenidos
        console.log(response.data);
    } catch (error) {
        // Responder con un error
        console.error('Error fetching GraphQL data:', error.message);
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching GraphQL data' });    }
};

module.exports = {
    testController
};