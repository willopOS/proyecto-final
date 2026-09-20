const Sale = require('../models/Sale');

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

module.exports = {
    getSales
};
