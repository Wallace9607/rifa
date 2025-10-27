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
                          81, 136, 169, 290, 354, 92, 160, 382, 455, 500, 10, 5, 7, 22, 25, 45, 55, 69, 49, 58, 76, 74, 73, 244, 245, 246, 251, 250,
                          38, 26, 50, 27, 39, 275, 304, 326, 322, 238, 63, 34, 35, 85, 86, 50, 26, 5, 23, 86, 59, 169, 245, 472, 124, 215, 278, 345, 487, 386, 467, 20, 32, 46, 56, 66, 77, 96, 106, 93, 
                           65, 264, 306, 356, 469, 431, 132, 87, 54, 346, 347, 352, 353, 364, 365, 340, 341, 335, 334, 197, 227, 344, 392,
                           90, 444, 483, 374, 279, 168, 158, 242, 406, 433, 499, 498, 497, 496, 494, 493, 480, 479, 478, 477, 476, 462, 461, 460, 459, 458, 378, 377, 376, 375, 373, 324, 323, 321, 320, 
                           319, 299, 298, 297, 296, 295, 270, 269, 268, 267, 266, 234, 233, 232, 231, 230, 192, 191, 190, 187, 185, 166, 153, 144, 122,
                           120, 255, 150, 82, 83, 103, 491, 31, 204, 442, 457, 420, 387, 474, 355, 316, 287, 271, 237,
                          403, 405, 407, 408, 414, 413, 412, 411, 410, 422, 436, 435, 441, 447, 443, 456, 473, 471, 470, 481, 482, 484, 490, 488,36, 48, 47, 67, 44,
                           52, 107, 115, 138, 140, 172, 205, 228, 241, 486, 329, 318, 307, 285, 274, 263, 252, 236, 225, 214, 203, 181, 84, 95, 117, 129, 101, 123,
                           134, 156, 167, 178, 189, 384, 395, 442, 457, 420, 387, 474, 355, 316, 287, 271, 237, 401, 409,390, 396, 402
];

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

    // Impede seleção se estiver reservado ou em vermelho
    if (!reservado && !numerosEmVermelho.includes(i)) {
        numeroDiv.addEventListener('click', () => {
            if (numeroDiv.classList.contains('selecionado')) {
                numeroDiv.classList.remove('selecionado');
                numerosSelecionados = numerosSelecionados.filter(num => num !== i);
            } else {
                numeroDiv.classList.add('selecionado');
                numerosSelecionados.push(i);
            }
        });
    } else {
        // Apenas para visualização: deixa reservado ou vermelho como não clicável
        numeroDiv.classList.add('nao-selecionavel');
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

document.getElementById('btnCompartilhar').addEventListener('click', () => {
  const url = 'https://wallace9607.github.io/rifa/escolha.html';
  const titulo = "Participe da minha Rifa!";
  const texto = "Escolha seus números antes que acabem! 🍀";

  if (navigator.share) {
    navigator.share({
      title: titulo,
      text: texto,
      url: url
    }).then(() => {
      console.log('Rifa compartilhada com sucesso!');
    }).catch(err => {
      console.error('Erro ao compartilhar:', err);
    });
  } else {
    // Fallback: copiar link para a área de transferência
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copiado! Agora é só colar e compartilhar onde quiser.");
    }).catch(err => {
      alert("Não foi possível copiar o link. Copie manualmente:\n" + url);
    });
  }
});









