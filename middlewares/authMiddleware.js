const jwt = require('jsonwebtoken');

// Verificar autenticación básica (estar logueado)
const verifyToken = (req, res, next) => {
    // Obtenemos la cabecera: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: se requiere un token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos { id, rol } en la petición
        next(); // Damos paso a la siguiente función
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

// Verificar permisos de administrador 🛡️
const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next(); // Es administrador, continúa
    } else {
        return res.status(403).json({ message: 'Acceso denegado: se requieren permisos de administrador' });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};
