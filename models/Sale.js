const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    idVenta: { type: Number, required: true, unique: true },
    vehiculoVendido: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    clienteAsociado: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    fechaVenta: { type: Date },
    metodoPago: { type: String },
    fechaEntrega: { type: Date }
});

module.exports = mongoose.model('Sale', saleSchema);
