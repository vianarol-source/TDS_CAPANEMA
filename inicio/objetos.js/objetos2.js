const carro = {
    modelo: "BMW 320i",
    ano: 2026,
    valor: "R$ 300.000,00",
    cor: "Branco",
    ligar: function () {
        console.log("Carro ligado!");
    }
}

console.log(carro.modelo);
carro.ligar();
