package com.trabalho.eventos.service;

import com.trabalho.eventos.dto.EventoDTO;
import com.trabalho.eventos.dto.EventoEstatisticaProjection;
import com.trabalho.eventos.exception.ResourceNotFoundException;
import com.trabalho.eventos.model.Categoria;
import com.trabalho.eventos.model.Evento;
import com.trabalho.eventos.repository.CategoriaRepository;
import com.trabalho.eventos.repository.EventoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Camada de serviço para gerenciamento de Eventos.
 */
@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final CategoriaRepository categoriaRepository;

    public EventoService(EventoRepository eventoRepository, CategoriaRepository categoriaRepository) {
        this.eventoRepository = eventoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<EventoDTO> listarTodos() {
        return eventoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventoDTO buscarPorId(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + id));
        return toDTO(evento);
    }

    @Transactional(readOnly = true)
    public List<EventoDTO> listarPorCategoria(Long categoriaId) {
        return eventoRepository.findByCategoriaId(categoriaId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventoDTO salvar(EventoDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + dto.getCategoriaId()));

        Evento evento = Evento.builder()
                .titulo(dto.getTitulo())
                .descricao(dto.getDescricao())
                .dataEvento(dto.getDataEvento())
                .localEvento(dto.getLocalEvento())
                .preco(dto.getPreco())
                .categoria(categoria)
                .build();

        Evento salvo = eventoRepository.save(evento);
        return toDTO(salvo);
    }

    @Transactional
    public EventoDTO atualizar(Long id, EventoDTO dto) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + id));

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + dto.getCategoriaId()));

        evento.setTitulo(dto.getTitulo());
        evento.setDescricao(dto.getDescricao());
        evento.setDataEvento(dto.getDataEvento());
        evento.setLocalEvento(dto.getLocalEvento());
        evento.setPreco(dto.getPreco());
        evento.setCategoria(categoria);

        Evento atualizado = eventoRepository.save(evento);
        return toDTO(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento não encontrado com id: " + id);
        }
        eventoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<EventoEstatisticaProjection> obterEstatisticasEventos() {
        return eventoRepository.obterEstatisticasEventosNativeQuery();
    }

    private EventoDTO toDTO(Evento evento) {
        return EventoDTO.builder()
                .id(evento.getId())
                .titulo(evento.getTitulo())
                .descricao(evento.getDescricao())
                .dataEvento(evento.getDataEvento())
                .localEvento(evento.getLocalEvento())
                .preco(evento.getPreco())
                .categoriaId(evento.getCategoria().getId())
                .nomeCategoria(evento.getCategoria().getNome())
                .build();
    }
}
