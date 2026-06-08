const pool = require('../config/database');

class Booking {
    static async create(bookingData) {
        const { user_id, vehicle_id, start_date, end_date, total_price, status = 'confirmed' } = bookingData;
        
        const result = await pool.query(
            `INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_price, status)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, vehicle_id, start_date, end_date, total_price, status]
        );
        return result.rows[0];
    }
    
    static async findByUser(userId) {
        const result = await pool.query(
            `SELECT b.*, v.brand, v.model, v.image_url 
             FROM bookings b
             JOIN vehicles v ON b.vehicle_id = v.id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC`,
            [userId]
        );
        return result.rows;
    }
    
    static async findById(id) {
        const result = await pool.query(
            `SELECT b.*, v.brand, v.model, v.image_url
             FROM bookings b
             JOIN vehicles v ON b.vehicle_id = v.id
             WHERE b.id = $1`,
            [id]
        );
        return result.rows[0];
    }
    
    static async updateStatus(id, status) {
        const result = await pool.query(
            'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    }
    
    static async getUserHistory(userId) {
        const result = await pool.query(
            `SELECT b.*, v.brand, v.model, v.image_url
             FROM bookings b
             JOIN vehicles v ON b.vehicle_id = v.id
             WHERE b.user_id = $1 AND b.status = 'completed'
             ORDER BY b.end_date DESC`,
            [userId]
        );
        return result.rows;
    }
}

module.exports = Booking;