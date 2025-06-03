package com.example.back_agencia_viagem.repository;

import com.example.back_agencia_viagem.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
}
