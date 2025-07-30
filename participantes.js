const tabelaParticipantes = document.querySelector('#tabelaParticipantes tbody');
const btnGerarPDF = document.getElementById('btnGerarPDF');
const btnLimparTudo = document.getElementById('btnLimparTudo');

// Carregar participantes do localStorage
let participantes = JSON.parse(localStorage.getItem('participantesRifa')) || [];

// Função para atualizar a tabela
function atualizarTabela() {
    tabelaParticipantes.innerHTML = '';
    participantes.forEach((p, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.nome}</td>
            <td>${p.telefone}</td>
            <td>${Array.isArray(p.numeros) ? p.numeros.join(', ') : p.numero}</td>
            <td><button class="btnExcluir" data-index="${index}">Excluir</button></td>
        `;
        tabelaParticipantes.appendChild(row);
    });

    // Adicionar evento aos botões Excluir
    document.querySelectorAll('.btnExcluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            if (confirm(`Deseja realmente excluir o participante ${participantes[idx].nome}?`)) {
                participantes.splice(idx, 1);
                localStorage.setItem('participantesRifa', JSON.stringify(participantes));
                atualizarTabela();
            }
        });
    });
}

// Botão Limpar Tudo
btnLimparTudo.addEventListener('click', () => {
    if (confirm('Deseja realmente apagar todos os participantes e resetar a rifa?')) {
        participantes = [];
        localStorage.removeItem('participantesRifa');
        atualizarTabela();
        alert('Rifa resetada com sucesso!');
    }
});

// Função para gerar PDF (exemplo simples, pode usar jsPDF)
btnGerarPDF.addEventListener('click', () => {
    let conteudo = 'Lista de Participantes da Rifa\n\n';
    participantes.forEach(p => {
        conteudo += `Nome: ${p.nome}\nTelefone: ${p.telefone}\nNúmeros: ${Array.isArray(p.numeros) ? p.numeros.join(', ') : p.numero}\n\n`;
    });

    // Criar blob e abrir para download (modo simples)
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lista_participantes.txt';
    link.click();
});

// Inicializa a tabela na carga da página
atualizarTabela();
