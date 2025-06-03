package com.example.back_agencia_viagem.model.Factory;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class BoletoBancario implements IMetodoPagamento {

    @Override
    public String processar(Double valor) {
        String vencimento = LocalDate.now().plusDays(3)
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        return "Boleto gerado!\n" +
                "Valor: R$" + valor + "\n" +
                "Vencimento: " + vencimento + "\n" +
                "Código: 12345.67890 12345.678901 12345.678901 1";
    }
}