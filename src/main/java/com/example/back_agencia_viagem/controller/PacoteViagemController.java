package com.example.back_agencia_viagem.controller;


import com.example.back_agencia_viagem.model.PacoteViagem;
import com.example.back_agencia_viagem.repository.PacoteViagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pacotes")
public class PacoteViagemController {

    @Autowired
    private PacoteViagemRepository pacoteRepository;

    // Cadastrar pacote (POST)
    @PostMapping
    public PacoteViagem criarPacote(@RequestBody PacoteViagem pacote) {
        return pacoteRepository.save(pacote);
    }

    // Listar todos os pacotes (GET)
    @GetMapping
    public List<PacoteViagem> listarPacotes() {
        return pacoteRepository.findAll();
    }
}

