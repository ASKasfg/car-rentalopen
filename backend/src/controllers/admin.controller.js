const Vehicle = require('../models/Vehicle');
const pool = require('../config/database');

exports.addVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json({ success: true, vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.update(req.params.id, req.body);
        if (!vehicle) {
            return res.status(404).json({ error: 'Автомобиль не найден' });
        }
        res.json({ success: true, vehicle });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const activeBookings = await pool.query(
            'SELECT id FROM bookings WHERE vehicle_id = $1 AND status IN ($2, $3)',
            [req.params.id, 'confirmed', 'active']
        );
        
        if (activeBookings.rows.length > 0) {
            return res.status(409).json({ error: 'Нельзя удалить авто с активными бронями' });
        }
        
        const deleted = await Vehicle.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Автомобиль не найден' });
        }
        
        res.json({ success: true, message: 'Автомобиль удален' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, v.brand, v.model, v.license_plate, u.full_name, u.email
             FROM bookings b
             JOIN vehicles v ON b.vehicle_id = v.id
             JOIN users u ON b.user_id = u.id
             ORDER BY b.created_at DESC`
        );
        res.json({ success: true, bookings: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const totalVehicles = await pool.query('SELECT COUNT(*) FROM vehicles');
        const activeBookings = await pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'active'");
        const totalRevenue = await pool.query("SELECT SUM(total_price) FROM bookings WHERE status = 'completed'");
        const activeUsers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'");
        
        res.json({
            success: true,
            statistics: {
                totalVehicles: parseInt(totalVehicles.rows[0].count),
                activeBookings: parseInt(activeBookings.rows[0].count),
                totalRevenue: parseFloat(totalRevenue.rows[0].sum) || 0,
                activeUsers: parseInt(activeUsers.rows[0].count)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};