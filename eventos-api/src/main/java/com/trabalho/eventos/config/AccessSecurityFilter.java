package com.trabalho.eventos.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Filtro de Segurança de Acesso à Infraestrutura (Access Gate).
 * Protege todos os endpoints da API contra acessos não autorizados na internet.
 * Permite autenticação via HTTP Basic Auth, Header X-Access-Key ou Bearer Token.
 */
@Component
@Order(1)
public class AccessSecurityFilter extends OncePerRequestFilter {

    @Value("${app.security.enabled:true}")
    private boolean securityEnabled;

    @Value("${app.security.password:Eventos2026!Master#Secure}")
    private String masterPassword;

    @Value("${app.security.username:admin}")
    private String adminUsername;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // 1. Permite requisições OPTIONS (CORS Preflight)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Permite endpoint de saúde (Health Check do Cloud Provider / Render / Liveness)
        if (path.equals("/api/health") || path.equals("/health") || path.equals("/") || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Se a segurança estiver desabilitada por variável de ambiente, permite acesso
        if (!securityEnabled) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Validação de Credenciais
        boolean authenticated = false;

        // A. Header customizado X-Access-Key
        String xAccessKey = request.getHeader("X-Access-Key");
        if (xAccessKey != null && xAccessKey.equals(masterPassword)) {
            authenticated = true;
        }

        // B. Header Authorization (Basic Auth ou Bearer)
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (!authenticated && authHeader != null) {
            if (authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7).trim();
                if (token.equals(masterPassword)) {
                    authenticated = true;
                }
            } else if (authHeader.startsWith("Basic ")) {
                try {
                    String base64Credentials = authHeader.substring(6).trim();
                    byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
                    String credentials = new String(credDecoded, StandardCharsets.UTF_8);
                    // Formato username:password
                    String[] values = credentials.split(":", 2);
                    if (values.length == 2 && values[1].equals(masterPassword)) {
                        authenticated = true;
                    } else if (values.length == 1 && values[0].equals(masterPassword)) {
                        authenticated = true;
                    }
                } catch (Exception ignored) {
                    // Formato inválido
                }
            }
        }

        // 5. Se autenticado, segue o fluxo normal
        if (authenticated) {
            filterChain.doFilter(request, response);
            return;
        }

        // 6. Não autenticado -> Retorna 401 Unauthorized com cabeçalhos de segurança
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "Basic realm=\"Gerenciador de Eventos - Acesso Restrito\"");
        response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Acesso não autorizado. Informe a senha de acesso à infraestrutura.\"}");
    }
}
