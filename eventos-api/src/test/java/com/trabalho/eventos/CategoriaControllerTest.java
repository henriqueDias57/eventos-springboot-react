package com.trabalho.eventos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trabalho.eventos.controller.CategoriaController;
import com.trabalho.eventos.dto.CategoriaDTO;
import com.trabalho.eventos.service.CategoriaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoriaController.class)
class CategoriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoriaService categoriaService;

    @Test
    @DisplayName("Deve listar todas as categorias com sucesso")
    void deveListarTodasAsCategorias() throws Exception {
        CategoriaDTO cat1 = CategoriaDTO.builder().id(1L).nome("Tecnologia").descricao("Tech").build();
        CategoriaDTO cat2 = CategoriaDTO.builder().id(2L).nome("Negócios").descricao("Biz").build();

        Mockito.when(categoriaService.listarTodas()).thenReturn(List.of(cat1, cat2));

        mockMvc.perform(get("/api/categorias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nome").value("Tecnologia"));
    }

    @Test
    @DisplayName("Deve criar uma nova categoria com sucesso")
    void deveCriarNovaCategoria() throws Exception {
        CategoriaDTO input = CategoriaDTO.builder().nome("Educação").descricao("Cursos e Workshops").build();
        CategoriaDTO output = CategoriaDTO.builder().id(3L).nome("Educação").descricao("Cursos e Workshops").build();

        Mockito.when(categoriaService.salvar(any(CategoriaDTO.class))).thenReturn(output);

        mockMvc.perform(post("/api/categorias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.nome").value("Educação"));
    }

    @Test
    @DisplayName("Deve deletar uma categoria por ID")
    void deveDeletarCategoria() throws Exception {
        Mockito.doNothing().when(categoriaService).deletar(1L);

        mockMvc.perform(delete("/api/categorias/1"))
                .andExpect(status().isNoContent());
    }
}
