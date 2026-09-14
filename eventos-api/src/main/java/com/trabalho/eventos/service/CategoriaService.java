package com.trabalho.eventos.service;

import com.trabalho.eventos.dto.CategoriaDTO;
import com.trabalho.eventos.dto.CategoriaRelatorioProjection;
import com.trabalho.eventos.exception.ResourceNotFoundException;
import com.trabalho.eventos.model.Categoria;
import com.trabalho.eventos.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Camada de serviço contendo as regras de negócio para Categoria.
 */
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarTodas() {
        return categoriaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoriaDTO buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + id));
        return toDTO(categoria);
    }

    @Transactional
    public CategoriaDTO salvar(CategoriaDTO dto) {
        Categoria categoria = Categoria.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .build();

        Categoria salvo = categoriaRepository.save(categoria);
        return toDTO(salvo);
    }

    @Transactional
    public CategoriaDTO atualizar(Long id, CategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + id));

        categoria.setNome(dto.getNome());
        categoria.setDescricao(dto.getDescricao());

        Categoria atualizado = categoriaRepository.save(categoria);
        return toDTO(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoria não encontrada com id: " + id);
        }
        categoriaRepository.deleteById(id);
    }

    /**
     * Retorna relatório agregado gerado via Native Query SQL.
     */
    @Transactional(readOnly = true)
    public List<CategoriaRelatorioProjection> obterRelatorioAgregado() {
        return categoriaRepository.gerarRelatorioAgregadoNativeQuery();
    }

    private CategoriaDTO toDTO(Categoria categoria) {
        return CategoriaDTO.builder()
                .id(categoria.getId())
                .nome(categoria.getNome())
                .descricao(categoria.getDescricao())
                .build();
    }
}
