package com.trabalho.eventos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trabalho.eventos.controller.InscricaoController;
import com.trabalho.eventos.dto.InscricaoDTO;
import com.trabalho.eventos.service.InscricaoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InscricaoController.class)
class InscricaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InscricaoService inscricaoService;

    @Test
    @DisplayName("Deve listar inscrições por evento")
    void deveListarInscricoesPorEvento() throws Exception {
        InscricaoDTO dto = InscricaoDTO.builder()
                .id(100L)
                .nomeParticipante("Maria Oliveira")
                .emailParticipante("maria@email.com")
                .dataInscricao(LocalDateTime.now())
                .status("CONFIRMADA")
                .eventoId(1L)
                .tituloEvento("Summit AI")
                .build();

        Mockito.when(inscricaoService.listarPorEvento(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/inscricoes/evento/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nomeParticipante").value("Maria Oliveira"));
    }
}
