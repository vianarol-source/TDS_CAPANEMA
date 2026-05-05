let temDinheiro = true;
let estaChovendo = false;
let carroEstaNaGaragem = false;

let logicaAnd = "#AND Você vai ao cinema?";
logicaAnd += temDinheiro && estaChovendo; 
console.log(logicaAnd);

let logicaOr = "#OR Você vai ao cinema?";
logicaOr += estaChovendo || carroEstaNaGaragem;
console.log(logicaOr);
