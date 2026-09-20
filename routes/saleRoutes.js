const express = require('express');
const router = express.Router();
const { getSales } = require('../controllers/saleController');

// Ruta: GET /api/sales
router.get('/', getSales);

module.exports = router;
