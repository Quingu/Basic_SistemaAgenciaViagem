package com.example.back_agencia_viagem.service;

import org.springframework.stereotype.Service;

@Service
public class AgenciaService {
    private static AgenciaService instance;

    private AgenciaService() {}

    public static synchronized AgenciaService getInstance() {
        if (instance == null) {
            instance = new AgenciaService();
        }
        return instance;
    }

    public String getInfoAgencia() {
        return "Agência Viagens Dream - CNPJ: 00.000.000/0001-00";
    }
}
