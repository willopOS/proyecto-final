const User = require('../models/User');

// Registrar un nuevo usuario
const register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Crear y guardar el nuevo usuario
        const newUser = new User({
            nombre,
            email,
            password,
            rol: rol || 'client'
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado con éxito', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor al registrar usuario', error: error.message });
    }
};

module.exports = {
    register
};
