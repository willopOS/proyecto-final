const Vehicle = require('../models/Vehicle');

// Obtener todos los vehículos
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los vehículos', error: error.message });
    }
};

module.exports = {
    getVehicles
};
