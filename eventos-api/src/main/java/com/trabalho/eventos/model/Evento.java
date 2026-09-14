package com.trabalho.eventos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade JPA representando a tabela tb_evento.
 * Possui relacionamento @ManyToOne com Categoria (N:1)
 * e @OneToMany com Inscricao (1:N).
 */
@Entity
@Table(name = "tb_evento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_evento", nullable = false)
    private LocalDateTime dataEvento;

    @Column(name = "local_evento", nullable = false, length = 200)
    private String localEvento;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    // Relacionamento N:1 com Categoria (@ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    @JsonIgnoreProperties("eventos")
    private Categoria categoria;

    // Relacionamento 1:N com Inscricao (@OneToMany)
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("evento")
    @Builder.Default
    private List<Inscricao> inscricoes = new ArrayList<>();
}
