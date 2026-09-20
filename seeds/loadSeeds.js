const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const Vehicle = require('../models/Vehicle');
const Client = require('../models/Client');
const Sale = require('../models/Sale');

const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a la BD para las semillas... 🌱');

        // 1. Limpiar colecciones anteriores
        await Vehicle.deleteMany({});
        await Client.deleteMany({});
        await Sale.deleteMany({});
        console.log('Colecciones limpiadas.');

        // 2. Cargar Vehículos
        const vehiclesMap = {}; // Para guardar { vin: _id }
        const vehiclesData = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(path.join(__dirname, '../data/Vehiculos.csv'))
                .pipe(csv())
                .on('data', (row) => {
                    // Limpiar el precio (ej: "$25.800" -> 25800)
                    const cleanPrice = Number(row['Precio de venta'].replace(/[^0-9]/g, ''));
                    vehiclesData.push({
                        vin: row['Número de identificación del vehículo (VIN)'],
                        marca: row['Marca'],
                        modelo: row['Modelo'],
                        tipoVehiculo: row['Tipo de vehículo'],
                        anioFabricacion: Number(row['Año de fabricación']),
                        kilometraje: row['Kilometraje'],
                        estado: row['Estado'],
                        precioVenta: cleanPrice,
                        fechaAdquisicion: row['Fecha de adquisición'],
                        estadoVehiculo: row['Estado del vehículo'],
                        imagen: row['Imagen'],
                        color: row['Color']
                    });
                })
                .on('end', async () => {
                    const insertedVehicles = await Vehicle.insertMany(vehiclesData);
                    insertedVehicles.forEach(v => {
                        vehiclesMap[v.vin] = v._id;
                    });
                    console.log(`🚗 Vehículos cargados: ${insertedVehicles.length}`);
                    resolve();
                })
                .on('error', reject);
        });

        // 3. Cargar Clientes
        const clientsMap = {}; // Para guardar { idCliente: _id }
        const clientsData = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(path.join(__dirname, '../data/Clientes.csv'))
                .pipe(csv())
                .on('data', (row) => {
                    clientsData.push({
                        idCliente: Number(row['ID cliente']),
                        nombreCliente: row['Nombre del cliente'],
                        email: row['Email'],
                        preferenciasCliente: row['Preferencias del cliente']
                    });
                })
                .on('end', async () => {
                    const insertedClients = await Client.insertMany(clientsData);
                    insertedClients.forEach(c => {
                        clientsMap[c.idCliente] = c._id;
                    });
                    console.log(`👥 Clientes cargados: ${insertedClients.length}`);
                    resolve();
                })
                .on('error', reject);
        });

        // 4. Cargar Ventas (Relacionando Vehículos y Clientes)
        const salesData = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(path.join(__dirname, '../data/Ventas.csv'))
                .pipe(csv())
                .on('data', (row) => {
                    const vehicleId = vehiclesMap[row['Vehículo vendido']];
                    const clientId = clientsMap[Number(row['Cliente asociado'])];

                    if (vehicleId && clientId) {
                        salesData.push({
                            idVenta: Number(row['ID venta']),
                            vehiculoVendido: vehicleId,
                            clienteAsociado: clientId,
                            fechaVenta: row['Fecha de venta'],
                            metodoPago: row['Método de pago'],
                            fechaEntrega: row['Fecha de entrega']
                        });
                    }
                })
                .on('end', async () => {
                    const insertedSales = await Sale.insertMany(salesData);
                    console.log(`🤝 Ventas cargadas y relacionadas: ${insertedSales.length}`);
                    resolve();
                })
                .on('error', reject);
        });

        console.log('✨ ¡Todas las semillas se cargaron con éxito!');
        process.exit(0);
    } catch (error) {
        console.error('Error al ejecutar las semillas:', error);
        process.exit(1);
    }
};

runSeed();
