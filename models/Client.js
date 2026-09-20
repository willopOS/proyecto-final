const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    idCliente: { type: Number, required: true, unique: true },
    nombreCliente: { type: String, required: true },
    email: { type: String, required: true },
    preferenciasCliente: { type: String }
});

module.exports = mongoose.model('Client', clientSchema);
