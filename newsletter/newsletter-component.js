if (typeof NewsletterComponent === 'undefined') {
class NewsletterComponent {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    this.generateCaptcha();
    this.setupEventListeners();
    this.initialized = true;
  }

  generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const captchaQuestion = document.getElementById(
      "newsletter-captchaQuestion"
    );
    const captchaInput = document.getElementById("newsletter-captcha");

    if (captchaQuestion && captchaInput) {
      captchaQuestion.textContent = `Quanto é ${num1} + ${num2}?`;
      captchaInput.setAttribute("data-expected", num1 + num2);
    }
  }

  setupEventListeners() {
    const form = document.getElementById("newsletterForm");
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.showSuccess();
    this.resetForm();
    this.generateCaptcha();
  }

  validateForm() {
    // Verificar campo honeypot
    const honeypot = document.getElementById("newsletter-website").value;
    if (honeypot !== "") {
      this.showError("Preenchimento detectado como inválido.");
      return false;
    }

    // Validar CAPTCHA
    const captchaInput = document.getElementById("newsletter-captcha");
    const expectedAnswer = captchaInput.getAttribute("data-expected");
    const userAnswer = parseInt(captchaInput.value);

    if (userAnswer !== parseInt(expectedAnswer)) {
      this.showError("Resposta do CAPTCHA incorreta. Tente novamente.");
      this.generateCaptcha();
      return false;
    }

    // Validar email
    const email = document.getElementById("newsletter-email").value;
    if (!this.isValidEmail(email)) {
      this.showError("Por favor, insira um email válido.");
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(message) {
    const errorElement = document.getElementById("newsletter-errorMessage");
    const successElement = document.getElementById("newsletter-successMessage");

    if (errorElement && successElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
      successElement.style.display = "none";

      // Auto-hide after 5 seconds
      setTimeout(() => {
        errorElement.style.display = "none";
      }, 5000);
    }
  }

  showSuccess() {
    const successElement = document.getElementById("newsletter-successMessage");
    const errorElement = document.getElementById("newsletter-errorMessage");

    if (successElement && errorElement) {
      successElement.style.display = "block";
      errorElement.style.display = "none";
    }
  }

  resetForm() {
    const form = document.getElementById("newsletterForm");
    if (form) {
      form.reset();
    }
  }

  destroy() {
    const form = document.getElementById("newsletterForm");
    if (form) {
      form.removeEventListener("submit", this.handleSubmit);
    }
    this.initialized = false;
  }
}

// Initialize component when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const newsletter = new NewsletterComponent();
  newsletter.init();

  // Make it globally available if needed
  window.newsletterComponent = newsletter;
});
}
