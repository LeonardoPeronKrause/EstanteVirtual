// Importa o módulo mysql2 p interagir c o banco de dados MySQL
const mysql = require('mysql2');

// Cria um aconexão com o banco de dados MySQL
const conexao = mysql.createConnection({
    host: 'localhost',  // Endereço do servidor MySQL (padrão: localhost)
    port: 3306,         // Porta do servidor MySQL (padrão: 3306)
    user: 'root',       // Nome de usuário do banco de dados
    password: '1234',   // Senha do banco de dados
    database: 'estantevirtual' // Nome do banco de dados a ser utilizado
});

// Exporta a conexão para q posso ser usada em outros arquivos do projeto
module.exports = conexao;