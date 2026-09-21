const Client = require('../models/Client');

// Obtener todos los clientes (GET)
const getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
    }
};

// Crear un nuevo cliente (POST)
const createClient = async (req, res) => {
    try {
        const { idCliente, nombreCliente, email, preferenciasCliente } = req.body;
        
        const newClient = new Client({
            idCliente,
            nombreCliente,
            email,
            preferenciasCliente
        });

        await newClient.save();
        res.status(201).json({ message: 'Cliente registrado con éxito', client: newClient });
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar el cliente', error: error.message });
    }
};

// Actualizar un cliente por ID de Mongo (PUT)
const updateClient = async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Devuelve el documento actualizado
        );
        
        if (!updatedClient) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.status(200).json({ message: 'Cliente actualizado', client: updatedClient });
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el cliente', error: error.message });
    }
};

// Eliminar un cliente por ID de Mongo (DELETE)
const deleteClient = async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        
        if (!deletedClient) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
    }
};

module.exports = {
    getClients,
    createClient,
    updateClient,
    deleteClient
};
