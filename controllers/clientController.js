const Client = require('../models/Client');

// Obtener todos los clientes
const getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
    }
};

module.exports = {
    getClients
};