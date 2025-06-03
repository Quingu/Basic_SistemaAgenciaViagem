package com.example.back_agencia_viagem.repository;

import com.example.back_agencia_viagem.model.PacoteViagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacoteViagemRepository extends JpaRepository<PacoteViagem, Long> {
}