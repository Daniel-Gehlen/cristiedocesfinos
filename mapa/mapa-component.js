(function () {
  "use strict";

  function initializarMapa() {
    const config = {
      latitude: -23.5617,
      longitude: -46.6563,
      nome: "Confeitaria Doces & Sabores",
      endereco: "Av. Paulista, 1000 - São Paulo, SP",
      zoom: 15,
    };

    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1973404567896!2d${
      config.longitude
    }!3d${
      config.latitude
    }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2z${encodeURIComponent(
      config.nome
    )}!5e0!3m2!1spt-BR!2sbr!4v1641234567890!5m2!1spt-BR!2sbr&z=${config.zoom}`;

    carregarMapa(mapUrl);
    atualizarLinkComoChegar(config);
  }

  function carregarMapa(url) {
    const iframe = document.getElementById("mapa-iframe");

    if (!iframe) {
      return;
    }

    iframe.classList.add("loading");
    iframe.classList.remove("loaded");
    iframe.src = url;

    iframe.addEventListener("load", function () {
      iframe.classList.remove("loading");
      iframe.classList.add("loaded");
    });

    iframe.addEventListener("error", function () {
      mostrarErroMapa();
    });

    setTimeout(function () {
      if (iframe.classList.contains("loading")) {
        iframe.classList.remove("loading");
        iframe.classList.add("loaded");
      }
    }, 5000);
  }

  function atualizarLinkComoChegar(config) {
    const link = document.querySelector(".btn-como-chegar");
    if (link) {
      const query = encodeURIComponent(`${config.nome}, ${config.endereco}`);
      link.href = `https://maps.google.com/?q=${query}`;
    }
  }

  function mostrarErroMapa() {
    const container = document.querySelector(".mapa-container");
    if (container) {
      const iframe = container.querySelector(".mapa");
      iframe.outerHTML =
        '<div class="mapa-erro"><i>🗺️</i><p><strong>Erro ao carregar o mapa</strong></p><p>Clique em "Como Chegar" para ver no Google Maps</p></div>';
    }
  }

  function criarMapaPadrao() {
    const container = document.getElementById("mapa-container");
    if (container && container.innerHTML.trim() === "") {
      container.innerHTML =
        '<div class="mapa-container"><iframe class="mapa loading" id="mapa-iframe" src="" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><a href="https://maps.google.com/?q=Confeitaria+Doces+e+Sabores" target="_blank" class="btn-como-chegar">📍 Como Chegar</a></div>';
      initializarMapa();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(initializarMapa, 500);
    });
  } else {
    setTimeout(initializarMapa, 500);
  }

  window.addEventListener("load", function () {
    setTimeout(function () {
      if (!document.getElementById("mapa-iframe")) {
        initializarMapa();
      }
    }, 1000);
  });

  window.MapaComponent = {
    inicializar: initializarMapa,
    criarPadrao: criarMapaPadrao,
  };
})();
