package com.trabalho.eventos;

import com.trabalho.eventos.controller.RelatorioController;
import com.trabalho.eventos.dto.CategoriaRelatorioDTO;
import com.trabalho.eventos.dto.CategoriaRelatorioProjection;
import com.trabalho.eventos.service.CategoriaService;
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
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RelatorioController.class)
class RelatorioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoriaService categoriaService;

    @MockBean
    private EventoService eventoService;

    @Test
    @DisplayName("Deve retornar os dados da Native Query de agregação no formato JSON")
    void deveRetornarAgregacaoNativeQuery() throws Exception {
        CategoriaRelatorioProjection dtoMock = CategoriaRelatorioDTO.builder()
                .categoriaId(1L)
                .nomeCategoria("Tecnologia e Inovação")
                .totalEventos(2L)
                .totalInscricoes(4L)
                .faturamentoEstimado(new BigDecimal("400.00"))
                .build();

        Mockito.when(categoriaService.obterRelatorioAgregado()).thenReturn(List.of(dtoMock));

        mockMvc.perform(get("/api/relatorios/agregacao-categoria")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nomeCategoria").value("Tecnologia e Inovação"))
                .andExpect(jsonPath("$[0].totalInscricoes").value(4))
                .andExpect(jsonPath("$[0].faturamentoEstimado").value(400.00));
    }
}
