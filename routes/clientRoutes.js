const express = require('express');
const router = express.Router();
const { getClients } = require('../controllers/clientController');

// Ruta: GET /api/clients
router.get('/', getClients);

module.exports = router;
