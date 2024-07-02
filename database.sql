CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO products (name, price, description, image_url) VALUES
('Produk A', 100000, 'Deskripsi Produk A', 'https://example.com/images/produk_a.jpg'),
('Produk B', 200000, 'Deskripsi Produk B', 'https://example.com/images/produk_b.jpg'),
('Produk C', 150000, 'Deskripsi Produk C', 'https://example.com/images/produk_c.jpg'),
('Produk D', 250000, 'Deskripsi Produk D', 'https://example.com/images/produk_d.jpg'),
('Produk E', 300000, 'Deskripsi Produk E', 'https://example.com/images/produk_e.jpg'),
('Produk F', 180000, 'Deskripsi Produk F', 'https://example.com/images/produk_f.jpg');
