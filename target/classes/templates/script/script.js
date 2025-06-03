document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

const API_BASE_URL = 'http://localhost:8080';

function inicializarApp() {
    configurarEventos();
    carregarDados();

    // Buscar reservas ao carregar a página (se houver ID na URL)
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('clienteId');
    if (clienteId) {
        document.getElementById('cliente-id-reservas').value = clienteId;
        buscarReservas();
    }
}

function configurarEventos() {
    // Eventos de formulário
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', evento => {
            evento.preventDefault();
            cadastrarCliente();
        });
    }

    const reservaForm = document.getElementById('reserva-form');
    if (reservaForm) {
        reservaForm.addEventListener('submit', evento => {
            evento.preventDefault();
            fazerReserva();
        });
    }

    const pagamentoForm = document.getElementById('pagamento-form');
    if (pagamentoForm) {
        pagamentoForm.addEventListener('submit', evento => {
            evento.preventDefault();
            processarPagamento();
        });

        document.getElementById('metodo-pagamento')?.addEventListener('change', evento => {
            const cartaoInfo = document.getElementById('cartao-info');
            cartaoInfo.style.display = evento.target.value === 'CARTAO' ? 'block' : 'none';
        });
    }

    // Evento de buscar reservas
    const buscarReservasBtn = document.getElementById('buscar-reservas');
    if (buscarReservasBtn) {
        buscarReservasBtn.addEventListener('click', buscarReservas);
    }

    // Eventos dos filtros de pacotes
    const filtroDestino = document.getElementById('filtro-destino');
    const filtroPreco = document.getElementById('filtro-preco');
    const filtroDuracao = document.getElementById('filtro-duracao');

    if (filtroDestino) filtroDestino.addEventListener('input', filtrarPacotes);
    if (filtroPreco) filtroPreco.addEventListener('change', filtrarPacotes);
    if (filtroDuracao) filtroDuracao.addEventListener('change', filtrarPacotes);
}

function carregarDados() {
    carregarAgenciaInfo();
    carregarPacotes();
    carregarOpcoesPacotes();
}

async function carregarAgenciaInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/agencia/info`);
        if (!response.ok) throw new Error('Erro ao carregar informações da agência');
        const data = await response.text();
        document.getElementById('agencia-info').textContent = data;
    } catch (error) {
        console.error('Erro ao carregar informações da agência:', error);
        document.getElementById('agencia-info').textContent = 'Viagens Com Vantagens - CNPJ: 00.000.000/0001-00';
    }
}

async function carregarPacotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/pacotes`);
        if (!response.ok) throw new Error('Erro ao buscar pacotes');
        const pacotes = await response.json();

        // Armazena os pacotes para filtragem
        window.pacotesData = pacotes;

        // Exibe os pacotes com filtros
        filtrarPacotes();
    } catch (error) {
        console.error('Erro ao carregar pacotes:', error);
        document.getElementById('pacotes-list').innerHTML = `
            <div class="error-message">
                <p>Erro ao carregar pacotes. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

function filtrarPacotes() {
    if (!window.pacotesData) return;

    const filtroDestino = document.getElementById('filtro-destino')?.value.toLowerCase() || '';
    const filtroPreco = parseFloat(document.getElementById('filtro-preco')?.value) || 100000;
    const filtroDuracao = parseInt(document.getElementById('filtro-duracao')?.value) || 365;

    const pacotesFiltrados = window.pacotesData.filter(pacote => {
        const matchDestino = pacote.destino.toLowerCase().includes(filtroDestino);
        const matchPreco = pacote.preco <= filtroPreco;
        const matchDuracao = pacote.duracaoDias <= filtroDuracao;

        return matchDestino && matchPreco && matchDuracao;
    });

    exibirPacotes(pacotesFiltrados);
}

function exibirPacotes(pacotes) {
    const container = document.getElementById('pacotes-list');

    if (!pacotes || pacotes.length === 0) {
        container.innerHTML = '<p class="no-results">Nenhum pacote encontrado com esses filtros.</p>';
        return;
    }

    container.innerHTML = pacotes.map(pacote => `
        <div class="pacote-card">
            ${pacote.preco < 4000 ? '<span class="destaque-tag">Oferta!</span>' : ''}
            <img src="./images/${getImageName(pacote.destino)}" alt="${pacote.destino}" class="pacote-imagem" onerror="this.src='./images/default.jpg'">
            <div class="pacote-info">
                <h3>${pacote.destino}</h3>
                <div class="pacote-detalhes">
                    <span><i class="fas fa-calendar-alt"></i> ${pacote.duracaoDias} dias</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${getContinente(pacote.destino)}</span>
                </div>
                <div class="pacote-preco">R$ ${pacote.preco.toFixed(2).replace('.', ',')}</div>
                <div class="pacote-acoes">
                    <a href="reservar.html?pacoteId=${pacote.id}" class="btn btn-reservar">Reservar</a>
                    <button class="btn btn-detalhes" onclick="mostrarDetalhesPacote(${pacote.id})">Detalhes</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getImageName(destino) {
    const baseName = destino.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/\s+/g, '-'); // Substitui espaços por hífens

    // Verifica qual extensão existe no servidor
    return `${baseName}.jpg`; // Padrão principal
}
// Array com extensões suportadas (ordem de prioridade)
const EXTENSOES_IMAGEM = ['.jpg', '.jpeg', '.png'];

async function getImagePath(destino) {
    const baseName = destino.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

    // Verifica qual extensão existe no servidor
    for (const extensao of EXTENSOES_IMAGEM) {
        const caminho = `./images/${baseName}${extensao}`;
        const existe = await verificarImagemExiste(caminho);
        if (existe) return caminho;
    }

    return './images/default.jpg';
}

function verificarImagemExiste(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

function getContinente(destino) {
    const europa = ['Paris', 'Londres', 'Roma', 'Lisboa'];
    const america = ['Rio de Janeiro', 'Nova York', 'Buenos Aires', 'Cancún', 'Fernando de Noronha', 'Gramado'];
    const asia = ['Tóquio', 'Dubai'];

    if (europa.includes(destino)) return 'Europa';
    if (america.includes(destino)) return 'América';
    if (asia.includes(destino)) return 'Ásia';
    return 'Outros';
}

function mostrarDetalhesPacote(pacoteId) {
    const pacote = window.pacotesData.find(p => p.id === pacoteId);
    if (pacote) {
        alert(`Detalhes do pacote:\n\nDestino: ${pacote.destino}\nDuração: ${pacote.duracaoDias} dias\nPreço: R$ ${pacote.preco.toFixed(2)}\n\nDescrição completa disponível na página de reserva.`);
    }
}

async function carregarOpcoesPacotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/pacotes`);
        if (!response.ok) throw new Error('Erro ao buscar pacotes');

        const pacotes = await response.json();
        const select = document.getElementById('pacote-id');

        // Limpa opções anteriores
        select.innerHTML = '<option value="">Selecione um pacote</option>';

        if (pacotes.length === 0) {
            console.warn('Nenhum pacote disponível');
            return;
        }

        // Adiciona pacotes ao select
        pacotes.forEach(pacote => {
            const option = document.createElement('option');
            option.value = pacote.id;
            option.textContent = `${pacote.destino} - R$ ${pacote.preco.toFixed(2)} (${pacote.duracaoDias} dias)`;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar opções de pacotes:', error);
    }
}

async function cadastrarCliente() {
    const form = document.getElementById('cadastro-form');
    const cliente = {
        nome: form.nome.value,
        email: form.email.value,
        cpf: form.cpf.value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao cadastrar cliente');
        }

        const data = await response.json();
        alert(`Cliente cadastrado com sucesso! Seu ID é: ${data.id}`);
        form.reset();
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        alert(`Erro ao cadastrar cliente: ${error.message}`);
    }
}

async function fazerReserva() {
    const form = document.getElementById('reserva-form');

    const reserva = {
        cliente: { id: parseInt(form['cliente-id'].value) },
        pacote: { id: parseInt(form['pacote-id'].value) },
        dataReserva: form['data-reserva'].value,
        status: "PENDENTE"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/reservas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar reserva');
        }

        const reservaCriada = await response.json();
        alert('Reserva criada com sucesso!');

        // Redireciona para a página de pagamento
        window.location.href = `pagamento.html?reservaId=${reservaCriada.id}&valor=${reservaCriada.pacote.preco}`;

    } catch (error) {
        console.error('Erro ao fazer reserva:', error);
        alert(`Erro ao fazer reserva: ${error.message}`);
    }
}

async function buscarReservas() {
    const clienteId = document.getElementById('cliente-id-reservas').value;
    if (!clienteId) {
        alert('Por favor, informe seu ID de cliente.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reservas/cliente/${clienteId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar reservas');
        }

        const reservas = await response.json();
        exibirReservas(reservas);
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('reservas-container').innerHTML = `
            <div class="error-message">
                <p>Erro ao buscar reservas: ${error.message}</p>
                <p>Verifique o ID e tente novamente.</p>
            </div>
        `;
    }
}

function exibirReservas(reservas) {
    const container = document.getElementById('reservas-container');

    if (reservas.length === 0) {
        container.innerHTML = '<p class="no-results">Nenhuma reserva encontrada para este cliente.</p>';
        return;
    }

    container.innerHTML = reservas.map(reserva => `
        <div class="reserva-card ${reserva.status.toLowerCase()}">
            <div class="reserva-header">
                <h3>Reserva #${reserva.id}</h3>
                <span class="status-badge">${reserva.status}</span>
            </div>
            <div class="reserva-body">
                <p><strong>Destino:</strong> ${reserva.pacote.destino}</p>
                <p><strong>Data da Reserva:</strong> ${formatarData(reserva.dataReserva)}</p>
                <p><strong>Duração:</strong> ${reserva.pacote.duracaoDias} dias</p>
                <p><strong>Valor Total:</strong> R$ ${reserva.pacote.preco.toFixed(2)}</p>
            </div>
            <div class="reserva-actions">
                ${reserva.status === 'PENDENTE' ? `
                    <button onclick="abrirPagamento(${reserva.id}, ${reserva.pacote.preco})" class="btn pay-btn">
                        Pagar Reserva
                    </button>
                    <button onclick="cancelarReserva(${reserva.id})" class="btn cancel-btn">
                        Cancelar
                    </button>
                ` : `
                    <p class="payment-info">Pagamento confirmado</p>
                `}
            </div>
        </div>
    `).join('');
}

function formatarData(dataString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
}

function abrirPagamento(reservaId, valor) {
    window.location.href = `pagamento.html?reservaId=${reservaId}&valor=${valor}`;
}

async function cancelarReserva(reservaId) {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/reservas/${reservaId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao cancelar reserva');
        }

        alert('Reserva cancelada com sucesso!');
        buscarReservas(); // Atualiza a lista
    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro ao cancelar reserva: ${error.message}`);
    }
}

async function processarPagamento() {
    const form = document.getElementById('pagamento-form');
    const reservaId = form.reservaId.value;
    const metodo = form.metodo.value;
    const valor = parseFloat(form.valor.value);

    if (!metodo) {
        alert('Por favor, selecione um método de pagamento.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/pagamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservaId: parseInt(reservaId),
                metodo: metodo,
                valor: valor
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao processar pagamento');
        }

        const resultado = await response.text();
        alert(resultado);

        // Redirecionar para minhas reservas
        const clienteId = new URLSearchParams(window.location.search).get('clienteId') || '';
        window.location.href = `minhas-reservas.html?clienteId=${clienteId}`;

    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro ao processar pagamento: ${error.message}`);
    }
}