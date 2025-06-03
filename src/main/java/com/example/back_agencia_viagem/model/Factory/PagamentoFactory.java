package com.example.back_agencia_viagem.model.Factory;

public class PagamentoFactory {
    public static IMetodoPagamento criarMetodoPagamento(String tipo) {
        return switch (tipo.toLowerCase()) {
            case "cartao" -> new CartaoCredito();
            case "boleto" -> new BoletoBancario();
            default -> throw new IllegalArgumentException("Método de pagamento inválido: " + tipo);
        };
    }
}