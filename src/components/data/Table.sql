-- Drop Tables if they exist (to reset database)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS customers;

-- Create Customers Table
CREATE TABLE customers (
    auth_user_id VARCHAR PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    member_since DATE DEFAULT CURRENT_DATE
);

-- Create Employees Table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone_number VARCHAR(20) UNIQUE, -- Ensure phone number is unique
    age INT,
    id_card_num VARCHAR(20) UNIQUE, -- Ensures ID card is unique
    salary NUMERIC(10, 2) CHECK (salary >= 0), -- Prevents negative salary
    username VARCHAR(50) UNIQUE, -- Ensures unique username for login
    password TEXT NOT NULL, -- Stored as hash
    role VARCHAR(50)
);

-- Create Inventory Table
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    amount INT CHECK (amount >= 0) DEFAULT 0, -- Prevents negative inventory
    unit VARCHAR(50),
    description TEXT,
    price NUMERIC(10, 2) CHECK (price >= 0) DEFAULT 0 -- Ensures valid price
);

-- Create Services Table
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_duration NUMERIC NOT NULL CHECK (service_duration >= 0), -- Prevents negative duration
    service_price NUMERIC(10, 2) NOT NULL CHECK (service_price >= 0), -- Ensures valid price
    service_type VARCHAR(50) NOT NULL,
    keterangan VARCHAR(255)
);

-- Create Transactions Table
CREATE TABLE transactions (
    transaction_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR REFERENCES customers(auth_user_id) ON DELETE CASCADE, -- Deletes orders if customer is removed
    schedule TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    service_id INT REFERENCES services(service_id) ON DELETE CASCADE, -- Ensures service consistency
    duration NUMERIC CHECK (duration > 0),
    therapist_id INT REFERENCES employees(employee_id) ON DELETE SET NULL, -- Keeps transaction even if therapist leaves
    paid BOOLEAN DEFAULT FALSE,
    amount NUMERIC(10, 2) CHECK (amount >= 0) DEFAULT 0 -- Ensures non-negative amount
);

-- Enable Row-Level Security (Supabase Best Practice)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;


insert into services (service_name,service_duration,service_price,service_type,keterangan)
values 
('Full Body Massage',60,90000,'Standart Service',''),
('Full Body Massage',90,125000,'Standart Service',''),
('Full Body Massage',120,160000,'Standart Service',''),
('Massage Punggung',30,60000,'Standart Service',''),
('Massage Tangan & Pundak',30,160000,'Standart Service',''),
('Refleksi Kaki',30,60000,'Standart Service',''),
('Refleksi Kaki',60,90000,'Standart Service',''),
('Kerokan',30,30000,'Standart Service',''),
('Totok Wajah',30,60000,'Standart Service',''),
('Ear Candle',30,60000,'Standart Service',''),
('Baby Feet Treatment',60,130000,'Standart Service',''),
('Waxing Kaki',20,85000,'Standart Service',''),
('Waxing Tangan',20,85000,'Standart Service',''),
('Waxing Ketiak',20,85000,'Standart Service',''),
('Ogenki Spa',90,110000,'Paket Treatment Service','Full Body Massage + Kerokan'),
('Ogenki Spa',120,180000,'Paket Treatment Service','Full Body Massage + Kerokan'),
('Rirakku Spa',90,140000,'Paket Treatment Service',''),
('Rirakku Spa',120,200000,'Paket Treatment Service',''),
('Utsukushi Spa',90,140000,'Paket Treatment Service','Full Body Massage + Totok Wajah'),
('Utsukushi Spa',120,200000,'Paket Treatment Service','Full Body Massage + Totok Wajah'),
('Sakura Complete Spa',150,250000,'Paket Service','Full Body Massage,Totok Wajah, Ear Candle, Refleksi'),
('Eye Lash',0,125000,'By Order Service',''),
('Brow Bomber',0,125000,'By Order Service',''),
('Lash Lift',0,125000,'By Order Service','')

INSERT INTO employees (full_name, address, phone_num, age, id_card_num, salary, username, password, role)
VALUES
    ('Christopher Young', '123 Wellness St, Springfield', '081234567890', 40, '1234567890123456', 6000000, 'chris.therapist', 'therapychris123', 'therapist'),
    ('Emily Davis', '456 Relaxation Ave, Metropolis', '082345678901', 32, '2345678901234567', 5500000, 'emily.therapist', 'therapyemily123', 'therapist'),
    ('Michael Brown', '789 Serenity Rd, Gotham', '083456789012', 38, '3456789012345678', 5800000, 'michael.therapist', 'therapymichael123', 'therapist');

INSERT INTO inventory (name, amount, unit, description, price)
VALUES
    ('Cangkir Kopi', 100, 'pcs', 'Untuk pantry kantor', 25000),
    ('Teh Celup', 200, 'pcs', 'Teh celup untuk tamu', 15000),
    ('Tisu Basah', 50, 'pcs', 'Tisu basah untuk perawatan', 10000),
    ('Minyak Aromaterapi Lavender', 30, 'botol', 'Minyak aromaterapi lavender', 120000),
    ('Handuk Kecil', 80, 'pcs', 'Handuk kecil untuk tamu', 30000),
    ('Handuk Besar', 40, 'pcs', 'Handuk besar untuk terapi', 50000),
    ('Sabun Mandi', 60, 'pcs', 'Sabun mandi alami', 20000),
    ('Gelas Kaca', 70, 'pcs', 'Gelas kaca untuk minuman', 18000),
    ('Bantal Terapi', 25, 'pcs', 'Bantal untuk terapi relaksasi', 75000),
    ('Sandal Hotel', 90, 'pcs', 'Sandal untuk tamu', 22000);

--functions
DROP FUNCTION IF exists get_transaction_details();
CREATE OR REPLACE FUNCTION get_transaction_details()
RETURNS TABLE (
    transaction_id VARCHAR,
    customer_name VARCHAR,
    schedule TIMESTAMP,
    service_name VARCHAR,
    duration NUMERIC,
    therapist_name VARCHAR,
    paid BOOLEAN,
    amount NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.transaction_id,
        c.customer_name,
        t.schedule,
        s.service_name,
        t.duration,
        e.full_name AS therapist_name,
        t.paid,
        t.amount
    FROM transactions t
    JOIN services s ON t.service_id = s.service_id
    JOIN customers c ON t.customer_id = c.auth_user_id
    LEFT JOIN employees e ON t.therapist_id = e.employee_id;
END;
$$ LANGUAGE plpgsql;