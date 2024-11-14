const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    // Verificar si el token está presente y con el prefijo "Bearer"
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado o formato incorrecto' });
    }

    // Extraer el token sin el prefijo "Bearer "
    const actualToken = token.split(' ')[1];

    // Verificar el token
    jwt.verify(actualToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido' });
        }

        // Agregar la información del usuario al request
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
