// Componente do Mapa
(function () {
  "use strict";

  function initializarMapa() {
    console.log("Inicializando componente do mapa...");

    // Configurações do mapa
    const config = {
      // Coordenadas de exemplo (Av. Paulista, São Paulo)
      latitude: -23.5617,
      longitude: -46.6563,
      nome: "Confeitaria Doces & Sabores",
      endereco: "Av. Paulista, 1000 - São Paulo, SP",
      zoom: 15,
    };

    // Gerar URL do Google Maps
    const mapUrl = gerarUrlMapa(config);

    // Carregar mapa
    carregarMapa(mapUrl);

    // Atualizar link "Como Chegar"
    atualizarLinkComoChegar(config);
  }

  function gerarUrlMapa(config) {
    const baseUrl = "https://www.google.com/maps/embed/v1/place";
    const apiKey = "AIzaSyBFw0Qbyq9zTFTd-tUY6dpoWkSWwdQY8fU"; // Chave pública do Google (substitua por uma válida)

    // URL alternativa sem API key (usando coordenadas)
    const urlSemApi = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1973404567896!2d${
      config.longitude
    }!3d${
      config.latitude
    }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2z${encodeURIComponent(
      config.nome
    )}!5e0!3m2!1spt-BR!2sbr!4v1641234567890!5m2!1spt-BR!2sbr&z=${config.zoom}`;

    return urlSemApi;
  }

  function carregarMapa(url) {
    const iframe = document.getElementById("mapa-iframe");

    if (!iframe) {
      console.error("Elemento do mapa não encontrado");
      return;
    }

    // Mostrar loading
    iframe.classList.add("loading");
    iframe.classList.remove("loaded");

    // Configurar source do iframe
    iframe.src = url;

    // Event listener para quando o mapa carregar
    iframe.addEventListener("load", function () {
      console.log("Mapa carregado com sucesso");
      iframe.classList.remove("loading");
      iframe.classList.add("loaded");
    });

    // Fallback em caso de erro
    iframe.addEventListener("error", function () {
      console.error("Erro ao carregar o mapa");
      mostrarErroMapa();
    });

    // Timeout para fallback
    setTimeout(function () {
      if (iframe.classList.contains("loading")) {
        console.log("Timeout no carregamento do mapa, aplicando fallback");
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
      iframe.outerHTML = `
        <div class="mapa-erro">
          <i>🗺️</i>
          <p><strong>Erro ao carregar o mapa</strong></p>
          <p>Clique em "Como Chegar" para ver no Google Maps</p>
        </div>
      `;
    }
  }

  // Função para criar mapa padrão caso o componente não seja carregado
  function criarMapaPadrao() {
    const container = document.getElementById("mapa-container");
    if (container && container.innerHTML.trim() === "") {
      console.log("Criando mapa padrão...");
      container.innerHTML = `
        <div class="mapa-container">
          <iframe class="mapa loading"
            id="mapa-iframe"
            src=""
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          <a href="https://maps.google.com/?q=Confeitaria+Doces+e+Sabores"
             target="_blank"
             class="btn-como-chegar">
            📍 Como Chegar
          </a>
        </div>
      `;
      initializarMapa();
    }
  }

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(initializarMapa, 500);
    });
  } else {
    setTimeout(initializarMapa, 500);
  }

  // Também tentar inicializar quando a página carregar completamente
  window.addEventListener("load", function () {
    setTimeout(function () {
      if (!document.getElementById("mapa-iframe")) {
        console.log("Tentativa adicional de criar mapa...");
        initializarMapa();
      }
    }, 1000);
  });

  // Exportar funções para uso global se necessário
  window.MapaComponent = {
    inicializar: initializarMapa,
    criarPadrao: criarMapaPadrao,
    criarCompleto: criarEstruturaCompleta,
  };

  console.log("Componente do mapa carregado!");
})();
