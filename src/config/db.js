const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306
});


db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no bando de dados:', err);
    } else {
        console.log('Conectado ao banco de dados!');
    }
});

module.exports = db;
