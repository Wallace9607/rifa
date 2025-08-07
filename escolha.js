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
const numerosEmVermelho = [1, 2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 24, 28, 30, 33, 40, 41, 42, 59, 70, 72, 88, 99, 171, 183, 207, 260, 300, 358, 370, 417, 425, 472, 495,
                          21, 57, 37, 112, 221,  62, 108, 128, 149, 159, 173, 194, 219, 224, 239, 249, 286, 315, 330, 389, 440, 454, 492, 475, 404, 350, 145, 23, 53, 43,
                          81, 136, 169, 290, 354, 92, 160, 382, 455, 500, 10, 5, 7, 22, 25, 45, 55, 69, 49, 58, 76, 74, 73, 244, 245, 246, 251, 250, 256, 254, 248, 242, 231, 232, 233, 234, 228, 227, 226, 220, 225, 223, 229, 235, 241, 497, 491, 474, 473, 471, 465, 467, 468, 462, 461, 460, 459, 458, 457, 451, 452, 453, 456, 450, 449, 448, 447, 446, 445, 439, 441, 442, 430, 496, 487, 493, 499, 483, 486, 480, 479, 478, 477, 484, 400, 377, 378, 376, 375, 374, 373, 392, 393, 252];

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





