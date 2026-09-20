const express = require('express');
const router = express.Router();
const {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Ruta pública: cualquiera puede consultar los vehículos
router.get('/', getVehicles);

// Ruta protegida: requiere inicio de sesión Y rol de administrador
router.post('/', verifyToken, isAdmin, createVehicle);
router.put('/:id', verifyToken, isAdmin, updateVehicle);
router.delete('/:id', verifyToken, isAdmin, deleteVehicle);

module.exports = router;
