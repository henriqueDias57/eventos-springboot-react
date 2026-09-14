package com.trabalho.eventos;

import com.trabalho.eventos.dto.CategoriaDTO;
import com.trabalho.eventos.dto.CategoriaRelatorioDTO;
import com.trabalho.eventos.dto.CategoriaRelatorioProjection;
import com.trabalho.eventos.exception.ResourceNotFoundException;
import com.trabalho.eventos.model.Categoria;
import com.trabalho.eventos.repository.CategoriaRepository;
import com.trabalho.eventos.service.CategoriaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    private Categoria categoria;
    private CategoriaDTO categoriaDTO;

    @BeforeEach
    void setUp() {
        categoria = Categoria.builder()
                .id(1L)
                .nome("Tecnologia")
                .descricao("Eventos de TI")
                .build();

        categoriaDTO = CategoriaDTO.builder()
                .id(1L)
                .nome("Tecnologia")
                .descricao("Eventos de TI")
                .build();
    }

    @Test
    @DisplayName("Deve retornar todas as categorias")
    void deveListarTodasCategorias() {
        Mockito.when(categoriaRepository.findAll()).thenReturn(List.of(categoria));

        List<CategoriaDTO> resultado = categoriaService.listarTodas();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Tecnologia", resultado.get(0).getNome());
    }

    @Test
    @DisplayName("Deve buscar categoria por ID existente")
    void deveBuscarPorIdExistente() {
        Mockito.when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));

        CategoriaDTO resultado = categoriaService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals("Tecnologia", resultado.getNome());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando categoria não existir")
    void deveLancarExcecaoQuandoCategoriaNaoExistir() {
        Mockito.when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoriaService.buscarPorId(99L));
    }

    @Test
    @DisplayName("Deve salvar uma nova categoria com sucesso")
    void deveSalvarCategoria() {
        Mockito.when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        CategoriaDTO resultado = categoriaService.salvar(categoriaDTO);

        assertNotNull(resultado);
        assertEquals("Tecnologia", resultado.getNome());
    }

    @Test
    @DisplayName("Deve retornar resultado da Native Query de agregação")
    void deveRetornarRelatorioAgregadoNativeQuery() {
        CategoriaRelatorioDTO dtoMock = CategoriaRelatorioDTO.builder()
                .categoriaId(1L)
                .nomeCategoria("Tecnologia")
                .totalEventos(5L)
                .totalInscricoes(20L)
                .faturamentoEstimado(new BigDecimal("1000.00"))
                .build();

        Mockito.when(categoriaRepository.gerarRelatorioAgregadoNativeQuery()).thenReturn(List.of(dtoMock));

        List<CategoriaRelatorioProjection> relatorio = categoriaService.obterRelatorioAgregado();

        assertNotNull(relatorio);
        assertEquals(1, relatorio.size());
        assertEquals("Tecnologia", relatorio.get(0).getNomeCategoria());
        assertEquals(20L, relatorio.get(0).getTotalInscricoes());
    }
}
