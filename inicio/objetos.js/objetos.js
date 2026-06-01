// Sintaxe de um objeto {}
const aluno = {
    nome: "Lucas", 
    idade: 24, 
    curso: "Técnico em Desenvolvimento de Sistemas"
}

console.log(aluno);
console.log(aluno.nome);
console.log(aluno.idade);

aluno.matricula = "2026TDS"; // Adiciona uma nova propriedade
aluno.idade = 18; // Atualiza caso existir

delete aluno.curso;
console.log(aluno);
