const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    tipoVehiculo: { type: String },
    anioFabricacion: { type: Number, required: true },
    kilometraje: { type: String },
    estado: { type: String },
    precioVenta: { type: Number, required: true },
    fechaAdquisicion: { type: Date },
    estadoVehiculo: { type: String },
    imagen: { type: String },
    color: { type: String }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
