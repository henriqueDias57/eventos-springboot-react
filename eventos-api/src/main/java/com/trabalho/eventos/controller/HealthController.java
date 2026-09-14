package com.trabalho.eventos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Endpoint público de verificação de integridade (Health Check).
 * Usado por plataformas de nuvem (Render, Railway, Fly.io, Kubernetes) para monitoramento.
 */
@RestController
public class HealthController {

    @GetMapping({"/api/health", "/health"})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "eventos-api",
                "timestamp", LocalDateTime.now(),
                "environment", "cloud-production"
        ));
    }
}
