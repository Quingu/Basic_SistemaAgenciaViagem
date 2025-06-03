package com.example.back_agencia_viagem.controller.Command;

import com.example.back_agencia_viagem.model.Reserva;
import com.example.back_agencia_viagem.repository.ReservaRepository;

public class ReservaCommand implements ICommand {
    private final Reserva reserva;
    private final ReservaRepository reservaRepository;

    public ReservaCommand(Reserva reserva, ReservaRepository reservaRepository) {
        this.reserva = reserva;
        this.reservaRepository = reservaRepository;
    }

    @Override
    public void execute() {
        // Validação adicional
        if (reserva.getCliente() == null || reserva.getCliente().getId() == null) {
            throw new IllegalArgumentException("Cliente ID é obrigatório");
        }
        if (reserva.getPacote() == null || reserva.getPacote().getId() == null) {
            throw new IllegalArgumentException("Pacote ID é obrigatório");
        }

        reservaRepository.save(reserva);
    }
}