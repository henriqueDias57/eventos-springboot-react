package com.trabalho.eventos.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Classe concreta de DTO implementando CategoriaRelatorioProjection.
 * Utilizada para serialização JSON limpa e testes unitários/integração.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaRelatorioDTO implements CategoriaRelatorioProjection {

    private Long categoriaId;
    private String nomeCategoria;
    private Long totalInscricoes;
    private Long totalEventos;
    private BigDecimal faturamentoEstimado;
}
