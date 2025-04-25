// Controle de Menu Mobile
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});

// Código das camisolas
let camisolas = JSON.parse(localStorage.getItem('camisolas')) || [];

function salvarLocalStorage() {
  localStorage.setItem('camisolas', JSON.stringify(camisolas));
}

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
    card.className = 'camisola-card';
    card.innerHTML = `
      <img src="${camisola.imagem}" alt="Imagem da camisola" />
      <h3>${camisola.nome}</h3>
      <p><strong>${camisola.clube}</strong></p>
      <p>${camisola.epoca} - ${camisola.jogador}</p>
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
    salvarLocalStorage();
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
  if (confirm('Tem a certeza?')) {
    camisolas.splice(index, 1);
    salvarLocalStorage();
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
  salvarLocalStorage();
  renderizarCamisolas();
}

[filtroClube, filtroJogador, filtroEpoca].forEach(input => {
  input.addEventListener('input', renderizarCamisolas);
});

renderizarCamisolas();
