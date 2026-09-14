package com.trabalho.eventos.dto;

import java.math.BigDecimal;

/**
 * Interface Projection para capturar o resultado da consulta agregada nativa SQL (Native Query).
 */
public interface CategoriaRelatorioProjection {
    Long getCategoriaId();
    String getNomeCategoria();
    Long getTotalInscricoes();
    Long getTotalEventos();
    BigDecimal getFaturamentoEstimado();
}
