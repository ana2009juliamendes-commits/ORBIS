
// ORBIS - Sistema de interação

// Seleciona o botão principal
const startButton = document.getElementById("startButton");

// Seleciona a seção de exploração
const exploreSection = document.getElementById("explorar");

// Ação do botão
startButton.addEventListener("click", function() {

    alert("Bem-vindo ao ORBIS! Seu futuro começa com novas possibilidades.");

    exploreSection.scrollIntoView({
        behavior: "smooth"
    });

});


// Mensagem no console
console.log("ORBIS iniciado com sucesso!");
console.log("Explore possibilidades. Construa seu caminho.");
