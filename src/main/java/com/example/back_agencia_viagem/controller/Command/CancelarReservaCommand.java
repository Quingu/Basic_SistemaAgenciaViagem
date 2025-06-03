package com.example.back_agencia_viagem.controller.Command;

import com.example.back_agencia_viagem.repository.ReservaRepository;

public class CancelarReservaCommand implements ICommand {
    private final Long reservaId;
    private final ReservaRepository reservaRepository;

    public CancelarReservaCommand(Long reservaId, ReservaRepository reservaRepository) {
        this.reservaId = reservaId;
        this.reservaRepository = reservaRepository;
    }

    @Override
    public void execute() {
        reservaRepository.deleteById(reservaId);
        System.out.println("Reserva cancelada com sucesso.");
    }
}