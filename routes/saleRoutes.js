const express = require('express');
const router = express.Router();
const { getSales } = require('../controllers/saleController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Ruta protegida: Solo accesible con un token válido
router.get('/', verifyToken, getSales);

module.exports = router;
