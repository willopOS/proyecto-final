const express = require('express');
const router = express.Router();
const { getVehicles, createVehicle } = require('../controllers/vehicleController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Ruta pública: cualquiera puede consultar los vehículos
router.get('/', getVehicles);

console.log({ verifyToken, isAdmin, createVehicle });

// Ruta protegida: requiere inicio de sesión Y rol de administrador
router.post('/', verifyToken, isAdmin, createVehicle);

module.exports = router;

