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
const numerosEmVermelho = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 
  26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 
  57, 58, 59, 62, 63, 65, 66, 67, 69, 70, 72, 73, 74, 76, 77, 81, 82, 83, 84, 85, 86, 87, 88, 90, 92, 93, 95, 96, 99, 
  101, 103, 106, 107, 108, 112, 115, 117, 120, 122, 123, 124, 128, 129, 132, 134, 136, 138, 140, 144, 145, 149, 150, 
  153, 156, 158, 159, 160, 166, 167, 168, 169, 171, 172, 173, 178, 181, 183, 185, 187, 189, 190, 191, 192, 194, 197, 
  203, 204, 205, 207, 214, 215, 219, 221, 224, 225, 227, 228, 230, 231, 232, 233, 234, 236, 237, 238, 239, 241, 242, 
  244, 245, 246, 249, 250, 251, 252, 255, 260, 263, 264, 266, 267, 268, 269, 270, 271, 274, 275, 278, 279, 285, 286, 
  287, 290, 295, 296, 297, 298, 299, 300, 304, 306, 307, 315, 316, 318, 319, 320, 321, 322, 323, 324, 326, 329, 330, 
  334, 335, 340, 341, 344, 345, 346, 347, 350, 352, 353, 354, 355, 356, 358, 364, 365, 370, 373, 374, 375, 376, 377, 
  378, 382, 384, 386, 387, 389, 390, 392, 395, 396, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 
  414, 417, 420, 422, 425, 431, 433, 435, 436, 440, 441, 442, 443, 444, 447, 454, 455, 456, 457, 458, 459, 460, 461, 
  462, 467, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 486, 487, 488, 490, 491, 
  492, 493, 494, 495, 496, 497, 498, 499, 500
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










