const readline = require('readline');

const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const livros = [];

const iniciar = function() {
    console.log('Bem vindo à EstanteVirtual, o seu espaço para gerenciamento de livros!\n');
    exibirMenu();
};

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
            console.log('Você digitou uma opção inválida!\n Tenta novamente...');
            exibirMenu();
        }
    });
};

const cadastrarLivro = function() {
    rl.question('Qual o nome do livro que você deseja cadastrar? ', function(nome) {
        rl.question('Qual é o segmento do livro? ', function(segmento) {
            const livro = {
                nome,
                segmento
            };
            livros.push(livro);
            console.log(`O livro ${nome} do segmento ${segmento}, foi cadastrado com sucesso!`);
            exibirMenu();
        })
    });
};

const editarEstante = function() {
    if (livros.length === 0) {
        console.log('Nenhum livro cadastrado na Estante Virtual!');
        return exibirMenu();
    }

    console.log('Livros cadastrados: ');
    livros.forEach((livro, index) => {
        console.log(`${index + 1}. ${livro.nome} (${livro.segmento})`);
    });

    rl.question('Qual o número do livro que você deseja editar? ', function(numero) {
        const index = parseInt(numero) - 1;
        if (index >= 0 && index < livros.length) {
            rl.question('Qual o novo Nome do livro que você deseja editar? (Se deixar em branco o nome não irá alterar): ', function(novoNome) {
                rl.question('Qual o novo segmento do livro que você deseja editar? (Se deixar em branco o nome não irá alterar): ', function(novoSegmento) {
                    if (novoNome.trim() !== '') {
                        livros[index].nome = novoNome;
                    }
                    if (novoSegmento.trim() !== '') {
                        livros[index].segmento = novoSegmento;
                    }
                    console.log('O livro foi atualizado com sucesso!');
                    exibirMenu();
                });
            });
        } else {
            console.log('Número inválido!');
            exibirMenu();
        }
    });
};

const verEstante = function() {
    if (livros.length === 0) {
        console.log('Nenhum livro cadastrdo na Estante Virtual!');
    } else {
        console.log('Livros Cadastrados: \n');
        livros.forEach((livro, index) => {
            console.log(`${index + 1}. '${livro.nome}' do segmento: ${livro.segmento}. `);
        });
    }
    exibirMenu();
};

const excluirLivro = function() {
    if (livros.length === 0) {
        console.log('Nenhum livro cadastrado na Estante Virtual!');
        return exibirMenu();
    }

    console.log('Livros cadastrados: ');
    livros.forEach((livro, index) => {
        console.log(`${index + 1}. ${livro.nome} (${livro.segmento})`);
    });

    rl.question('Qual o número do livro que você deseja excluir? ', function(numero) {
        const index = parseInt(numero) - 1;
        if (index >= 0 && index < livros.length) {
            rl.question(`Você tem certeza que deseja excluir o livro ${livros[index].nome} da Estante Virtual? [use = S para sim/N para não]: `, function(confirmacao) {
                if (confirmacao.toUpperCase() === 'S') {
                    console.log(`O livro ${livros[index].nome} foi excluído com sucesso!`);
                    livros.splice(index, 1);
                    exibirMenu();
                } else if (confirmacao.toUpperCase() === 'N') {
                    console.log('Livro não excluído!');
                    exibirMenu();
                } else if (confirmacao.toUpperCase() !== 'S' && confirmacao.toUpperCase() !== 'N') {
                    console.log('Palavra inválida, por favor use = S para sim ou N para não. ');
                    exibirMenu();
                }
            });
        } else {
            console.log('Número inválido');
            exibirMenu();
        }
    });
};

const fazerBackup = function() {
    if (livros.length === 0) {
        console.log('Nenhum livro cadastrado na Estante Virtual!');
        return exibirMenu();
    }

    const dadosJson = JSON.stringify(livros, null, 2);
    const caminhoArquivo = 'backup_EstanteVirtual.json';
    fs.writeFile(caminhoArquivo, dadosJson, (err) => {
        if (err) {
            console.log('Erro ao fazer o backup!', err);
            exibirMenu();
        } else {
            console.log(`Backup realizado com sucesso! Dados salvos em ${caminhoArquivo}`);
        }
        exibirMenu();
    });

};

const sair = function() {
    console.log('Tchau, até logo!\nSaindo...');
    rl.close();
};

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