const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost:3306',
    user: 'root',
    password: 1234,
    database: 'estantevirtual'
});

conexao.connect((err) => {
    if (err) {
        console.log('Erro ao conectar com banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao bando de dados MySQL.'); 
});

module.exports = conexao;