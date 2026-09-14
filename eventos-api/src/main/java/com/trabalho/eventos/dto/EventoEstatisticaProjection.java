package com.trabalho.eventos.dto;

import java.math.BigDecimal;

/**
 * Interface Projection para estatísticas de eventos via Native Query SQL.
 */
public interface EventoEstatisticaProjection {
    Long getEventoId();
    String getTituloEvento();
    Long getTotalInscritos();
    Long getInscricaoConfirmada();
    BigDecimal getPrecoMedio();
}
