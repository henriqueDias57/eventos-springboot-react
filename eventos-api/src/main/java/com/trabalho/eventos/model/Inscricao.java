package com.trabalho.eventos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidade JPA representando a tabela tb_inscricao.
 * Possui relacionamento @ManyToOne com Evento (N:1).
 */
@Entity
@Table(name = "tb_inscricao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_participante", nullable = false, length = 150)
    private String nomeParticipante;

    @Column(name = "email_participante", nullable = false, length = 150)
    private String emailParticipante;

    @Column(name = "data_inscricao", nullable = false)
    private LocalDateTime dataInscricao;

    @Column(nullable = false, length = 30)
    private String status;

    // Relacionamento N:1 com Evento (@ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    @JsonIgnoreProperties("inscricoes")
    private Evento evento;
}
