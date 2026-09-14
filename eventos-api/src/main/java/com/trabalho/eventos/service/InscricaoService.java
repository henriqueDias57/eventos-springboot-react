package com.trabalho.eventos.service;

import com.trabalho.eventos.dto.InscricaoDTO;
import com.trabalho.eventos.exception.ResourceNotFoundException;
import com.trabalho.eventos.model.Evento;
import com.trabalho.eventos.model.Inscricao;
import com.trabalho.eventos.repository.EventoRepository;
import com.trabalho.eventos.repository.InscricaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Camada de serviço para gerenciamento de Inscrições.
 */
@Service
public class InscricaoService {

    private final InscricaoRepository inscricaoRepository;
    private final EventoRepository eventoRepository;

    public InscricaoService(InscricaoRepository inscricaoRepository, EventoRepository eventoRepository) {
        this.inscricaoRepository = inscricaoRepository;
        this.eventoRepository = eventoRepository;
    }

    @Transactional(readOnly = true)
    public List<InscricaoDTO> listarTodas() {
        return inscricaoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InscricaoDTO buscarPorId(Long id) {
        Inscricao inscricao = inscricaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscrição não encontrada com id: " + id));
        return toDTO(inscricao);
    }

    @Transactional(readOnly = true)
    public List<InscricaoDTO> listarPorEvento(Long eventoId) {
        return inscricaoRepository.findByEventoId(eventoId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InscricaoDTO salvar(InscricaoDTO dto) {
        Evento evento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + dto.getEventoId()));

        Inscricao inscricao = Inscricao.builder()
                .nomeParticipante(dto.getNomeParticipante())
                .emailParticipante(dto.getEmailParticipante())
                .dataInscricao(dto.getDataInscricao() != null ? dto.getDataInscricao() : LocalDateTime.now())
                .status(dto.getStatus() != null ? dto.getStatus() : "CONFIRMADA")
                .evento(evento)
                .build();

        Inscricao salva = inscricaoRepository.save(inscricao);
        return toDTO(salva);
    }

    @Transactional
    public InscricaoDTO atualizar(Long id, InscricaoDTO dto) {
        Inscricao inscricao = inscricaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscrição não encontrada com id: " + id));

        Evento evento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + dto.getEventoId()));

        inscricao.setNomeParticipante(dto.getNomeParticipante());
        inscricao.setEmailParticipante(dto.getEmailParticipante());
        if (dto.getStatus() != null) {
            inscricao.setStatus(dto.getStatus());
        }
        inscricao.setEvento(evento);

        Inscricao atualizada = inscricaoRepository.save(inscricao);
        return toDTO(atualizada);
    }

    @Transactional
    public void deletar(Long id) {
        if (!inscricaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inscrição não encontrada com id: " + id);
        }
        inscricaoRepository.deleteById(id);
    }

    private InscricaoDTO toDTO(Inscricao inscricao) {
        return InscricaoDTO.builder()
                .id(inscricao.getId())
                .nomeParticipante(inscricao.getNomeParticipante())
                .emailParticipante(inscricao.getEmailParticipante())
                .dataInscricao(inscricao.getDataInscricao())
                .status(inscricao.getStatus())
                .eventoId(inscricao.getEvento().getId())
                .tituloEvento(inscricao.getEvento().getTitulo())
                .build();
    }
}
