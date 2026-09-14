package com.trabalho.eventos.repository;

import com.trabalho.eventos.dto.CategoriaRelatorioProjection;
import com.trabalho.eventos.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório JPA para a entidade Categoria.
 * Inclui o método de agregação usando Native Query (SQL Puro PostgreSQL).
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    /**
     * REQUISITO OBRIGATÓRIO: Endpoint/Método que retorna resultado de agregação
     * usando Native Query (@Query(nativeQuery = true) com SQL puro (COUNT, SUM, GROUP BY, JOIN).
     */
    @Query(value = """
        SELECT 
            c.id AS categoriaId,
            c.nome AS nomeCategoria,
            COUNT(i.id) AS totalInscricoes,
            COUNT(DISTINCT e.id) AS totalEventos,
            COALESCE(SUM(e.preco), 0.0) AS faturamentoEstimado
        FROM tb_categoria c
        LEFT JOIN tb_evento e ON c.id = e.categoria_id
        LEFT JOIN tb_inscricao i ON e.id = i.evento_id
        GROUP BY c.id, c.nome
        ORDER BY totalInscricoes DESC
        """, nativeQuery = true)
    List<CategoriaRelatorioProjection> gerarRelatorioAgregadoNativeQuery();
}
