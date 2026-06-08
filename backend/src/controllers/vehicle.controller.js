const Vehicle = require('../models/Vehicle');

exports.getAllVehicles = async (req, res) => {
    try {
        const { class: carClass, minPrice, maxPrice } = req.query;
        const filters = { class: carClass, minPrice, maxPrice };
        
        const vehicles = await Vehicle.findAll(filters);
        res.json({ success: true, vehicles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.searchAvailableVehicles = async (req, res) => {
    try {
        const { startDate, endDate, class: carClass, minPrice, maxPrice } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Укажите даты аренды' });
        }
        
        const filters = { class: carClass, minPrice, maxPrice };
        const vehicles = await Vehicle.findAvailableBetweenDates(startDate, endDate, filters);
        
        res.json({ success: true, vehicles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Автомобиль не найден' });
        }
        res.json({ success: true, vehicle });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};