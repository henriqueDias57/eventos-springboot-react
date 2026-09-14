package com.trabalho.eventos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Data Transfer Object para recebimento e resposta de Inscrição.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InscricaoDTO {

    private Long id;

    @NotBlank(message = "O nome do participante é obrigatório.")
    @Size(max = 150, message = "O nome do participante não pode exceder 150 caracteres.")
    private String nomeParticipante;

    @NotBlank(message = "O e-mail do participante é obrigatório.")
    @Email(message = "Forneça um endereço de e-mail válido.")
    private String emailParticipante;

    private LocalDateTime dataInscricao;

    private String status;

    @NotNull(message = "O ID do evento é obrigatório.")
    private Long eventoId;

    private String tituloEvento;
}
