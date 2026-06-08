const pool = require('../config/database');

class Vehicle {
    static async findAll(filters = {}) {
        let query = 'SELECT * FROM vehicles WHERE 1=1';
        const values = [];
        let paramCount = 1;
        
        if (filters.class) {
            query += ` AND class = $${paramCount++}`;
            values.push(filters.class);
        }
        
        if (filters.minPrice) {
            query += ` AND price_per_day >= $${paramCount++}`;
            values.push(filters.minPrice);
        }
        
        if (filters.maxPrice) {
            query += ` AND price_per_day <= $${paramCount++}`;
            values.push(filters.maxPrice);
        }
        
        query += ' ORDER BY price_per_day ASC';
        
        const result = await pool.query(query, values);
        return result.rows;
    }
    
    static async findAvailableBetweenDates(startDate, endDate, filters = {}) {
        let query = `
            SELECT v.* FROM vehicles v
            WHERE v.is_available = true
            AND NOT EXISTS (
                SELECT 1 FROM bookings b
                WHERE b.vehicle_id = v.id
                AND b.status IN ('confirmed', 'active')
                AND b.start_date < $2
                AND b.end_date > $1
            )
        `;
        
        const values = [startDate, endDate];
        let paramCount = 3;
        
        if (filters.class) {
            query += ` AND v.class = $${paramCount++}`;
            values.push(filters.class);
        }
        
        if (filters.minPrice) {
            query += ` AND v.price_per_day >= $${paramCount++}`;
            values.push(filters.minPrice);
        }
        
        if (filters.maxPrice) {
            query += ` AND v.price_per_day <= $${paramCount++}`;
            values.push(filters.maxPrice);
        }
        
        query += ` ORDER BY v.price_per_day ASC`;
        
        const result = await pool.query(query, values);
        return result.rows;
    }
    
    static async findById(id) {
        const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
        return result.rows[0];
    }
    
    static async create(vehicleData) {
        const { brand, model, year, license_plate, class: carClass, 
                price_per_hour, price_per_day, fuel_type, transmission, 
                seats, image_url } = vehicleData;
        
        const result = await pool.query(
            `INSERT INTO vehicles (brand, model, year, license_plate, class, 
              price_per_hour, price_per_day, fuel_type, transmission, seats, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING *`,
            [brand, model, year, license_plate, carClass, price_per_hour, 
             price_per_day, fuel_type, transmission, seats, image_url]
        );
        return result.rows[0];
    }
    
    static async update(id, vehicleData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        
        for (const [key, value] of Object.entries(vehicleData)) {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount++}`);
                values.push(value);
            }
        }
        
        values.push(id);
        const query = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0];
    }
    
    static async delete(id) {
        const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }
}

module.exports = Vehicle;