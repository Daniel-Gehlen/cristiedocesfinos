// orcamento/form-orcamento.js
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar o formulário quando o DOM estiver carregado
  initBudgetForm();
});

function initBudgetForm() {
  // Gerar pergunta CAPTCHA simples
  generateCaptcha();

  // Iniciar temporizador
  startTimer();

  // Configurar contador de caracteres
  const detailsField = document.getElementById("details");
  if (detailsField) {
    detailsField.addEventListener("input", function () {
      const length = this.value.length;
      const charCount = document.getElementById("charCount");
      if (charCount) {
        charCount.textContent = `${length}/500 caracteres`;
      }

      // Verificar se o texto contém palavras suspeitas
      if (length > 20) {
        checkSuspiciousContent(this.value);
      }
    });
  }

  // Configurar seleção de produtos
  document.querySelectorAll(".product-option").forEach((option) => {
    option.addEventListener("click", function () {
      this.classList.toggle("selected");
      updateSelectedProducts();
    });
  });

  // Validar formato de telefone
  const phoneField = document.getElementById("phone");
  if (phoneField) {
    phoneField.addEventListener("blur", function () {
      const phonePattern = /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/;
      if (!phonePattern.test(this.value)) {
        this.setCustomValidity(
          "Por favor, insira um telefone no formato (11) 99999-9999"
        );
      } else {
        this.setCustomValidity("");
      }
    });
  }

  // Configurar envio do formulário
  const budgetForm = document.getElementById("budgetForm");
  if (budgetForm) {
    budgetForm.addEventListener("submit", function (e) {
      e.preventDefault();
      validateAndSubmitForm(this);
    });
  }
}

// Gerar pergunta CAPTCHA simples
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const captchaQuestion = document.getElementById("captchaQuestion");
  const captchaInput = document.getElementById("captcha");

  if (captchaQuestion && captchaInput) {
    captchaQuestion.textContent = `Quanto é ${num1} + ${num2}?`;
    captchaInput.setAttribute("data-expected", num1 + num2);
  }
}

// Temporizador para previnir bots
function startTimer() {
  const submitBtn = document.getElementById("submitBtn");
  const timerMessage = document.getElementById("timerMessage");
  const timerElement = document.getElementById("timer");

  if (submitBtn && timerMessage && timerElement) {
    submitBtn.disabled = true;
    timerMessage.style.display = "block";

    let seconds = 10;
    const countdown = setInterval(() => {
      seconds--;
      timerElement.textContent = seconds;

      if (seconds <= 0) {
        clearInterval(countdown);
        submitBtn.disabled = false;
        timerMessage.style.display = "none";
      }
    }, 1000);
  }
}

// Verificar conteúdo suspeito
function checkSuspiciousContent(text) {
  const suspiciousPatterns = [
    /http(s)?:\/\//i, // URLs
    /www\./i, // URLs
    /\.com|\.net|\.org/i, // Domínios
    /[0-9]{5,}/, // Muitos números juntos (possível telefone de spam)
    /promo|ofert(a|as)|desconto|compre|venda|ganhe|grátis|barato|aproveite/i, // Palavras de marketing
    /@[^\s]+@/, // Múltiplos @ (possível lista de emails)
    /bit\.ly|tinyurl|goo\.gl|shorturl/i, // Encurtadores de URL
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      const errorMessage = document.getElementById("errorMessage");
      const submitBtn = document.getElementById("submitBtn");

      if (errorMessage && submitBtn) {
        errorMessage.textContent =
          "Seu texto contém conteúdo não permitido. Por favor, descreva apenas informações relevantes para o orçamento.";
        errorMessage.style.display = "block";
        submitBtn.disabled = true;

        setTimeout(() => {
          errorMessage.style.display = "none";
          submitBtn.disabled = false;
        }, 5000);
      }
      return true;
    }
  }
  return false;
}

// Atualizar produtos selecionados
function updateSelectedProducts() {
  const selected = Array.from(
    document.querySelectorAll(".product-option.selected")
  ).map((opt) => opt.getAttribute("data-value"));
  const productsField = document.getElementById("products");

  if (productsField) {
    productsField.value = selected.join(",");
  }
}

// Validar e enviar formulário
function validateAndSubmitForm(form) {
  // Verificar campos honeypot (se preenchidos, é provavelmente um bot)
  const honeypot1 = document.getElementById("url").value;
  const honeypot2 = document.getElementById("name2").value;

  if (honeypot1 !== "" || honeypot2 !== "") {
    showError("Preenchimento detectado como inválido.");
    return;
  }

  // Verificar conteúdo suspeito nos detalhes
  const detailsText = document.getElementById("details").value;
  if (checkSuspiciousContent(detailsText)) {
    return;
  }

  // Validar CAPTCHA
  const captchaInput = document.getElementById("captcha").value;
  const expectedAnswer = document
    .getElementById("captcha")
    .getAttribute("data-expected");

  if (parseInt(captchaInput) !== parseInt(expectedAnswer)) {
    showError("Resposta do CAPTCHA incorreta. Tente novamente.");
    generateCaptcha();
    return;
  }

  // Verificar se o tempo mínimo foi respeitado
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn && submitBtn.disabled) {
    showError("Por favor, aguarde o tempo necessário antes de enviar.");
    return;
  }

  // Se todas as validações passaram, enviar o formulário
  form.submit();
}

// Mostrar mensagem de erro
function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }
}

// Mostrar mensagem de sucesso
function showSuccess() {
  const successMessage = document.getElementById("successMessage");
  if (successMessage) {
    successMessage.style.display = "block";
  }

  // Esconder mensagem de erro se estiver visível
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.style.display = "none";
  }
}
