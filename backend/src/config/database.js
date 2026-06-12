const { Pool } = require('pg');

// Строка подключения из переменной окружения, заданной на Render
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ Ошибка: переменная окружения DATABASE_URL не задана!');
    console.error('   Добавьте её в настройках Web Service на Render (Environment Variables)');
    process.exit(1);
}

// Настройка пула соединений с БД
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false, // Обязательно для Render – игнорируем самоподписанный сертификат
    },
    // Опционально: таймаут простоя (в миллисекундах)
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Проверка подключения при старте сервера
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
        // Выводим строку подключения, скрывая пароль
        const masked = connectionString.replace(/:[^:@]*@/, ':****@');
        console.error(`   Строка подключения: ${masked}`);
    } else {
        console.log('✅ PostgreSQL подключен успешно');
        release();
    }
});

module.exports = pool;
