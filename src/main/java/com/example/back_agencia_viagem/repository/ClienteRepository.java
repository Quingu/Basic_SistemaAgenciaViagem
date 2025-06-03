package com.example.back_agencia_viagem.repository;

import com.example.back_agencia_viagem.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}