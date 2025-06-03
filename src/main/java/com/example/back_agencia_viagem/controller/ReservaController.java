package com.example.back_agencia_viagem.controller;

import com.example.back_agencia_viagem.controller.Command.CancelarReservaCommand;
import com.example.back_agencia_viagem.controller.Command.ICommand;
import com.example.back_agencia_viagem.controller.Command.ReservaCommand;
import com.example.back_agencia_viagem.model.Reserva;
import com.example.back_agencia_viagem.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {
    @Autowired
    private ReservaRepository reservaRepository;

    @PostMapping
    public String criarReserva(@RequestBody Reserva reserva) {
        ICommand command = new ReservaCommand(reserva, reservaRepository);
        command.execute();
        return "Reserva criada com sucesso!";
    }

    @DeleteMapping("/{id}")
    public String cancelarReserva(@PathVariable Long id) {
        ICommand command = new CancelarReservaCommand(id, reservaRepository);
        command.execute();
        return "Reserva cancelada com sucesso!";
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Reserva> getReservasPorCliente(@PathVariable Long clienteId) {
        List<Reserva> reservas = reservaRepository.findByClienteId(clienteId);

        // Carrega os pacotes associados para incluir na resposta
        reservas.forEach(reserva -> {
            if (reserva.getPacote() != null) {
            }
        });

        return reservas;
    }
}