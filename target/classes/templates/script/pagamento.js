// pagamento.js
const API_BASE_URL = 'http://localhost:8080'; // Substitua pela URL real da sua API

document.addEventListener('DOMContentLoaded', function() {
    // Obter parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const reservaId = urlParams.get('reservaId');
    const valorParam = urlParams.get('valor');
    const valor = valorParam ? parseFloat(valorParam) : 0;

    console.log('Parâmetros da URL:', { reservaId, valor }); // Log para depuração

    // Verificar se os parâmetros obrigatórios estão presentes
    if (!reservaId || isNaN(valor) || valor <= 0) {
        alert('Parâmetros inválidos na URL. Redirecionando...');
        window.location.href = 'index.html';
        return;
    }

    // Preencher dados da reserva
    document.getElementById('reserva-id').value = reservaId;
    document.getElementById('valor-total').value = valor.toFixed(2);
    document.getElementById('valor-display').textContent = `R$ ${valor.toFixed(2)}`;

    // Carregar detalhes da reserva
    carregarDetalhesReserva(reservaId);

    // Configurar mudança de método de pagamento
    document.getElementById('metodo-pagamento').addEventListener('change', function() {
        const metodo = this.value;
        document.querySelectorAll('.payment-method-fields, .payment-method-message').forEach(el => {
            el.style.display = 'none';
        });

        if (metodo === 'CARTAO') {
            document.getElementById('cartao-fields').style.display = 'block';
        } else if (metodo === 'BOLETO') {
            document.getElementById('boleto-message').style.display = 'block';
        } else if (metodo === 'PIX') {
            document.getElementById('pix-message').style.display = 'block';
        }
    });

    // Configurar formulário de pagamento
    document.getElementById('pagamento-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processarPagamento();
    });
});

async function carregarDetalhesReserva(reservaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas/${reservaId}`);
        if (!response.ok) throw new Error('Reserva não encontrada');

        const reserva = await response.json();
        const resumoDiv = document.getElementById('resumo-reserva-detalhes');

        resumoDiv.innerHTML = `
            <p><strong>Destino:</strong> ${reserva.pacote.destino}</p>
            <p><strong>Data da Reserva:</strong> ${formatarData(reserva.dataReserva)}</p>
            <p><strong>Duração:</strong> ${reserva.pacote.duracaoDias} dias</p>
            <p><strong>Status:</strong> ${reserva.status}</p>
        `;
    } catch (error) {
        console.error('Erro ao carregar reserva:', error);
        document.getElementById('resumo-reserva-detalhes').innerHTML =
            '<p class="error">Não foi possível carregar os detalhes da reserva.</p>';
    }
}

function formatarData(dataString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
}

async function processarPagamento() {
    const form = document.getElementById('pagamento-form');
    const reservaId = document.getElementById('reserva-id').value;
    const metodo = document.getElementById('metodo-pagamento').value;
    const valor = parseFloat(document.getElementById('valor-total').value);

    console.log('Dados do pagamento:', { reservaId, metodo, valor }); // Log para depuração

    // Validações básicas
    if (!reservaId) {
        alert('ID da reserva não encontrado. Por favor, recarregue a página.');
        return;
    }

    if (!metodo) {
        alert('Por favor, selecione um método de pagamento.');
        return;
    }

    if (isNaN(valor)) {
        alert('Valor inválido. Por favor, recarregue a página.');
        return;
    }

    // Validação para pagamento com cartão
    if (metodo === 'CARTAO') {
        const numeroCartao = document.getElementById('numero-cartao').value;
        const nomeCartao = document.getElementById('nome-cartao').value;
        const validadeCartao = document.getElementById('validade-cartao').value;
        const cvvCartao = document.getElementById('cvv-cartao').value;

        if (!numeroCartao || !nomeCartao || !validadeCartao || !cvvCartao) {
            alert('Por favor, preencha todos os dados do cartão.');
            return;
        }
    }

    try {
        // Preparar os dados para envio
        const dadosPagamento = {
            reservaId: parseInt(reservaId),
            metodo: metodo,
            valor: valor
        };

        // Adicionar dados do cartão se for o método selecionado
        if (metodo === 'CARTAO') {
            dadosPagamento.cartao = {
                numero: document.getElementById('numero-cartao').value,
                nomeTitular: document.getElementById('nome-cartao').value,
                validade: document.getElementById('validade-cartao').value,
                cvv: document.getElementById('cvv-cartao').value
            };
        }

        console.log('Dados enviados para a API:', dadosPagamento); // Log para depuração

        const response = await fetch(`${API_BASE_URL}/pagamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosPagamento)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao processar pagamento');
        }

        const resultado = await response.json();

        // Mostrar resultado do pagamento
        alert(`Pagamento realizado com sucesso! Status: ${resultado.status}`);

        // Redirecionar para minhas reservas
        const clienteId = document.getElementById('cliente-id-reservas')?.value || '';
        window.location.href = `minhas-reservas.html?clienteId=${clienteId}`;

    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro ao processar pagamento: ${error.message}`);
    }
}