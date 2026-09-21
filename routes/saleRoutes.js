const express = require('express');
const router = express.Router();
const { getSales, createSale, updateSale, deleteSale } = require('../controllers/saleController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Consultar todas las ventas (requiere sesión iniciada)
router.get('/', verifyToken, getSales);

// Registrar una nueva venta (solo administradores)
router.post('/', verifyToken, isAdmin, createSale);

// Actualizar una venta (solo administradores)
router.put('/:id', verifyToken, isAdmin, updateSale);

// Eliminar una venta (solo administradores)
router.delete('/:id', verifyToken, isAdmin, deleteSale);

module.exports = router;
