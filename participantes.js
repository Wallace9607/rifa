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
            <td>
            <label class="switch">
                    <input type="checkbox" class="chkPago" data-index="${index}" ${p.pago ? 'checked' : ''}>
                    <span class="slider round"></span>
            </label>
            ${p.nome}
            </td>
            <td>${p.telefone}</td>
            <td>${Array.isArray(p.numeros) ? p.numeros.join(', ') : p.numero}</td>
            <td>
               
                <button class="btnWhatsApp" data-index="${index}">WhatsApp</button>
                <button class="btnEditar" data-index="${index}">Editar</button>
                <button class="btnExcluir" data-index="${index}">Excluir</button>
            </td>
        `;
        tabelaParticipantes.appendChild(row);
    });

    // Evento Excluir
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

    // Evento WhatsApp
    document.querySelectorAll('.btnWhatsApp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            const participante = participantes[idx];
            const mensagem = `Olá ${participante.nome}! Esses são seus números reservados na rifa: ${participante.numeros.join(', ')}.`;
            const linkWhatsApp = `https://wa.me/55${participante.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
            window.open(linkWhatsApp, '_blank');
        });
    });


    // Evento Pago/Não Pago
    document.querySelectorAll('.chkPago').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            participantes[idx].pago = e.target.checked;
            localStorage.setItem('participantesRifa', JSON.stringify(participantes));
        });
    });

    // Evento Editar
document.querySelectorAll('.btnEditar').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        const participante = participantes[idx];

        const row = e.target.closest('tr');
        row.innerHTML = `
            <td><input type="text" value="${participante.nome}" class="inputNomeEdit"></td>
            <td><input type="text" value="${participante.telefone}" class="inputTelefoneEdit"></td>
            <td><input type="text" value="${participante.numeros.join(',')}" class="inputNumerosEdit"></td>
            <td>
                <button class="btnSalvarEdicao" data-index="${idx}">Salvar</button>
                <button class="btnCancelarEdicao">Cancelar</button>
            </td>
        `;

        // Botão Salvar edição
        row.querySelector('.btnSalvarEdicao').addEventListener('click', () => {
            const novoNome = row.querySelector('.inputNomeEdit').value.trim();
            const novoTelefone = row.querySelector('.inputTelefoneEdit').value.trim();
            const novosNumeros = row.querySelector('.inputNumerosEdit').value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

            participantes[idx].nome = novoNome;
            participantes[idx].telefone = novoTelefone;
            participantes[idx].numeros = novosNumeros;

            localStorage.setItem('participantesRifa', JSON.stringify(participantes));
            atualizarTabela();
        });

        // Botão Cancelar edição
        row.querySelector('.btnCancelarEdicao').addEventListener('click', () => {
            atualizarTabela();
        });
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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Lista de Participantes da Rifa', 10, 20);

    let y = 30;
    participantes.forEach(p => {
        doc.setFontSize(12);
        doc.text(`Nome: ${p.nome}`, 10, y);
        doc.text(`Números: ${Array.isArray(p.numeros) ? p.numeros.join(', ') : p.numero}`, 10, y + 7);
        doc.text(`Pago: ${p.pago ? 'Sim' : 'Não'}`, 10, y + 14);
        y += 25;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save('lista_participantes.pdf');
});

// Inicializa a tabela na carga da página
atualizarTabela();
