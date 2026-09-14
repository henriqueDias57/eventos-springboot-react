package com.trabalho.eventos.exception;

/**
 * Exceção personalizada para recursos não encontrados no banco de dados.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
