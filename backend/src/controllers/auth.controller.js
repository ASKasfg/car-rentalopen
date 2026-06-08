const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

exports.register = async (req, res) => {
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);
    
    // Убираем строгую валидацию для теста
    try {
        const { email, password, full_name, phone, driver_license_number } = req.body;
        
        // Простая проверка
        if (!email || !password || !full_name || !driver_license_number) {
            return res.status(400).json({ error: 'Заполните все обязательные поля' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
        }
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }
        
        // Путь к фото (если есть)
        const driver_license_photo_path = req.file ? req.file.path : null;
        
        const userData = {
            email,
            password,
            full_name,
            phone: phone || '',
            driver_license_number,
            driver_license_photo_path
        };
        
        const user = await User.create(userData);
        const token = generateToken(user);
        
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        
        const token = generateToken(user);
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};