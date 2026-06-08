const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { email, password, full_name, phone, driver_license_number, driver_license_photo_path } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, phone, driver_license_number, driver_license_photo_path)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, full_name, role`,
            [email, hashedPassword, full_name, phone, driver_license_number, driver_license_photo_path]
        );
        return result.rows[0];
    }
    
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }
    
    static async findById(id) {
        const result = await pool.query(
            'SELECT id, email, full_name, phone, driver_license_number, role, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }
}

module.exports = User;