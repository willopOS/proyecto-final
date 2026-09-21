const express = require('express');
const router = express.Router();
const { getClients, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas
router.get('/', verifyToken, getClients);
router.post('/', verifyToken, createClient); 
router.put('/:id', verifyToken, isAdmin, updateClient);
router.delete('/:id', verifyToken, isAdmin, deleteClient);

module.exports = router;
