const { Pool } = require('pg');

// Настройки подключения к PostgreSQL (без пароля)
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'car_rental',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '', // Пустой пароль
});

// Проверка подключения
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
        console.log('💡 Убедитесь, что PostgreSQL запущен и база данных car_rental существует');
    } else {
        console.log('✅ PostgreSQL подключен успешно');
        release();
    }
});

module.exports = pool;