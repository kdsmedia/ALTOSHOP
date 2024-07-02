const mysql = require('mysql2');
const { parse } = require('url');

const dbUrl = process.env.JAWSDB_URL;
const { auth, hostname, port, pathname } = parse(dbUrl);
const [user, password] = auth.split(':');
const database = pathname.substring(1);

const connection = mysql.createConnection({
  host: hostname,
  user: user,
  password: password,
  database: database,
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
