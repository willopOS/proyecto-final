const express = require('express');
const router = express.Router();
const { getSales, createSale } = require('../controllers/saleController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Consultar todas las ventas (requiere sesión iniciada)
router.get('/', verifyToken, getSales);

// Registrar una nueva venta (solo administradores) 👑
router.post('/', verifyToken, isAdmin, createSale);

module.exports = router;
