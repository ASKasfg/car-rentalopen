const { Pool } = require('pg');

// Используем переменную окружения DATABASE_URL, которую задали на Render
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ Ошибка: переменная окружения DATABASE_URL не задана!');
    console.error('   Убедитесь, что вы добавили её в настройках Web Service на Render');
    process.exit(1); // Останавливаем сервер, так как без БД он не может работать
}

// Создаём пул соединений
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false, // Обязательно для Render (и большинства облачных БД)
    },
});

// Проверка подключения при старте
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
        console.error('   Строка подключения:', connectionString.replace(/:[^:@]*@/, ':****@')); // скрываем пароль
    } else {
        console.log('✅ PostgreSQL подключен успешно');
        release();
    }
});

module.exports = pool;
