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

// Actualizar vehículo por ID
const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        res.status(200).json({
            message: 'Vehículo actualizado exitosamente',
            vehicle: updatedVehicle
        });
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el vehículo', error: error.message });
    }
};

// Eliminar vehículo por ID
const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVehicle = await Vehicle.findByIdAndDelete(id);

        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el vehículo', error: error.message });
    }
};

module.exports = {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
