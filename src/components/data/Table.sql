-- Create Customers Table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15)
);

-- Create Employees Table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone_num VARCHAR(15),
    age INT,
    id_card_num VARCHAR(20),
    salary NUMERIC(10, 2),
    username VARCHAR(50),
    password VARCHAR(50),
    role VARCHAR(50)
);

-- Create Inventory Table
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    amount INT,
    unit VARCHAR,
    description TEXT,
    price NUMERIC(10, 2)
);

-- Create Transactions Table
CREATE TABLE transactions (
    transaction_id VARCHAR(20) PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    schedule TIMESTAMP,
    service VARCHAR,
    duration NUMERIC,
    therapist_id INT REFERENCES employees(employee_id),
    paid BOOLEAN,
    amount NUMERIC
);


--insert data

INSERT INTO customers (customer_name, phone_number)
VALUES
    ('Isabella Hall', '081112223344'),
    ('John Doe', '082223334455'),
    ('Jane Smith', '083334445566'),
    ('Alice Johnson', '084445556677'),
    ('Bob Williams', '085556667788');

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

INSERT INTO transactions (transaction_id, customer_id, schedule, service, duration, therapist_id, paid, amount)
VALUES
    ('TX001', 16, '2025-01-30 10:30', 'Prenatal Massage', 60, 10, TRUE, 120000),
    ('TX002', 17, '2025-02-01 14:00', 'Swedish Massage', 90, 11, FALSE, 150000),
    ('TX003', 18, '2025-02-02 11:00', 'Deep Tissue Massage', 60, 12, TRUE, 130000),
    ('TX004', 19, '2025-02-03 16:00', 'Hot Stone Massage', 90, 10, FALSE, 180000),
    ('TX005', 20, '2025-02-04 09:00', 'Aromatherapy Massage',60, 11, TRUE, 140000),
    ('TX006', 16, '2025-02-05 13:00', 'Reflexology',30, 12, FALSE, 80000),
    ('TX007', 17, '2025-02-06 15:00', 'Couples Massage',120, 10, TRUE, 250000),
    ('TX008', 18, '2025-02-07 10:00', 'Sports Massage', 60, 11, FALSE, 130000),
    ('TX009', 19, '2025-02-08 12:00', 'Shiatsu Massage', 90, 12, TRUE, 160000),
    ('TX010', 20, '2025-02-09 17:00', 'Thai Massage', 60, 10, FALSE, 120000);

--trigger--

CREATE OR REPLACE FUNCTION get_transaction_details(p_transaction_id VARCHAR)
RETURNS TABLE (
    transaction_id VARCHAR,
    customer_name VARCHAR,
    schedule TIMESTAMP,
    service VARCHAR,
    duration VARCHAR,
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
        t.service,
        t.duration,
        e.full_name AS therapist_name,
        t.paid,
        t.amount
    FROM transactions t
    JOIN customers c ON t.customer_id = c.customer_id
    JOIN employees e ON t.therapist_id = e.employee_id
    WHERE t.transaction_id = p_transaction_id;
END;
$$ LANGUAGE plpgsql;


--services
CREATE TABLE Services (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_duration numeric not null,
    service_price numeric not null,
    service_type varchar not null,
    keterangan varchar
);

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