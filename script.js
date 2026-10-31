
// ===================================
// ORBIS - Sistema de interação
// ===================================

// Elementos principais
const startButton = document.getElementById("startButton");
const exploreSection = document.getElementById("explorar");

// Botão principal
if (startButton && exploreSection) {

    startButton.addEventListener("click", function() {

        exploreSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}

// Animação de entrada das seções
const sections = document.querySelectorAll("#sobre, #explorar");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

        }

    });

}, {
    threshold: 0.15
});

sections.forEach(section => {
    observer.observe(section);
});

// Inicialização
console.log("ORBIS iniciado com sucesso!");
console.log("Explore possibilidades. Construa seu caminho.");
