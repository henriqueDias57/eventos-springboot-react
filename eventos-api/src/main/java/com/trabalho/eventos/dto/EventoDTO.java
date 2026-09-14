package com.trabalho.eventos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object para recebimento e resposta de Evento.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoDTO {

    private Long id;

    @NotBlank(message = "O título do evento é obrigatório.")
    @Size(max = 150, message = "O título não pode exceder 150 caracteres.")
    private String titulo;

    private String descricao;

    @NotNull(message = "A data do evento é obrigatória.")
    private LocalDateTime dataEvento;

    @NotBlank(message = "O local do evento é obrigatório.")
    @Size(max = 200, message = "O local não pode exceder 200 caracteres.")
    private String localEvento;

    @NotNull(message = "O preço é obrigatório.")
    @Min(value = 0, message = "O preço deve ser maior ou igual a zero.")
    private BigDecimal preco;

    @NotNull(message = "O ID da categoria é obrigatório.")
    private Long categoriaId;

    private String nomeCategoria;
}
