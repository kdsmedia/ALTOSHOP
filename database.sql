-- Buat Tabel Produk
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT NOT NULL
);

-- Tambahkan Data Produk
INSERT INTO products (name, price, image) VALUES
('Produk 1', 50000, 'https://example.com/product1.jpg'),
('Produk 2', 60000, 'https://example.com/product2.jpg'),
('Produk 3', 70000, 'https://example.com/product3.jpg'),
('Produk 4', 80000, 'https://example.com/product4.jpg'),
('Produk 5', 90000, 'https://example.com/product5.jpg'),
('Produk 6', 100000, 'https://example.com/product6.jpg');
