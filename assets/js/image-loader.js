class ImagePreloader {
  constructor() {
    this.images = [
      'assets/images/parallax/bolos-artesanais.jpg',
      'assets/images/parallax/doces-finos.jpg',
      'assets/images/parallax/festa-eventos.jpg',
      'assets/images/parallax/confeitaria-interior.jpg'
    ];
  }

  preloadImages() {
    this.images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.markAsLoaded(index + 1);
      };
    });
  }

  markAsLoaded(parallaxNumber) {
    const element = document.querySelector(`.parallax-${parallaxNumber}`);
    if (element) {
      element.classList.add('loaded');
    }
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.lazyLoadWithObserver();
    } else {
      this.preloadImages();
    }
  }

  lazyLoadWithObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parallaxNumber = entry.target.className.match(/parallax-(\d)/)[1];
          this.preloadSpecificImage(parallaxNumber);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.parallax').forEach(el => {
      observer.observe(el);
    });
  }

  preloadSpecificImage(number) {
    const img = new Image();
    img.src = this.images[number - 1];
    img.onload = () => {
      this.markAsLoaded(number);
    };
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  window.imagePreloader = new ImagePreloader();
  window.imagePreloader.init();
});
