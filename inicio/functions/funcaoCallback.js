// função que retorna função como parâmetro

//      nome da função      ----- ( parâmetros )
function execultarOperacao(a, b, operacao){
        return operacao(a, b);
}

function multiplicar(a, b){
    return a * b;
}

let resultado = execultarOperacao(4, 5, multiplicar)
console.log("Multiplicação: ", resultado);