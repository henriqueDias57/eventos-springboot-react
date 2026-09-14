package com.trabalho.eventos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade JPA representando a tabela tb_categoria.
 * Lado "1" no relacionamento 1:N com Evento.
 */
@Entity
@Table(name = "tb_categoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    // Relacionamento 1:N (Uma Categoria tem N Eventos)
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("categoria")
    @Builder.Default
    private List<Evento> eventos = new ArrayList<>();
}
