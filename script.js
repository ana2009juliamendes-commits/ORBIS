
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

    document.querySelectorAll(".view").forEach(view =>
      view.classList.remove("active")
    );

    target.classList.add("active");

    document.querySelectorAll(".nav-item").forEach(button => {
      button.classList.toggle("active", button.dataset.view === viewName);
    });

    pageName.textContent = names[viewName] || "ORBIS";
    sidebar.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => openView(button.dataset.view));
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => openView(button.dataset.go));
  });

  mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.addEventListener("click", event => {
    if (
      window.innerWidth <= 760 &&
      !sidebar.contains(event.target) &&
      !mobileMenu.contains(event.target)
    ) {
      sidebar.classList.remove("open");
    }
  });

  // MINHA JORNADA
  const goalInput = document.getElementById("goal-input");
  const addGoalButton = document.getElementById("add-goal");
  const goalList = document.getElementById("goal-list");

  const journeySuggestions = [
    {
      words: ["arquitetura", "design", "interiores", "urbanismo"],
      steps: [
        "Pesquisar o que fazem profissionais dessa área.",
        "Conhecer os cursos, disciplinas e duração da formação.",
        "Explorar projetos, especializações e áreas de atuação.",
        "Comparar instituições de ensino e formas de ingresso."
      ]
    },
    {
      words: ["medicina", "saúde", "enfermagem", "psicologia", "biologia"],
      steps: [
        "Investigar as profissões e suas atividades cotidianas.",
        "Conhecer a formação e os requisitos de cada curso.",
        "Pesquisar as diferentes áreas de atuação.",
        "Comparar instituições e conversar com profissionais ou estudantes."
      ]
    },
    {
      words: ["programação", "tecnologia", "computação", "informática", "inteligência artificial"],
      steps: [
        "Explorar diferentes áreas da tecnologia.",
        "Conhecer cursos e conhecimentos fundamentais.",
        "Experimentar atividades introdutórias e pequenos projetos.",
        "Pesquisar formações e possibilidades profissionais."
      ]
    },
    {
      words: ["direito", "história", "educação", "sociologia", "humanas"],
      steps: [
        "Pesquisar as áreas de estudo e seus principais temas.",
        "Conhecer cursos e disciplinas da formação.",
        "Investigar possibilidades de atuação profissional.",
        "Comparar instituições e oportunidades de formação."
      ]
    },
    {
      words: ["administração", "economia", "negócios", "empreendedorismo", "gestão"],
      steps: [
        "Conhecer as áreas de negócios e gestão.",
        "Pesquisar cursos e conhecimentos necessários.",
        "Investigar diferentes ambientes de trabalho.",
        "Comparar formações e possibilidades de atuação."
      ]
    },
    {
      words: ["arte", "música", "comunicação", "publicidade", "audiovisual"],
      steps: [
        "Explorar linguagens e áreas criativas.",
        "Conhecer cursos, técnicas e ferramentas utilizadas.",
        "Pesquisar portfólios e projetos de profissionais.",
        "Investigar formações e caminhos de atuação."
      ]
    }
  ];

  function createJourneySteps(goal) {
    const normalized = goal.toLowerCase();

    const match = journeySuggestions.find(group =>
      group.words.some(word => normalized.includes(word))
    );

    if (match) return match.steps;

    return [
      "Pesquisar e entender melhor esse objetivo.",
      "Identificar conhecimentos e habilidades relacionados.",
      "Conhecer cursos, experiências ou oportunidades possíveis.",
      "Definir uma pequena ação para continuar explorando."
    ];
  }

  let goals = [];

  try {
    const saved = JSON.parse(localStorage.getItem("orbis-goals")) || [];

    // Compatibilidade com objetivos registrados na versão anterior
    goals = saved.map(item => {
      if (typeof item === "string") {
        return {
          title: item,
          steps: createJourneySteps(item),
          completed: []
        };
      }

      return {
        title: item.title,
        steps: item.steps || createJourneySteps(item.title),
        completed: item.completed || []
      };
    });
  } catch {
    goals = [];
  }

  function saveGoals() {
    try {
      localStorage.setItem("orbis-goals", JSON.stringify(goals));
    } catch {
      alert("Não foi possível salvar neste navegador.");
    }
    renderGoals();
  }

  function renderGoals() {
    goalList.innerHTML = "";

    if (goals.length === 0) {
      const empty = document.createElement("p");
      empty.textContent =
        "Sua jornada começa com um objetivo. Registre sua primeira descoberta acima!";
      empty.className = "journey-empty";
      goalList.appendChild(empty);
      return;
    }

    goals.forEach((goal, goalIndex) => {
      const card = document.createElement("article");
      card.className = "goal-item";

      const heading = document.createElement("h3");
      heading.textContent = goal.title;

      const total = goal.steps.length;
      const completed = goal.completed.length;
      const percent = Math.round((completed / total) * 100);

      const progressText = document.createElement("p");
      progressText.textContent =
        `${completed} de ${total} etapas concluídas · ${percent}%`;

      const progress = document.createElement("progress");
      progress.max = 100;
      progress.value = percent;
      progress.setAttribute("aria-label", "Progresso da trajetória");

      const subtitle = document.createElement("p");
      subtitle.textContent = "TRILHA DE EXPLORAÇÃO SUGERIDA";
      subtitle.className = "journey-subtitle";

      const list = document.createElement("div");
      list.className = "journey-steps";

      goal.steps.forEach((step, stepIndex) => {
        const label = document.createElement("label");
        label.className = "journey-step";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = goal.completed.includes(stepIndex);

        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            goal.completed.push(stepIndex);
          } else {
            goal.completed = goal.completed.filter(
              number => number !== stepIndex
            );
          }
          saveGoals();
        });

        const text = document.createElement("span");
        text.textContent = step;

        label.append(checkbox, text);
        list.appendChild(label);
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Excluir objetivo";
      remove.className = "remove-goal";

      remove.addEventListener("click", () => {
        if (confirm("Deseja excluir este objetivo e suas etapas?")) {
          goals.splice(goalIndex, 1);
          saveGoals();
        }
      });

      card.append(
        heading,
        progressText,
        progress,
        subtitle,
        list,
        remove
      );

      goalList.appendChild(card);
    });
  }

  addGoalButton.addEventListener("click", () => {
    const title = goalInput.value.trim();

    if (!title) {
      alert("Escreva um objetivo antes de adicionar.");
      goalInput.focus();
      return;
    }

    goals.push({
      title,
      steps: createJourneySteps(title),
      completed: []
    });

    goalInput.value = "";
    saveGoals();
  });

  goalInput.addEventListener("keydown", event => {
    if (event.key === "Enter") addGoalButton.click();
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
    answers.forEach(answer => totals[answer]++);

    const highest = Math.max(...totals);
    const results = categories.filter(
      (_, index) => totals[index] === highest
    );

    quizArea.innerHTML = "";

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
      "Este resultado é uma reflexão inicial, não um teste psicológico ou indicação definitiva de carreira.";

    const restart = document.createElement("button");
    restart.className = "primary-button";
    restart.textContent = "Refazer questionário";

    restart.addEventListener("click", () => {
      currentQuestion = 0;
      answers = [];
      renderQuestion();
    });

    quizArea.append(title, description, list, note, restart);
  }

  quizButton.addEventListener("click", () => {
    currentQuestion = 0;
    answers = [];
    renderQuestion();
  });

  openView("inicio");
});
