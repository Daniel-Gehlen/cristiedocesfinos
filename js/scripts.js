document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initSmoothScrolling();
  initAnimations();
  initModernParallax();
  initScrollProgress();
});

function initNavigation() {
  const navLinks = document.querySelectorAll(".nav a");
  const header = document.querySelector(".header");

  // Update active link on scroll
  window.addEventListener("scroll", function () {
    const sections = document.querySelectorAll(".section, .parallax");
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const header = document.querySelector(".header");
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".section, .conteudo, .parallax")
    .forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(50px)";
      element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(element);
    });
}

function initModernParallax() {
  const parallaxElements = document.querySelectorAll(".parallax-inner");

  if (!parallaxElements.length) return;

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((element, index) => {
      const parent = element.parentElement;
      const parentTop = parent.offsetTop;
      const parentHeight = parent.offsetHeight;

      // Só animar quando o elemento estiver na viewport
      if (
        scrolled > parentTop - window.innerHeight &&
        scrolled < parentTop + parentHeight
      ) {
        const speed = 0.3;
        const yPos = (scrolled - parentTop) * speed;
        element.style.transform = `translateY(${yPos}px)`;
      }
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
  window.addEventListener("resize", requestTick);

  // Inicializar posição
  updateParallax();
}

// Adicione à função init() existente:
function init() {
  initNavigation();
  initSmoothScrolling();
  initAnimations();
  initModernParallax();
  initScrollProgress();
}

function initScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 4px;
    background: linear-gradient(90deg, #ff9a9e, #e84393, #fd79a8);
    z-index: 1001;
    transition: width 0.2s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", function () {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = progress + "%";
  });
}

// Efeito de digitação para títulos
function initTypewriterEffect() {
  const titles = document.querySelectorAll("h3");

  titles.forEach((title) => {
    const originalText = title.textContent;
    title.textContent = "";

    let i = 0;
    const typeWriter = setInterval(function () {
      if (i < originalText.length) {
        title.textContent += originalText.charAt(i);
        i++;
      } else {
        clearInterval(typeWriter);
      }
    }, 100);
  });
}

// Inicializar quando a página carregar
window.addEventListener("load", function () {
  initTypewriterEffect();
});
