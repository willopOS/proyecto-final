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

// Crear un nuevo vehículo
const createVehicle = async (req, res) => {
    try {
        const newVehicle = new Vehicle(req.body);
        await newVehicle.save();
        res.status(201).json({
            message: 'Vehículo registrado exitosamente',
            vehicle: newVehicle
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error al registrar el vehículo',
            error: error.message
        });
    }
};

module.exports = {
    getVehicles,
    createVehicle
};
