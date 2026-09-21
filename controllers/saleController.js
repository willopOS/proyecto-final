const Sale = require('../models/Sale');
const Vehicle = require('../models/Vehicle');

// Obtener todas las ventas con vehículo y cliente completos
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('vehiculoVendido')
            .populate('clienteAsociado');
            
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
    }
};

const createSale = async (req, res) => {
    try {
        const { idVenta, vehiculoVendido, clienteAsociado, metodoPago, fechaEntrega } = req.body;

        // Guardar la nueva venta
        const newSale = new Sale({
            idVenta,
            vehiculoVendido,
            clienteAsociado,
            metodoPago,
            fechaEntrega,
            fechaVenta: new Date()
        });
        await newSale.save();

        // Cambiar automáticamente el estado del coche
        await Vehicle.findByIdAndUpdate(vehiculoVendido, { estadoVehiculo: 'Vendido' });

        res.status(201).json({
            message: 'Venta registrada con éxito y vehículo marcado como Vendido',
            sale: newSale
        });
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar la venta', error: error.message });
    }
};

module.exports = {
    getSales,
    createSale
};
