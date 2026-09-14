package com.trabalho.eventos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trabalho.eventos.controller.EventoController;
import com.trabalho.eventos.dto.EventoDTO;
import com.trabalho.eventos.service.EventoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EventoController.class)
class EventoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventoService eventoService;

    @Test
    @DisplayName("Deve buscar evento por ID com sucesso")
    void deveBuscarEventoPorId() throws Exception {
        EventoDTO dto = EventoDTO.builder()
                .id(1L)
                .titulo("Summit AI")
                .descricao("IA Summit")
                .dataEvento(LocalDateTime.of(2026, 10, 15, 9, 0))
                .localEvento("SP Tech Center")
                .preco(new BigDecimal("150.00"))
                .categoriaId(1L)
                .nomeCategoria("Tecnologia")
                .build();

        Mockito.when(eventoService.buscarPorId(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/eventos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Summit AI"));
    }

    @Test
    @DisplayName("Deve criar um evento com sucesso")
    void deveCriarEvento() throws Exception {
        EventoDTO input = EventoDTO.builder()
                .titulo("Hackathon 2026")
                .descricao("Maratona de Dev")
                .dataEvento(LocalDateTime.of(2026, 11, 1, 8, 0))
                .localEvento("Auditório A")
                .preco(new BigDecimal("0.00"))
                .categoriaId(1L)
                .build();

        EventoDTO output = EventoDTO.builder()
                .id(10L)
                .titulo("Hackathon 2026")
                .descricao("Maratona de Dev")
                .dataEvento(LocalDateTime.of(2026, 11, 1, 8, 0))
                .localEvento("Auditório A")
                .preco(new BigDecimal("0.00"))
                .categoriaId(1L)
                .nomeCategoria("Tecnologia")
                .build();

        Mockito.when(eventoService.salvar(any(EventoDTO.class))).thenReturn(output);

        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.titulo").value("Hackathon 2026"));
    }
}
