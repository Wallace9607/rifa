const rifaGrid = document.getElementById('rifa-grid');
const btnEscolher = document.getElementById('btnEscolher');

// Variável para armazenar os números selecionados
let numerosSelecionados = [];

// Carregar configurações da Rifa
let configuracoesRifa = JSON.parse(localStorage.getItem('configuracoesRifa')) || {
    itemRifa: 'Rifa',
    quantidadeNumeros: 500
};

// Carregar participantes para saber números já reservados
let participantes = JSON.parse(localStorage.getItem('participantesRifa')) || [];

// Lista de números que ficarão em vermelho
const numerosEmVermelho = [1, 2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 24, 28, 30, 33, 40, 41, 42, 59, 70, 72, 88, 99, 171, 183, 207, 260, 300, 358, 370, 417, 425, 472, 495];

// Montar Grid de Números
for (let i = 1; i <= configuracoesRifa.quantidadeNumeros; i++) {
    const numeroDiv = document.createElement('div');
    numeroDiv.classList.add('numero');
    numeroDiv.textContent = i;
    numeroDiv.id = `numero-${i}`;

    // Se o número estiver na lista, aplica o destaque vermelho
    if (numerosEmVermelho.includes(i)) {
        numeroDiv.classList.add('destaque-vermelho');
    }

    const reservado = participantes.some(p => p.numeros.includes(i));
    if (reservado) {
        numeroDiv.classList.add('reservado');
    } else {
        numeroDiv.addEventListener('click', () => {
            if (numeroDiv.classList.contains('selecionado')) {
                numeroDiv.classList.remove('selecionado');
                numerosSelecionados = numerosSelecionados.filter(num => num !== i);
            } else {
                numeroDiv.classList.add('selecionado');
                numerosSelecionados.push(i);
            }
        });
    }

    rifaGrid.appendChild(numeroDiv);
}

// Botão "Quero esses números" envia WhatsApp
btnEscolher.addEventListener('click', () => {
    if (numerosSelecionados.length === 0) {
        alert('Selecione pelo menos um número!');
        return;
    }

    const mensagem = `Olá! Gostaria de reservar os seguintes números para a rifa "${configuracoesRifa.itemRifa}": ${numerosSelecionados.join(', ')}.`;
    const numeroWhatsApp = '5564993286584';  // <- Número no formato internacional sem o "+"

    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank');
});
