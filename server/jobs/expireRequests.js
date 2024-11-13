const cron = require('node-cron');
const sqlite3 = require('sqlite3').verbose();
const dbPath = require('../db/dbConfig.js');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Tarea de expiración de solicitudes conectada a la base de datos.');
    }
});

function getExpiredStatusId() {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM request_status WHERE status = 'expired'`, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row?.id);
            }
        });
    });
}

const cronJob = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const now = new Date();
            const expiredStatusId = await getExpiredStatusId();

            if (expiredStatusId) {
                const query = `
                    UPDATE connection_requests
                    SET status_id = ?
                    WHERE expiration_date < ? AND status_id = (
                        SELECT id FROM request_status WHERE status = 'pending'
                    );
                `;
                db.run(query, [expiredStatusId, now], function (err) {
                    if (err) {
                        console.error('Error actualizando solicitudes expiradas:', err.message);
                    } else {
                        console.log('Solicitudes expiradas actualizadas exitosamente');
                    }
                });
            } else {
                console.error('No se encontró el status_id para "expired"');
            }
        } catch (error) {
            console.error('Error en la tarea de expiración:', error);
        }
    });
};

module.exports = cronJob;
