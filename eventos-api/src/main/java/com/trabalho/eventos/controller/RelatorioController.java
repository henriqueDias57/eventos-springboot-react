package com.trabalho.eventos.controller;

import com.trabalho.eventos.dto.CategoriaRelatorioProjection;
import com.trabalho.eventos.dto.EventoEstatisticaProjection;
import com.trabalho.eventos.service.CategoriaService;
import com.trabalho.eventos.service.EventoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller responsável pelos endpoints de relatórios e agregação estatística.
 * ATENDE AO REQUISITO OBRIGATÓRIO: Retorno de agregação usando Native Query em SQL Puro (@Query(nativeQuery = true)).
 */
@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final CategoriaService categoriaService;
    private final EventoService eventoService;

    public RelatorioController(CategoriaService categoriaService, EventoService eventoService) {
        this.categoriaService = categoriaService;
        this.eventoService = eventoService;
    }

    /**
     * Endpoint de Agregação Native Query SQL (COUNT, SUM, GROUP BY, JOIN)
     * Retorna a contagem de inscrições, total de eventos e faturamento estimado por Categoria.
     */
    @GetMapping("/agregacao-categoria")
    public ResponseEntity<List<CategoriaRelatorioProjection>> obterRelatorioAgregadoCategorias() {
        return ResponseEntity.ok(categoriaService.obterRelatorioAgregado());
    }

    /**
     * Endpoint de Agregação Native Query SQL (COUNT, SUM, AVG, GROUP BY)
     * Retorna estatísticas avançadas de inscrições e preço médio por Evento.
     */
    @GetMapping("/estatisticas-eventos")
    public ResponseEntity<List<EventoEstatisticaProjection>> obterEstatisticasEventos() {
        return ResponseEntity.ok(eventoService.obterEstatisticasEventos());
    }
}
