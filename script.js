
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const mobileMenu = document.getElementById("mobile-menu");
  const pageName = document.getElementById("page-name");

  const names = {
    inicio: "Visão geral",
    autoconhecimento: "Autoconhecimento",
    explorador: "Explorador de áreas",
    comparador: "Comparador",
    jornada: "Minha jornada",
    biblioteca: "Biblioteca ORBIS"
  };

  function openView(viewName) {
    const target = document.getElementById("view-" + viewName);

    if (!target) return;

    document.querySelectorAll(".view").forEach(view => {
      view.classList.remove("active");
    });

    target.classList.add("active");

    document.querySelectorAll(".nav-item").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.view === viewName
      );
    });

    pageName.textContent = names[viewName] || "ORBIS";
    sidebar.classList.remove("open");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Navegação pelo menu lateral
  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => {
      openView(button.dataset.view);
    });
  });

  // Navegação pelos cartões e atalhos
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      openView(button.dataset.go);
    });
  });

  // Menu para celular
  mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Fechar menu ao clicar fora dele
  document.addEventListener("click", event => {
    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedMenuButton = mobileMenu.contains(event.target);

    if (
      window.innerWidth <= 760 &&
      !clickedInsideSidebar &&
      !clickedMenuButton
    ) {
      sidebar.classList.remove("open");
    }
  });

  // OBJETIVOS DA JORNADA
  const goalInput = document.getElementById("goal-input");
  const addGoalButton = document.getElementById("add-goal");
  const goalList = document.getElementById("goal-list");

  let goals = [];

  try {
    goals = JSON.parse(localStorage.getItem("orbis-goals")) || [];
  } catch {
    goals = [];
  }

  function renderGoals() {
    goalList.innerHTML = "";

    goals.forEach((goal, index) => {
      const item = document.createElement("div");
      item.className = "goal-item";

      const label = document.createElement("span");
      label.textContent = goal;

      const remove = document.createElement("button");
      remove.textContent = "Remover";
      remove.type = "button";
      remove.addEventListener("click", () => {
        goals.splice(index, 1);
        saveGoals();
      });

      item.append(label, remove);
      goalList.appendChild(item);
    });
  }

  function saveGoals() {
    localStorage.setItem("orbis-goals", JSON.stringify(goals));
    renderGoals();
  }

  addGoalButton.addEventListener("click", () => {
    const value = goalInput.value.trim();

    if (!value) {
      goalInput.focus();
      return;
    }

    goals.push(value);
    goalInput.value = "";
    saveGoals();
  });

  goalInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      addGoalButton.click();
    }
  });

  renderGoals();

  // QUESTIONÁRIO DE AUTOCONHECIMENTO
  const quizArea = document.getElementById("quiz-area");
  const quizButton = document.querySelector('[data-action="quiz"]');

  const questions = [
    {
      question: "Qual atividade mais desperta sua curiosidade?",
      options: [
        "Resolver problemas e investigar como as coisas funcionam",
        "Ajudar pessoas e compreender suas necessidades",
        "Criar, desenhar e comunicar ideias",
        "Organizar projetos e desenvolver estratégias"
      ]
    },
    {
      question: "Que tipo de assunto você gostaria de explorar?",
      options: [
        "Tecnologia, ciência e inovação",
        "Saúde, comportamento e sociedade",
        "Arte, cultura e comunicação",
        "Negócios, gestão e economia"
      ]
    },
    {
      question: "Em um projeto, qual papel parece interessante?",
      options: [
        "Pesquisar e encontrar soluções",
        "Colaborar e apoiar outras pessoas",
        "Imaginar e desenvolver algo novo",
        "Planejar etapas e coordenar atividades"
      ]
    },
    {
      question: "Como você prefere aprender algo novo?",
      options: [
        "Experimentando e resolvendo desafios",
        "Conversando e trocando experiências",
        "Criando projetos e explorando referências",
        "Organizando informações e fazendo planos"
      ]
    }
  ];

  let currentQuestion = 0;
  let answers = [];

  function renderQuestion() {
    const question = questions[currentQuestion];

    quizArea.innerHTML = "";

    const progress = document.createElement("p");
    progress.className = "quiz-progress";
    progress.textContent =
      `PERGUNTA ${currentQuestion + 1} DE ${questions.length}`;

    const title = document.createElement("h3");
    title.textContent = question.question;

    const options = document.createElement("div");
    options.className = "quiz-options";

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;

      if (answers[currentQuestion] === index) {
        button.classList.add("selected");
      }

      button.addEventListener("click", () => {
        answers[currentQuestion] = index;
        currentQuestion++;

        if (currentQuestion < questions.length) {
          renderQuestion();
        } else {
          renderResult();
        }
      });

      options.appendChild(button);
    });

    quizArea.append(progress, title, options);
    quizArea.hidden = false;
  }

  function renderResult() {
    const categories = [
      "Tecnologia, ciências e investigação",
      "Saúde, pessoas e sociedade",
      "Artes, criatividade e comunicação",
      "Negócios, planejamento e gestão"
    ];

    const totals = [0, 0, 0, 0];

    answers.forEach(answer => {
      totals[answer]++;
    });

    const highest = Math.max(...totals);
    const results = categories.filter(
      (_, index) => totals[index] === highest
    );

    quizArea.innerHTML = "";

    const label = document.createElement("p");
    label.className = "quiz-progress";
    label.textContent = "SUA EXPLORAÇÃO INICIAL";

    const title = document.createElement("h3");
    title.textContent = "Possibilidades para investigar";

    const description = document.createElement("p");
    description.textContent =
      "Suas respostas apontam assuntos que podem despertar seu interesse:";

    const list = document.createElement("ul");
    list.className = "quiz-results";

    results.forEach(result => {
      const item = document.createElement("li");
      item.textContent = result;
      list.appendChild(item);
    });

    const note = document.createElement("p");
    note.className = "quiz-note";
    note.textContent =
      "Este resultado é apenas um ponto de partida para reflexão. Não é um teste psicológico, diagnóstico ou indicação definitiva de carreira.";

    const restart = document.createElement("button");
    restart.className = "primary-button";
    restart.textContent = "Refazer questionário";

    restart.addEventListener("click", () => {
      currentQuestion = 0;
      answers = [];
      renderQuestion();
    });

    quizArea.append(label, title, description, list, note, restart);
  }

  quizButton.addEventListener("click", () => {
    currentQuestion = 0;
    answers = [];
    renderQuestion();
  });

  // Estado inicial
  openView("inicio");
});
