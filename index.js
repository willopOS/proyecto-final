const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importar las rutas
const vehicleRoutes = require('./routes/vehicleRoutes');
const clientRoutes = require('./routes/clientRoutes');
const saleRoutes = require('./routes/saleRoutes');
// Importar ruta de autenticación
const authRoutes = require('./routes/authRoutes');


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Conectar las rutas con la app
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', saleRoutes);

// Usar ruta de autenticación
app.use('/api/auth', authRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Base de datos conectada con éxito 🚀');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });
