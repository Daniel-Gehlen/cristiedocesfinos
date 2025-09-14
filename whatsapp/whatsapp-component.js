class WhatsAppWidget {
  constructor() {
    this.widget = null;
    this.icon = null;
    this.closeButton = null;
    this.isVisible = false;
    this.timer = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    this.widget = document.getElementById("whatsapp-widget");
    this.icon = document.getElementById("whatsapp-icon");
    this.closeButton = document.getElementById("whatsapp-close");

    if (this.widget && this.icon && this.closeButton) {
      this.setupEventListeners();
      this.startTimer();
      this.initialized = true;
    }
  }

  setupEventListeners() {
    this.icon.addEventListener("click", () => this.toggleWidget());
    this.closeButton.addEventListener("click", () => this.hideWidget());

    document.addEventListener("click", (e) => {
      if (
        this.isVisible &&
        !this.widget.contains(e.target) &&
        !this.icon.contains(e.target)
      ) {
        this.hideWidget();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hideWidget();
      }
    });
  }

  toggleWidget() {
    if (this.isVisible) {
      this.hideWidget();
    } else {
      this.showWidget();
    }
  }

  showWidget() {
    this.widget.classList.remove("hidden");
    setTimeout(() => {
      this.widget.classList.add("visible");
      this.isVisible = true;
    }, 10);

    this.clearTimer();
  }

  hideWidget() {
    this.widget.classList.remove("visible");
    setTimeout(() => {
      this.widget.classList.add("hidden");
      this.isVisible = false;
      this.startTimer();
    }, 300);
  }

  startTimer() {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.showWidget();
    }, 2 * 60 * 1000); // 2 minutos
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  destroy() {
    this.clearTimer();
    if (this.icon) {
      this.icon.removeEventListener("click", this.toggleWidget);
    }
    if (this.closeButton) {
      this.closeButton.removeEventListener("click", this.hideWidget);
    }
    this.initialized = false;
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  window.whatsappWidget = new WhatsAppWidget();
  window.whatsappWidget.init();
});
