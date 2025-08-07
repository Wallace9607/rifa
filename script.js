const rifaGrid = document.getElementById('rifa-grid');
const cadastroForm = document.getElementById('cadastroForm');
const nomeInput = document.getElementById('nome');
const telefoneInput = document.getElementById('telefone');
const numeroEscolhidoInput = document.getElementById('numeroEscolhido');
const infoExistente = document.getElementById('infoExistente');

let participantes = JSON.parse(localStorage.getItem('participantesRifa')) || [];

// Corrigir participantes antigos que não têm o campo 'pago'
participantes = participantes.map(p => {
    if (p.pago === undefined) {
        p.pago = false;
    }
    return p;
});
localStorage.setItem('participantesRifa', JSON.stringify(participantes));

let configuracoesRifa = JSON.parse(localStorage.getItem('configuracoesRifa')) || {
    itemRifa: 'Rifa',
    quantidadeNumeros: 100
};


// Aplicar Configurações Iniciais
function aplicarConfiguracoes() {
    tituloRifa.textContent = `🍀${configuracoesRifa.itemRifa}🍀`;
    quantidadeNumerosInput.value = configuracoesRifa.quantidadeNumeros;
    itemRifaInput.value = configuracoesRifa.itemRifa;

    // Recriar Grid
    rifaGrid.innerHTML = '';
    for (let i = 1; i <= configuracoesRifa.quantidadeNumeros; i++) {
        const numeroDiv = document.createElement('div');
        numeroDiv.classList.add('numero');
        numeroDiv.textContent = i;
        numeroDiv.id = `numero-${i}`;
        rifaGrid.appendChild(numeroDiv);
    }

    atualizarGrid();  // <- Atualizar status de reservas após recriar Grid
}

// Atualizar a Grid com números reservados
function atualizarGrid() {
    for (let i = 1; i <= configuracoesRifa.quantidadeNumeros; i++) {
        const numeroDiv = document.getElementById(`numero-${i}`);
        if (!numeroDiv) continue; // Evita erros caso o número não exista no grid

        numeroDiv.classList.remove('reservado');

        const oldTooltip = numeroDiv.querySelector('.tooltip');
        if (oldTooltip) oldTooltip.remove();

        const participante = participantes.find(p => p.numeros.includes(i));

        if (participante) {
            numeroDiv.classList.add('reservado');

            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = participante.nome;
            numeroDiv.appendChild(tooltip);
        }
    }
}

// Detectar Nome já Cadastrado
nomeInput.addEventListener('input', () => {
    const nomeDigitado = nomeInput.value.trim().toLowerCase();
    const participanteExistente = participantes.find(p => p.nome.toLowerCase() === nomeDigitado);

    if (participanteExistente) {
        telefoneInput.value = participanteExistente.telefone;
        telefoneInput.setAttribute('readonly', 'true');
        infoExistente.style.display = 'inline';
    } else {
        telefoneInput.removeAttribute('readonly');
        telefoneInput.value = '';
        infoExistente.style.display = 'none';
    }
});

// Evento de Cadastro
cadastroForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const numerosTexto = numeroEscolhidoInput.value.trim(); // exemplo: "5,12,23"
    if (!nome || !numerosTexto) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    // Transformar texto em array de números
    const numerosEscolhidos = numerosTexto.split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num) && num >= 1 && num <= configuracoesRifa.quantidadeNumeros);

    if (numerosEscolhidos.length === 0) {
        alert(`Informe números válidos entre 1 e ${configuracoesRifa.quantidadeNumeros}.`);
        return;
    }

    // Verificar se os números já estão reservados
    for (let numero of numerosEscolhidos) {
        if (participantes.some(p => p.numeros && p.numeros.includes(numero))) {
            alert(`Número ${numero} já reservado! Escolha outros.`);
            return;
        }
    }

    // Verificar participante existente
    let participanteExistente = participantes.find(p => p.nome.toLowerCase() === nome.toLowerCase());

    if (participanteExistente) {
        // Adicionar novos números sem duplicar
        participanteExistente.numeros = participanteExistente.numeros || [];
        numerosEscolhidos.forEach(n => {
            if (!participanteExistente.numeros.includes(n)) {
                participanteExistente.numeros.push(n);
            }
        });
    } else {
        // Novo participante
        participantes.push({ nome, telefone, numeros: numerosEscolhidos, pago: false });
    }

    localStorage.setItem('participantesRifa', JSON.stringify(participantes));

    atualizarGrid();
    cadastroForm.reset();
    telefoneInput.removeAttribute('readonly');
    infoExistente.style.display = 'none';
});

// Sorteio
const btnSortear = document.getElementById('btnSortear');
const sorteioModal = document.getElementById('sorteioModal');
const numeroSorteadoSpan = document.getElementById('numeroSorteado');
const nomeSorteadoSpan = document.getElementById('nomeSorteado');

btnSortear.addEventListener('click', () => {
    const numerosReservados = participantes.flatMap(p => p.numeros);

    if (numerosReservados.length === 0) {
        alert("Nenhum número cadastrado para sortear!");
        return;
    }

    const numeroSorteado = numerosReservados[Math.floor(Math.random() * numerosReservados.length)];

    const participanteSorteado = participantes.find(p => p.numeros.includes(numeroSorteado));

    numeroSorteadoSpan.textContent = `Número: ${numeroSorteado}`;
    nomeSorteadoSpan.textContent = participanteSorteado ? participanteSorteado.nome : 'Desconhecido';
    nomeSorteadoSpan.classList.remove('hidden');
    sorteioModal.style.display = 'flex';

    setTimeout(() => {
        nomeSorteadoSpan.classList.add('show');
    }, 500);
});

sorteioModal.addEventListener('click', (e) => {
    if (e.target === sorteioModal) {
        sorteioModal.style.display = 'none';
    }
});

// CONFIGURAÇÕES DA RIFA
const btnConfig = document.getElementById('btnConfig');
const configModal = document.getElementById('configModal');
const itemRifaInput = document.getElementById('itemRifaInput');
const quantidadeNumerosInput = document.getElementById('quantidadeNumerosInput');
const salvarConfig = document.getElementById('salvarConfig');
const tituloRifa = document.getElementById('tituloRifa');

btnConfig.addEventListener('click', () => {
    configModal.style.display = 'flex';
});

salvarConfig.addEventListener('click', () => {
    const novoItem = itemRifaInput.value.trim() || 'Rifa';
    const novaQuantidade = parseInt(quantidadeNumerosInput.value);

    if (novaQuantidade < 1 || isNaN(novaQuantidade)) {
        alert('Informe uma quantidade válida de números!');
        return;
    }

    configuracoesRifa = {
        itemRifa: novoItem,
        quantidadeNumeros: novaQuantidade
    };

    localStorage.setItem('configuracoesRifa', JSON.stringify(configuracoesRifa));
    aplicarConfiguracoes();
    configModal.style.display = 'none';
});

configModal.addEventListener('click', (e) => {
    if (e.target === configModal) {
        configModal.style.display = 'none';
    }
});
                // Botão Limpar Tudo
                btnLimparTudo.addEventListener('click', () => {
                    if (confirm('Deseja realmente apagar todos os participantes e resetar a rifa?')) {
                        participantes = [];
                        localStorage.removeItem('participantesRifa');
                        atualizarTabela();
                        alert('Rifa resetada com sucesso!');
                    }
                });

// Carregar configurações e grid na inicialização
aplicarConfiguracoes();
