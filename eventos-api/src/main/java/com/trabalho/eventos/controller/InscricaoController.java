package com.trabalho.eventos.controller;

import com.trabalho.eventos.dto.InscricaoDTO;
import com.trabalho.eventos.service.InscricaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST com os endpoints CRUD completos para Inscrição.
 */
@RestController
@RequestMapping("/api/inscricoes")
public class InscricaoController {

    private final InscricaoService inscricaoService;

    public InscricaoController(InscricaoService inscricaoService) {
        this.inscricaoService = inscricaoService;
    }

    @GetMapping
    public ResponseEntity<List<InscricaoDTO>> listarTodas() {
        return ResponseEntity.ok(inscricaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InscricaoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(inscricaoService.buscarPorId(id));
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<InscricaoDTO>> listarPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(inscricaoService.listarPorEvento(eventoId));
    }

    @PostMapping
    public ResponseEntity<InscricaoDTO> criar(@Valid @RequestBody InscricaoDTO dto) {
        InscricaoDTO criada = inscricaoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InscricaoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody InscricaoDTO dto) {
        InscricaoDTO atualizada = inscricaoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        inscricaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
