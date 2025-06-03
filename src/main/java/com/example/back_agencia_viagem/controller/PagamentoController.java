package com.example.back_agencia_viagem.controller;

import com.example.back_agencia_viagem.model.*;
import com.example.back_agencia_viagem.model.Factory.*;
import com.example.back_agencia_viagem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pagamentos")
public class PagamentoController {

    @Autowired
    private PagamentoRepository pagamentoRepo;

    @Autowired
    private ReservaRepository reservaRepo;

    // Classe interna para receber os dados da requisição
    public static class PagamentoRequest {
        private Long reservaId;
        private String metodo;
        private Double valor;

        // Getters e Setters
        public Long getReservaId() { return reservaId; }
        public void setReservaId(Long reservaId) { this.reservaId = reservaId; }

        public String getMetodo() { return metodo; }
        public void setMetodo(String metodo) { this.metodo = metodo; }

        public Double getValor() { return valor; }
        public void setValor(Double valor) { this.valor = valor; }
    }

    @PostMapping
    public ResponseEntity<?> processarPagamento(@RequestBody PagamentoRequest request) {
        try {
            // Verifica se reserva existe
            Reserva reserva = reservaRepo.findById(request.getReservaId())
                    .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

            // Seleciona método de pagamento
            IMetodoPagamento pagamento = switch (request.getMetodo().toLowerCase()) {
                case "cartao" -> new CartaoCredito();
                case "boleto" -> new BoletoBancario();
                default -> throw new RuntimeException("Método inválido: " + request.getMetodo());
            };

            // Processa pagamento
            String resultado = pagamento.processar(request.getValor());

            // Cria e salva o pagamento
            Pagamento pgto = new Pagamento();
            pgto.setReserva(reserva);
            pgto.setMetodo(request.getMetodo().toUpperCase());
            pgto.setValor(request.getValor());
            pgto.setStatus("APROVADO");
            pgto.setDataPagamento(LocalDateTime.now());
            pagamentoRepo.save(pgto);

            // Atualiza reserva
            reserva.setStatus("CONFIRMADA");
            reservaRepo.save(reserva);

            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}