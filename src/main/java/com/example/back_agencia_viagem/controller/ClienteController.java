package com.example.back_agencia_viagem.controller;


import com.example.back_agencia_viagem.model.Cliente;
import com.example.back_agencia_viagem.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    // Cadastrar cliente (POST)
    @PostMapping
    public Cliente criarCliente(@RequestBody Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // Listar todos os clientes (GET)
    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }
}