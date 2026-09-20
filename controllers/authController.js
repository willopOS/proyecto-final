const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};

// Inicio de sesión
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas (usuario no encontrado)' });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas (contraseña incorrecta)' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user._id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Expira en 24 horas
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: { id: user._id, nombre: user.nombre, rol: user.rol }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
    }
};

module.exports = {
    register,
    login
};
