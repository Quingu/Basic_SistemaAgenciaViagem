package com.example.back_agencia_viagem.model.Factory;

import java.util.UUID;

public class CartaoCredito implements IMetodoPagamento {
    @Override
    public String processar(Double valor) {
        return "Pagamento com cartão aprovado! Valor: R$" + valor;
    }
}