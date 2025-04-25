// Funções para trabalhar com cookies
function getCamisolasFromCookie() {
    const match = document.cookie.match('(^| )camisolas=([^;]+)');
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[2]));
      } catch {
        return [];
      }
    }
    return [];
  }
  
  function saveCamisolasToCookie() {
    const json = encodeURIComponent(JSON.stringify(camisolas));
    // Expirar em 1 ano
    document.cookie = `camisolas=${json}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }
  
  // Inicializar array de camisolas a partir do cookie
  let camisolas = getCamisolasFromCookie();
  
  const form = document.getElementById('camisola-form');
  const container = document.getElementById('camisolas-container');
  const contador = document.getElementById('contador');
  const estatisticasClubes = document.getElementById('estatisticas-clubes');
  
  const filtroClube = document.getElementById('filtro-clube');
  const filtroJogador = document.getElementById('filtro-jogador');
  const filtroEpoca = document.getElementById('filtro-epoca');
  
  function renderizarCamisolas() {
    container.innerHTML = '';
    const filtros = {
      clube: filtroClube.value.toLowerCase(),
      jogador: filtroJogador.value.toLowerCase(),
      epoca: filtroEpoca.value.toLowerCase()
    };
  
    const filtradas = camisolas.filter(c =>
      c.clube.toLowerCase().includes(filtros.clube) &&
      c.jogador.toLowerCase().includes(filtros.jogador) &&
      c.epoca.toLowerCase().includes(filtros.epoca)
    );
  
    filtradas.forEach((camisola, index) => {
      const card = document.createElement('div');
      card.className = 'camisola-card fade-in';
      card.innerHTML = `
        <img src="${camisola.imagem}" alt="Imagem da camisola">
        <h3>${camisola.nome}</h3>
        <p><strong>Clube:</strong> ${camisola.clube}</p>
        <p><strong>Época:</strong> ${camisola.epoca}</p>
        <p><strong>Jogador:</strong> ${camisola.jogador}</p>
        <p><strong>Tamanho:</strong> ${camisola.tamanho}</p>
        <button onclick="editarCamisola(${index})">Editar</button>
        <button onclick="removerCamisola(${index})">Remover</button>
      `;
      container.appendChild(card);
    });
  
    contador.textContent = `Total de Camisolas: ${camisolas.length}`;
    atualizarEstatisticas();
  }
  
  function atualizarEstatisticas() {
    const clubes = {};
    camisolas.forEach(c => {
      clubes[c.clube] = (clubes[c.clube] || 0) + 1;
    });
  
    estatisticasClubes.innerHTML = '';
    for (let clube in clubes) {
      const p = document.createElement('p');
      p.textContent = `${clube}: ${clubes[clube]} camisola(s)`;
      estatisticasClubes.appendChild(p);
    }
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const leitor = new FileReader();
    const arquivo = document.getElementById('imagem').files[0];
  
    leitor.onloadend = function () {
      const novaCamisola = {
        nome: document.getElementById('nome').value,
        clube: document.getElementById('clube').value,
        epoca: document.getElementById('epoca').value,
        jogador: document.getElementById('jogador').value,
        tamanho: document.getElementById('tamanho').value,
        estado: document.getElementById('estado').value,
        origem: document.getElementById('origem').value,
        imagem: leitor.result || ''
      };
  
      camisolas.push(novaCamisola);
      saveCamisolasToCookie();
      renderizarCamisolas();
      form.reset();
    };
  
    if (arquivo) {
      leitor.readAsDataURL(arquivo);
    } else {
      leitor.onloadend();
    }
  });
  
  function removerCamisola(index) {
    if (confirm('Tem a certeza que deseja remover esta camisola?')) {
      camisolas.splice(index, 1);
      saveCamisolasToCookie();
      renderizarCamisolas();
    }
  }
  
  function editarCamisola(index) {
    const camisola = camisolas[index];
    document.getElementById('nome').value = camisola.nome;
    document.getElementById('clube').value = camisola.clube;
    document.getElementById('epoca').value = camisola.epoca;
    document.getElementById('jogador').value = camisola.jogador;
    document.getElementById('tamanho').value = camisola.tamanho;
    document.getElementById('estado').value = camisola.estado;
    document.getElementById('origem').value = camisola.origem;
  
    camisolas.splice(index, 1);
    saveCamisolasToCookie();
    renderizarCamisolas();
  }
  
  [filtroClube, filtroJogador, filtroEpoca].forEach(input => {
    input.addEventListener('input', renderizarCamisolas);
  });
  
  document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.cookie = `theme=${document.body.classList.contains('dark') ? 'dark' : 'light'}; path=/; max-age=${60 * 60 * 24 * 365}`;
  });
  
  // Manter tema a partir do cookie
  const themeMatch = document.cookie.match('(^| )theme=([^;]+)');
  if (themeMatch && themeMatch[2] === 'dark') {
    document.body.classList.add('dark');
  }
  
  // Animação de fade-in
  const style = document.createElement('style');
  style.innerHTML = `
    .fade-in { animation: fadeIn 0.4s ease-in-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  
  renderizarCamisolas();
  
  // Controlar abrir e fechar menu mobile
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('hidden');
});
