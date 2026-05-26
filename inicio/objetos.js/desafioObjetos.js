/* Shift + Alt + A  -> Atalho para comentário de várias linhas

Desafio: Criar um objeto que contenha informações de um filme favorito,
sendo necessário inserir uma nova propriedade, modificar uma existente, e 
excluir uma propriedade. No final imprimir o objeto no console

*/

 const filmeFavorito = {
    titulo: "Senhor dos Anéis",
    lancamento: 2008,
    genero: "Fantasia" 
}

filmeFavorito.protagonista = "Frodo"; // Adicionar
console.log(filmeFavorito);

filmeFavorito.lancamento = 2012; // Modificar
console.log(filmeFavorito);

delete filmeFavorito.protagonista; // Excluir
console.log(filmeFavorito);
