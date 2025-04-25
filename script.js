
feather.replace();

const camisolas = JSON.parse(localStorage.getItem('camisolas')) || [];
const form = document.getElementById('camisola-form');
const container = document.getElementById('camisolas-container');
const contador = document.getElementById('contador');

function renderizar() {
    container.innerHTML = '';
    camisolas.forEach((camisola, index) => {
        const card = document.createElement('div');
        card.className = 'camisola-card';
        card.innerHTML = \`
            <img src="\${camisola.imagem}" alt="Camisola">
            <h3>\${camisola.nome}</h3>
            <p>\${camisola.clube}</p>
            <p>\${camisola.jogador}</p>
            <button onclick="remover(\${index})" class="btn">Remover</button>
        \`;
        container.appendChild(card);
    });
    contador.textContent = \`Total de Camisolas: \${camisolas.length}\`;
}

function remover(index) {
    camisolas.splice(index, 1);
    localStorage.setItem('camisolas', JSON.stringify(camisolas));
    renderizar();
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const leitor = new FileReader();
    const arquivo = document.getElementById('imagem').files[0];

    leitor.onloadend = function() {
        const camisola = {
            nome: document.getElementById('nome').value,
            clube: document.getElementById('clube').value,
            jogador: document.getElementById('jogador').value,
            epoca: document.getElementById('epoca').value,
            imagem: leitor.result || ''
        };
        camisolas.push(camisola);
        localStorage.setItem('camisolas', JSON.stringify(camisolas));
        renderizar();
        form.reset();
    };

    if (arquivo) {
        leitor.readAsDataURL(arquivo);
    } else {
        leitor.onloadend();
    }
});

renderizar();
