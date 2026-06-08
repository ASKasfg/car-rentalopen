const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

exports.createBooking = async (req, res) => {
    try {
        const { vehicle_id, start_date, end_date, total_price } = req.body;
        
        const vehicle = await Vehicle.findById(vehicle_id);
        if (!vehicle || !vehicle.is_available) {
            return res.status(400).json({ error: 'Автомобиль недоступен' });
        }
        
        const booking = await Booking.create({
            user_id: req.user.id,
            vehicle_id,
            start_date,
            end_date,
            total_price,
            status: 'confirmed'
        });
        
        res.status(201).json({ success: true, booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findByUser(req.user.id);
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const history = await Booking.getUserHistory(req.user.id);
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }
        
        if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Нет прав' });
        }
        
        const updated = await Booking.updateStatus(req.params.id, 'cancelled');
        res.json({ success: true, booking: updated });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};