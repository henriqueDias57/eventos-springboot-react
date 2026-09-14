package com.trabalho.eventos;

import com.trabalho.eventos.dto.EventoDTO;
import com.trabalho.eventos.exception.ResourceNotFoundException;
import com.trabalho.eventos.model.Categoria;
import com.trabalho.eventos.model.Evento;
import com.trabalho.eventos.repository.CategoriaRepository;
import com.trabalho.eventos.repository.EventoRepository;
import com.trabalho.eventos.service.EventoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class EventoServiceTest {

    @Mock
    private EventoRepository eventoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private EventoService eventoService;

    private Categoria categoria;
    private Evento evento;
    private EventoDTO eventoDTO;

    @BeforeEach
    void setUp() {
        categoria = Categoria.builder()
                .id(1L)
                .nome("Tecnologia")
                .descricao("Eventos de TI")
                .build();

        evento = Evento.builder()
                .id(1L)
                .titulo("Summit AI")
                .descricao("Conferência de IA")
                .dataEvento(LocalDateTime.now())
                .localEvento("São Paulo")
                .preco(new BigDecimal("150.00"))
                .categoria(categoria)
                .build();

        eventoDTO = EventoDTO.builder()
                .id(1L)
                .titulo("Summit AI")
                .descricao("Conferência de IA")
                .dataEvento(LocalDateTime.now())
                .localEvento("São Paulo")
                .preco(new BigDecimal("150.00"))
                .categoriaId(1L)
                .build();
    }

    @Test
    @DisplayName("Deve buscar evento por ID existente")
    void deveBuscarPorId() {
        Mockito.when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));

        EventoDTO resultado = eventoService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals("Summit AI", resultado.getTitulo());
    }

    @Test
    @DisplayName("Deve salvar novo evento com categoria válida")
    void deveSalvarEvento() {
        Mockito.when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        Mockito.when(eventoRepository.save(any(Evento.class))).thenReturn(evento);

        EventoDTO resultado = eventoService.salvar(eventoDTO);

        assertNotNull(resultado);
        assertEquals("Summit AI", resultado.getTitulo());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar criar evento com categoria inexistente")
    void deveLancarExcecaoCategoriaInexistente() {
        Mockito.when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());
        eventoDTO.setCategoriaId(99L);

        assertThrows(ResourceNotFoundException.class, () -> eventoService.salvar(eventoDTO));
    }
}
