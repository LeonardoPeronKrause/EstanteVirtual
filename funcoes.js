const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const livros = [];

const iniciar = function() {
    console.log('Bem vindo à EstanteVirtual, o seu espaço para gerenciamento de livros!\n');
    exibirMenu();
}

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
    rl.question('Qual o nome do livro que você deseja cadastrar? ', function(nome){
        const livro = {nome: nome};
        livros.push(livro);
        console.log(`O livro ${nome} foi cadastrado com sucesso!`);
        exibirMenu();
    });
};

const editarEstante = function() {
    console.log('ola');
};

const verEstante = function() {
    console.log(livros);
    exibirMenu();
};

const excluirLivro = function() {
    console.log('vai');
};

const fazerBackup = function() {
    console.log(aaaaa);
};

const sair = function() {
    console.log('Tchau, até logo!\nSaindo...');
};

exibirMenu();