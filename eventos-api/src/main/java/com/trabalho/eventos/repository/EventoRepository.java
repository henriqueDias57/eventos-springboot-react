package com.trabalho.eventos.repository;

import com.trabalho.eventos.dto.EventoEstatisticaProjection;
import com.trabalho.eventos.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório JPA para a entidade Evento.
 * Inclui consultas por Categoria e consulta nativa de estatísticas.
 */
@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    List<Evento> findByCategoriaId(Long categoriaId);

    /**
     * Native Query de agregação estatística para eventos (SQL Puro).
     */
    @Query(value = """
        SELECT 
            e.id AS eventoId,
            e.titulo AS tituloEvento,
            COUNT(i.id) AS totalInscritos,
            SUM(CASE WHEN i.status = 'CONFIRMADA' THEN 1 ELSE 0 END) AS inscricaoConfirmada,
            COALESCE(AVG(e.preco), 0.0) AS precoMedio
        FROM tb_evento e
        LEFT JOIN tb_inscricao i ON e.id = i.evento_id
        GROUP BY e.id, e.titulo
        ORDER BY totalInscritos DESC
        """, nativeQuery = true)
    List<EventoEstatisticaProjection> obterEstatisticasEventosNativeQuery();
}
