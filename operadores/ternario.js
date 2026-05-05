let hora = new Date();
console.log(hora.getHours() + ":" + hora.getMinutes());
let mensagem = hora <= 18 ? "Boa tarde" : "Boa noite";
console.log(mensagem);