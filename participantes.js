const tabelaParticipantes = document.querySelector('#tabelaParticipantes tbody');
const btnGerarPDF = document.getElementById('btnGerarPDF');
const btnLimparTudo = document.getElementById('btnLimparTudo');

// Carregar participantes do localStorage
let participantes = JSON.parse(localStorage.getItem('participantesRifa')) || [];

// --- Soma do total recebido (considera apenas quem está marcado como pago) ---
function atualizarTotalRecebido() {
    const precoPorNumero = 2; // <<< defina o valor de cada número aqui
    let total = 0;

    participantes.forEach(p => {
        if (p.pago) {
            const qtd = Array.isArray(p.numeros) ? p.numeros.length : (p.numero ? 1 : 0);
            total += qtd * precoPorNumero;
        }
    });

    const el = document.getElementById('totalRecebido');
    if (el) {
        el.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}

// --- Monta/Atualiza a tabela ---
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
            <td>${p.telefone ?? ''}</td>
            <td>${Array.isArray(p.numeros) ? p.numeros.join(', ') : (p.numero ?? '')}</td>
            <td>
                <button class="btnWhatsApp" data-index="${index}">WhatsApp</button>
                <button class="btnEditar" data-index="${index}">Editar</button>
                <button class="btnExcluir" data-index="${index}">Excluir</button>
            </td>
        `;
        tabelaParticipantes.appendChild(row);
    });

    // Excluir
    document.querySelectorAll('.btnExcluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.dataset.index);
            if (confirm(`Deseja realmente excluir o participante ${participantes[idx].nome}?`)) {
                participantes.splice(idx, 1);
                localStorage.setItem('participantesRifa', JSON.stringify(participantes));
                atualizarTabela();
            }
        });
    });

    // WhatsApp
    document.querySelectorAll('.btnWhatsApp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.dataset.index);
            const participante = participantes[idx];
            const nums = Array.isArray(participante.numeros) ? participante.numeros.join(', ') : participante.numero;
            const mensagem = `Olá ${participante.nome}! Esses são seus números reservados na rifa: ${nums}.`;
            const linkWhatsApp = `https://wa.me/55${(participante.telefone || '').replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
            window.open(linkWhatsApp, '_blank');
        });
    });

    // Pago / Não pago  (um único listener por checkbox)
    document.querySelectorAll('.chkPago').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const idx = Number(e.currentTarget.dataset.index);
            participantes[idx].pago = e.currentTarget.checked;
            localStorage.setItem('participantesRifa', JSON.stringify(participantes));
            atualizarTotalRecebido(); // atualiza o total na hora
        });
    });

    // Editar
    document.querySelectorAll('.btnEditar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.dataset.index);
            const participante = participantes[idx];

            const row = e.currentTarget.closest('tr');
            row.innerHTML = `
                <td><input type="text" value="${participante.nome}" class="inputNomeEdit"></td>
                <td><input type="text" value="${participante.telefone}" class="inputTelefoneEdit"></td>
                <td><input type="text" value="${(Array.isArray(participante.numeros) ? participante.numeros.join(',') : participante.numero) || ''}" class="inputNumerosEdit"></td>
                <td>
                    <button class="btnSalvarEdicao" data-index="${idx}">Salvar</button>
                    <button class="btnCancelarEdicao">Cancelar</button>
                </td>
            `;

            // Salvar edição
            row.querySelector('.btnSalvarEdicao').addEventListener('click', () => {
                const novoNome = row.querySelector('.inputNomeEdit').value.trim();
                const novoTelefone = row.querySelector('.inputTelefoneEdit').value.trim();
                const novosNumeros = row.querySelector('.inputNumerosEdit').value
                    .split(',')
                    .map(n => parseInt(n.trim(), 10))
                    .filter(n => !isNaN(n));

                participantes[idx].nome = novoNome;
                participantes[idx].telefone = novoTelefone;
                participantes[idx].numeros = novosNumeros;

                localStorage.setItem('participantesRifa', JSON.stringify(participantes));
                atualizarTabela();
            });

            // Cancelar edição
            row.querySelector('.btnCancelarEdicao').addEventListener('click', () => {
                atualizarTabela();
            });
        });
    });

    // Chama UMA vez no final (e não dentro do forEach de linhas)
    atualizarTotalRecebido();
}

// Limpar tudo
btnLimparTudo.addEventListener('click', () => {
    if (confirm('Deseja realmente apagar todos os participantes e resetar a rifa?')) {
        participantes = [];
        localStorage.removeItem('participantesRifa');
        atualizarTabela();
        alert('Rifa resetada com sucesso!');
    }
});

// PDF
btnGerarPDF.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const marginLeft = 10;
    const maxWidth = 190; // largura máxima do texto antes de quebrar linha
    let y = 20;

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Lista de Participantes da Rifa', 105, y, null, null, 'center');
    y += 10;

    doc.setLineWidth(0.5);
    doc.line(marginLeft, y, 200, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    participantes.forEach((p, index) => {
        const nums = Array.isArray(p.numeros) ? p.numeros.join(', ') : (p.numero ?? '');

        // Fundo alternado
        if (index % 2 === 0) {
            doc.setFillColor(240);
            doc.rect(marginLeft - 2, y - 4, 190, 20, 'F');
        }

        // Nome
        doc.text(`Nome: ${p.nome}`, marginLeft, y);

        // Números - quebra automática se for muito longo
        const numerosTexto = `Números: ${nums}`;
        const numerosQuebrados = doc.splitTextToSize(numerosTexto, maxWidth);
        doc.text(numerosQuebrados, marginLeft, y + 7);

        // Pago
        doc.text(`Pago: ${p.pago ? 'Sim' : 'Não'}`, marginLeft, y + 7 + (numerosQuebrados.length - 1) * 7 + 7);

        // Linha separadora
        doc.setDrawColor(200);
        doc.setLineWidth(0.2);
        const alturaLinha = 25 + (numerosQuebrados.length - 1) * 7;
        doc.line(marginLeft - 2, y + alturaLinha - 5, 200, y + alturaLinha - 5);

        y += alturaLinha;

        // Quebra de página
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save('lista_participantes.pdf');
});

// Inicializa
atualizarTabela();
