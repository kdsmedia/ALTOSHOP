// src/config/dbConfig.js

const mysql = require('mysql2');
const { parse } = require('url');

const dbUrl = process.env.JAWSDB_URL;
const { auth, hostname, port, pathname } = parse(dbUrl);

const connection = mysql.createConnection({
    host: hostname,
    user: auth.split(':')[0],
    password: auth.split(':')[1],
    database: pathname.split('/')[1],
    port: port
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID', connection.threadId);
});

module.exports = connection;
