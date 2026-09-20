const express = require('express');
const router = express.Router();
const { getVehicles } = require('../controllers/vehicleController');

// Ruta para obtener todos los vehículos: GET /api/vehicles
router.get('/', getVehicles);

module.exports = router;
