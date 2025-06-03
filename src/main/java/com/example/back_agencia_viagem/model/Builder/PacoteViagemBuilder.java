package com.example.back_agencia_viagem.model.Builder;

import com.example.back_agencia_viagem.model.PacoteViagem;

public class PacoteViagemBuilder {
    private PacoteViagem pacote;

    public PacoteViagemBuilder() {
        this.pacote = new PacoteViagem();
    }

    public PacoteViagemBuilder comDestino(String destino) {
        pacote.setDestino(destino);
        return this;
    }

    public PacoteViagemBuilder comPreco(Double preco) {
        pacote.setPreco(preco);
        return this;
    }

    public PacoteViagemBuilder comDuracaoDias(Integer duracaoDias) {
        pacote.setDuracaoDias(duracaoDias);
        return this;
    }

    public PacoteViagem build() {
        return this.pacote;
    }
}