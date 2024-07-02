const products = [
    { id: '1', name: 'Produk 1', price: 50000, image: 'https://example.com/product1.jpg' },
    { id: '2', name: 'Produk 2', price: 60000, image: 'https://example.com/product2.jpg' },
    { id: '3', name: 'Produk 3', price: 70000, image: 'https://example.com/product3.jpg' },
    { id: '4', name: 'Produk 4', price: 80000, image: 'https://example.com/product4.jpg' },
    { id: '5', name: 'Produk 5', price: 90000, image: 'https://example.com/product5.jpg' },
    { id: '6', name: 'Produk 6', price: 100000, image: 'https://example.com/product6.jpg' },
];

const getProductList = () => products;

const getProductById = (id) => products.find(product => product.id === id);

module.exports = { getProductList, getProductById };
