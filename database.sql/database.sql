--
-- PostgreSQL database dump for car_rental database
-- Веб-приложение аренды транспорта «CarRental»
-- Дата создания: 2026-06-08
--

-- =====================================================
-- 1. СОЗДАНИЕ ТАБЛИЦ
-- =====================================================

-- Таблица пользователей
CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    phone character varying(20),
    driver_license_number character varying(50) NOT NULL,
    driver_license_photo_path character varying(500),
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Таблица автомобилей
CREATE TABLE public.vehicles (
    id integer NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    year integer NOT NULL,
    license_plate character varying(20) NOT NULL,
    class character varying(50) NOT NULL,
    price_per_hour numeric(10,2) NOT NULL,
    price_per_day numeric(10,2) NOT NULL,
    fuel_type character varying(50),
    transmission character varying(50),
    seats integer,
    image_url character varying(500),
    is_available boolean DEFAULT true,
    technical_data jsonb,
    maintenance_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Таблица бронирований
CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer,
    vehicle_id integer,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bookings_check CHECK ((end_date > start_date))
);

-- Таблица истории поездок
CREATE TABLE public.rental_history (
    id integer NOT NULL,
    booking_id integer,
    actual_return_date timestamp without time zone,
    final_price numeric(10,2),
    rating integer,
    review text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rental_history_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);

-- =====================================================
-- 2. СОЗДАНИЕ ПОСЛЕДОВАТЕЛЬНОСТЕЙ (SEQUENCES) ДЛЯ AUTO-INCREMENT
-- =====================================================

-- Для таблицы users
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

-- Для таблицы vehicles
CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;

-- Для таблицы bookings
CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;

-- Для таблицы rental_history
CREATE SEQUENCE public.rental_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.rental_history_id_seq OWNED BY public.rental_history.id;

-- =====================================================
-- 3. УСТАНОВКА ЗНАЧЕНИЙ ПО УМОЛЧАНИЮ ДЛЯ ID
-- =====================================================

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);
ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);
ALTER TABLE ONLY public.rental_history ALTER COLUMN id SET DEFAULT nextval('public.rental_history_id_seq'::regclass);

-- =====================================================
-- 4. ПЕРВИЧНЫЕ КЛЮЧИ (PRIMARY KEY)
-- =====================================================

ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.vehicles ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.bookings ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.rental_history ADD CONSTRAINT rental_history_pkey PRIMARY KEY (id);

-- =====================================================
-- 5. УНИКАЛЬНЫЕ ОГРАНИЧЕНИЯ (UNIQUE CONSTRAINTS)
-- =====================================================

ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_driver_license_number_key UNIQUE (driver_license_number);
ALTER TABLE ONLY public.vehicles ADD CONSTRAINT vehicles_license_plate_key UNIQUE (license_plate);

-- =====================================================
-- 6. ИНДЕКСЫ ДЛЯ УСКОРЕНИЯ ПОИСКА
-- =====================================================

CREATE INDEX idx_bookings_dates ON public.bookings USING btree (start_date, end_date);
CREATE INDEX idx_vehicles_class ON public.vehicles USING btree (class);
CREATE INDEX idx_vehicles_price ON public.vehicles USING btree (price_per_day);

-- Дополнительные индексы
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_vehicle_id ON public.bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_rental_history_booking_id ON public.rental_history(booking_id);

-- =====================================================
-- 7. ВНЕШНИЕ КЛЮЧИ (FOREIGN KEY)
-- =====================================================

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.rental_history
    ADD CONSTRAINT rental_history_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;

-- =====================================================
-- 8. ТЕСТОВЫЕ ДАННЫЕ
-- =====================================================

-- ----- 8.1 АВТОМОБИЛИ -----
INSERT INTO public.vehicles (id, brand, model, year, license_plate, class, price_per_hour, price_per_day, fuel_type, transmission, seats, image_url, is_available) VALUES
(1, 'Toyota', 'Camry', 2022, 'A001BC', 'comfort', 15.00, 80.00, 'petrol', 'automatic', 5, 'https://avatars.mds.yandex.net/get-autoru-vos/4829839/877a3a301043f489993839d2b5139b83/1200x900', true),
(2, 'Honda', 'Civic', 2023, 'A002CD', 'economy', 12.00, 65.00, 'petrol', 'manual', 5, 'https://i.ytimg.com/vi/G7Nfwl1DKHU/maxresdefault.jpg', true),
(3, 'BMW', 'X5', 2024, 'A003DE', 'business', 35.00, 200.00, 'diesel', 'automatic', 7, 'https://avatars.mds.yandex.net/get-autoru-vos/2156853/fd2cabaaa3414a7a3d550c6f92c802cb/1200x900', true),
(4, 'Tesla', 'Model 3', 2023, 'A004EF', 'business', 40.00, 220.00, 'electric', 'automatic', 5, 'https://avatars.mds.yandex.net/get-autoru-vos/11038141/72f82ef2173bc19eab098e28f5630bd6/1200x900', true),
(5, 'Kia', 'Sportage', 2022, 'A005FG', 'suv', 18.00, 95.00, 'petrol', 'automatic', 5, 'https://avatars.mds.yandex.net/get-autoru-vos/1933512/5c555777bde7a1b40a70f45b70d0d433/1200x900', true),
(6, 'Mercedes', 'E 300', 2024, 'B001MK', 'business', 35.00, 210.00, 'petrol', 'automatic', 5, 'https://avatars.mds.yandex.net/get-autoru-vos/6029895/4853e4b8e2ecfe91663bdf9f51301a68/1200x900', true),
(7, 'Audi', 'A6', 2024, 'B002MK', 'business', 32.00, 190.00, 'petrol', 'automatic', 5, 'https://avatars.mds.yandex.net/get-autoru-vos/2180690/8c7e5a3227f166f9805d651a59cd711b/1200x900', true),
(8, 'BMW', '530i', 2024, 'B003MK', 'business', 38.00, 230.00, 'petrol', 'automatic', 5, 'https://avatars.mds.yandex.net/get-autoru-vos/4297133/7a93098c7a081b007b40d1be95fd3093/1200x900', true),
(9, 'Hyundai', 'Sonata', 2023, 'C004MK', 'comfort', 18.00, 110.00, 'petrol', 'manual', 5, 'https://avatars.mds.yandex.net/get-vertis-journal/4469561/2020-09-23-9b75d7c4a4e8408aaac1213134da2d58.jpg_1622736690877/orig', true),
(10, 'Kia', 'K5', 2023, 'C005MK', 'comfort', 17.00, 100.00, 'petrol', 'automatic', 5, 'https://avatars.mds.yandex.net/get-vertis-journal/4465444/Kia-K5-2025-1600-01.jpg_1707463340785/orig', true),
(11, 'Nissan', 'Altima', 2023, 'C006MK', 'comfort', 19.00, 115.00, 'petrol', 'automatic', 5, 'https://avatars.mds.yandex.net/get-vertis-journal/4212087/Nissan-Altima-2023-1600-02.jpg_1654799136769/orig', true),
(12, 'Renault', 'Logan', 2020, 'E007MK', 'economy', 8.00, 50.00, 'petrol', 'manual', 5, 'https://avatars.mds.yandex.net/get-autoru-vos/2091203/0c869dc9baafa0567a1c8ccf61d2f57c/1200x900', true);

-- ----- 8.2 ПОЛЬЗОВАТЕЛИ -----
-- Пароль для test@example.com: 123456
-- Пароль для Leshaklesnyak@gmail.com: 123456
INSERT INTO public.users (id, email, password_hash, full_name, phone, driver_license_number, driver_license_photo_path, role) VALUES
(1, 'test@example.com', '$2b$10$PotK1T4Yo/I71eez13XreOfbsw4VxoVZuGemfWADpcuuIQ6uGJ0qG', 'Test User', '123456789', 'TEST123', NULL, 'user'),
(2, 'Leshaklesnyak@gmail.com', '$2b$10$uCb1GeKn0H6NzZoi5Us09eHEzFZ0xF.uSSspV6UtoM2HzjhLczphS', 'Алексей', '375292302675', 'BCJDJJDDJ', NULL, 'admin'),
(3, 'vpnvpnovich691@gmail.com', '$2b$10$PmsK.M27C5N1AoBK86OZSOxK5f/AhIyhPgxtj96xcFj3z3jPvzM8e', 'Алексей', '+375292302675', 'Bcjdjjddj', 'uploads\\licenses\\license-1778458037835-817322326.jpg', 'user'),
(4, 'JDJGKJG@gmail.com', '$2b$10$vU.0AMqFbQItqCnNXGINgufHOit/Jef3Pl.DIB5H4mwde6Dia.l5y', 'Алексей', '+375666574', '5657585748575', 'uploads\\licenses\\license-1778657715585-762853718.png', 'user');

-- ----- 8.3 БРОНИРОВАНИЯ -----
INSERT INTO public.bookings (id, user_id, vehicle_id, start_date, end_date, total_price, status, created_at) VALUES
(1, 2, 2, '2026-05-11 00:00:36.427', '2026-05-14 00:00:36', 195.00, 'confirmed', '2026-05-11 03:00:46.791807'),
(2, 2, 1, '2025-04-01 10:00:00', '2025-04-05 18:00:00', 320.00, 'completed', '2025-03-25 12:00:00'),
(3, 4, 12, '2026-05-14 07:35:15', '2026-05-16 07:35:15', 100.00, 'confirmed', '2026-05-13 10:35:45.382369'),
(4, 4, 5, '2026-05-13 07:36:31.64', '2026-05-14 07:36:31.64', 95.00, 'confirmed', '2026-05-13 10:38:58.809377');

-- ----- 8.4 ИСТОРИЯ ПОЕЗДОК (ЗАВЕРШЁННЫЕ) -----
INSERT INTO public.rental_history (id, booking_id, actual_return_date, final_price, rating, review, created_at) VALUES
(1, 2, '2025-04-05 18:30:00', 320.00, 5, 'Отличная поездка! Автомобиль в хорошем состоянии.', '2026-05-11 08:54:45.121174');

-- =====================================================
-- 9. СБРОС ПОСЛЕДОВАТЕЛЬНОСТЕЙ (чтобы id продолжались с правильного числа)
-- =====================================================

SELECT pg_catalog.setval('public.users_id_seq', 4, true);
SELECT pg_catalog.setval('public.vehicles_id_seq', 12, true);
SELECT pg_catalog.setval('public.bookings_id_seq', 4, true);
SELECT pg_catalog.setval('public.rental_history_id_seq', 1, true);

-- =====================================================
-- 10. ПРОВЕРОЧНЫЕ ЗАПРОСЫ (для отладки)
-- =====================================================

-- Вывести статистику по таблицам
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'rental_history', COUNT(*) FROM rental_history;

-- =====================================================
-- КОНЕЦ ДАМПА
-- =====================================================