const db = require('./dataBase');
const readline = require('readline');
const fs = require('fs');


// Cria uma interface p leitura p interação com user no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let chalk;

// Função iniciar
const iniciar = async function() {
    chalk = await import('chalk');
    console.log(chalk.default.blue('Bem vindo à EstanteVirtual, o seu espaço para gerenciamento de livros!\n'));

    // Conecta o bando de dados e, se conectar com sucesso, exiba o menu
    db.connect((err) => {
        if (err) {
            console.log(chalk.default.red('Erro ao conectar com o banco de dados:'), err.message);
            return;
        }
        console.log(chalk.default.green('Conectado ao banco de dados MySQL.'));
        exibirMenu();
    });    
};

// Função Menu p escolha do user
const exibirMenu = function() {
    rl.question('\n 1. Cadastrar Livro:\n 2. Editar Estante:\n 3. Ver Estante:\n 4. Excluir Livro da Estante:\n 5. Fazer Backup:\n 0. Sair:\n\nQual opção você deseja? ', function(opcao) {
        if (opcao === '1') {
            cadastrarLivro();
        } else if (opcao === '2') {
            editarEstante();
        } else if (opcao === '3') {
            verEstante();
        } else if(opcao === '4') {
            excluirLivro();
        } else if (opcao === '5') {
            fazerBackup();
        } else if (opcao === '0') {
            sair();
        } else {
            console.log(chalk.default.red('Você digitou uma opção inválida!\n Tenta novamente...'));
            exibirMenu();
        }
    });
};

// Função cadastrar um novo livro
const cadastrarLivro = function() {
    rl.question('Qual o nome do livro que você deseja cadastrar? ', function(nome) {
        rl.question('Qual é o segmento do livro? ', function(segmento) {
            rl.question('Qual o preço do livro? ', function(preco) {
                if (!nome || !segmento || !preco) {
                    console.error(chalk.default.red('Nome, Segmento e Preço são obrigatórios.'));
                    return exibirMenu();
                }

                // Substitui a vírgula por ponto para garantir o formato correto
                preco = preco.replace(',', '.');
    
                const query = 'INSERT INTO livros (nome, segmento, preco) VALUES (?, ?, ?)';
                db.query(query, [nome, segmento, parseFloat(preco)], (err) => {
                    if (err) {
                        console.log(chalk.default.red('Erro ao cadastrar dados do livro: '), err.message);
                    } else {
                        console.log(chalk.default.green(`O livro ${nome} do segmento ${segmento}, foi cadastrado com sucesso! E seu preço é de ${preco} reais.`));
                    }
                    exibirMenu();
                });
            });
        });
    });
};

// Função p editar livro existente
const editarEstante = function() {
    const query = 'SELECT * FROM livros';
    db.query(query, (err, results) => {
        if (err) {
            console.log(chalk.default.red('Erro ao busca livros: '), err.message);
            return exibirMenu();
        }

        if (results.length === 0) {
            console.log(chalk.default.yellow('Nenhum livro cadastrado na Estante Virtual!'));
            return exibirMenu();
        }

        console.log('Livros disponíveis para edição:');
        results.forEach((livro, index) => {
            console.log(`${index + 1}. '${livro.nome}' (${livro.segmento})`);
        });

        rl.question('Qual o número do livro que você deseja editar? ', function(numero) {
            const index = parseInt(numero) - 1;

            if (index >= 0 && index < results.length) {
                const livroSelecionado = results[index];
            
                rl.question('Qual o novo nome do livro? (Se deixar em branco não irá alterar) ', function(novoNome) {
                    rl.question('Qual o novo segmento do livro? (Se deixar em branco não irá alterar) ', function(novoSegmento) {
                        rl.question('Qual o novo preço do livro? (Se deixar em branco não irá alterar) ', function(novoPreco) {
                            const updates = [];
                            const params = [];
            
                            if (novoNome.trim() !== '') {
                                updates.push('nome = ?');
                                params.push(novoNome);
                            }
            
                            if (novoSegmento.trim() !== '') {
                                updates.push('segmento = ?');
                                params.push(novoSegmento);
                            }

                            if (novoPreco.trim() !== '') {
                                novoPreco = parseFloat(novoPreco.replace(',', '.'));
                                if (isNaN(novoPreco)) {
                                    console.error(chalk.red('Preço inválido!'));
                                    return exibirMenu();
                                }
                                updates.push('preco = ?');
                                params.push(novoPreco);
                            }
            
                            if (updates.length > 0) {
                                params.push(livroSelecionado.id);
                                const updateQuery = `UPDATE livros SET ${updates.join(', ')} WHERE id = ?`;
                                db.query(updateQuery, params, (err) => {
                                    if (err) {
                                        console.log(chalk.default.red('Erro ao atualizar o livro: '), err.message);
                                    } else {
                                        console.log(chalk.default.green('O livro foi atualizado com sucesso!'));
                                    }
                                    exibirMenu();
                                });
                            } else {
                                console.log(chalk.default.yellow('Nenhuma atualização realizada.'));
                                exibirMenu();
                            }
                        });
                    });
                });
            } else {
                console.log(chalk.default.red('Número inválido. Tente novamente.'));
                exibirMenu();
            }
        });
    });
};

// Função p ver os livros cadastrados
const verEstante = function() {
    const query = 'SELECT * FROM livros';
    db.query(query, (err, results) => {
        if (err) {
            console.log(chalk.default.red('Erro ao buscar livros: '), err.message);
        } else if (results.length === 0) {
            console.log(chalk.default.yellow('Nenhum livro cadastrdo na Estante Virtual!'));
        } else {
            console.log('Livros Cadastrados: \n');
            results.forEach((livro, index) => {
                console.log(`${index + 1}. ${chalk.default.blue(livro.nome)} do segmento: ${livro.segmento} e preço: ${livro.preco}`);
            });
        }
        exibirMenu();
    });
};

// Função p excluir um livro existente
const excluirLivro = function() {
    const query = 'SELECT * FROM livros';
    db.query(query, (err, results) => {
        if (err) {
            console.log(chalk.default.red('Erro ao buscar livros: '), err.message);
            return exibirMenu();
        }

        if (results.length === 0) {
            console.log(chalk.default.yellow('Nenhum livro cadastrado na Estante Virtual!'));
            return exibirMenu();
        }

        console.log('Livros cadastrados: ');
        results.forEach((livro, index) => {
        console.log(`${index + 1}. ${livro.nome} (${livro.segmento}) (${livro.preco})`);
        });

        rl.question('Qual o número do livro que você deseja excluir? ', function(numero) {
            const index = parseInt(numero) - 1;
            if (index >= 0 && index < results.length) {
                rl.question(chalk.default.yellow(`Você tem certeza que deseja excluir o livro ${results[index].nome} da Estante Virtual? [use = S para sim/N para não]: `), function(confirmacao) {
                    if (confirmacao.toUpperCase() === 'S') {
                        const deleteQuery = 'DELETE FROM livros WHERE id = ?';
                        db.query(deleteQuery, [results[index].id], (err) => {
                            if (err) {
                                console.log(chalk.default.red('Erro ao excluir livro: '), err.message);
                            } else {
                                console.log(chalk.default.green(`O livro ${results[index].nome} foi excluído com sucesso!`));
                            }
                            exibirMenu();
                        });    
                    } else {
                        console.log(chalk.default.yellow('Livro não excluído!'));
                        exibirMenu();
                    }
                });
            } else {
                console.log(chalk.default.red('Número inválido.'));
                exibirMenu();
            }
        });
    });
};

// Função p fzr o backup dos livros cadastrados
const fazerBackup = function() {
    const query = 'SELECT * FROM livros';
    db.query(query, (err, results) => {
        if (err) {
            console.log(chalk.default.red('Erro ao buscar livros: '), err.message);
            return exibirMenu();
        }
    
        if (results.length === 0) {
            console.log(chalk.default.yellow('Nenhum livro cadastrado na Estante Virtual!'));
            return exibirMenu();
        }

        const dadosJson = JSON.stringify(results, null, 2);
        const caminhoArquivo = 'backup_EstanteVirtual.json';
        fs.writeFile(caminhoArquivo, dadosJson, (err) => {
            if (err) {
                console.log(chalk.default.red('Erro ao fazer o backup!'), err);
                exibirMenu();
            } else {
                console.log(chalk.default.green(`Backup realizado com sucesso! Dados salvos em ${caminhoArquivo}`));
            }
            exibirMenu();
        });
    });
};

// Função p sair da aplicação
const sair = function() {
    console.log(chalk.default.blue('Tchau, até logo!\nSaindo...'));
    rl.close();
};

// Exporta as funções p serem usadas em outros módulos
module.exports = {
    iniciar,
    exibirMenu,
    cadastrarLivro,
    editarEstante,
    verEstante,
    excluirLivro,
    fazerBackup,
    sair
};