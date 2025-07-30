const rifaGrid = document.getElementById('rifa-grid');
const btnEscolher = document.getElementById('btnEscolher');

// Carregar configurações da Rifa
let configuracoesRifa = JSON.parse(localStorage.getItem('configuracoesRifa')) || {
    itemRifa: 'Rifa',
    quantidadeNumeros: 100
};

// Carregar participantes para saber números já reservados
let participantes = JSON.parse(localStorage.getItem('participantesRifa')) || [];

// Lista de números selecionados pelo participante
let numerosSelecionados = [];

// Montar Grid de Números
for (let i = 1; i <= configuracoesRifa.quantidadeNumeros; i++) {
    const numeroDiv = document.createElement('div');
    numeroDiv.classList.add('numero');
    numeroDiv.textContent = i;
    numeroDiv.id = `numero-${i}`;

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
    const numeroWhatsApp = '64993286584';  // <-- Seu número no formato internacional

    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank');
});