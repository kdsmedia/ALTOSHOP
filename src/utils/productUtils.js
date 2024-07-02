// src/utils/productUtils.js

const db = require('../config/dbConfig');

const getProductList = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);
        });
    });
};

module.exports = { getProductList, getProductById };
