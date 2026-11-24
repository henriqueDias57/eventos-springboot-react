# Auditoria Técnica e Comparativo do Projeto

**Projeto:** Sistema de Gerenciamento de Eventos e Inscrições (`eventos-springboot-react`)  
**Disciplina:** Banco de Dados 2 — 6º Semestre — Engenharia da Computação — Universidade de Taubaté (UNITAU)  
**Entrega:** Segunda entrega (06/10/2026)  
**Grupo:** Henrique Dias Ferreira, Vinicius Souza e Santos, João Pedro Beserra, Luan Eduardo Monteiro

---

## 1. Auditoria Inicial (Entrega × Código antes das correções)

| # | Requisito / Verificação | Status | Evidência no Código (antes da Etapa 3) |
|---|---|---|---|
| 1 | Banco com exatamente 3 tabelas (`tb_categoria`, `tb_evento`, `tb_inscricao`) e `nome` `UNIQUE` | ✅ Atendido | `eventos-api/schema.sql` (L11–38) e `eventos-api/src/main/java/com/trabalho/eventos/model/{Categoria,Evento,Inscricao}.java` |
| 2 | Relacionamentos 1:N (`categoria → evento → inscrição`), `ON DELETE CASCADE` nas FKs e índices nas FKs | ✅ Atendido | `eventos-api/schema.sql` L26, L37 (`ON DELETE CASCADE`) e L44–46 (`idx_evento_categoria`, `idx_inscricao_evento`, `idx_inscricao_email`); `@OneToMany` / `@ManyToOne` nas entidades |
| 3 | 4 controllers principais, JSON, 19 endpoints exatos e validação (`@Valid`, `@NotBlank`, `@Email`) em `POST` e `PUT` | ✅ Atendido | `CategoriaController.java` (5), `EventoController.java` (6), `InscricaoController.java` (6), `RelatorioController.java` (2); `@Valid` em `POST`/`PUT` e validações nos DTOs (`CategoriaDTO`, `EventoDTO`, `InscricaoDTO`). Existe também `HealthController.java` (`/api/health`, `/health`) para health check |
| 4 | `/api/relatorios/agregacao-categoria` e `/estatisticas-eventos` com `@Query(nativeQuery = true)` | ✅ Atendido (com ressalva) | `CategoriaRepository.java` (L22–35) e `EventoRepository.java` (L23–35) usam SQL nativo com `LEFT JOIN`, `COUNT(i.id)`, `COUNT(DISTINCT e.id)`, `COALESCE(SUM(e.preco), 0.0)` e `GROUP BY`. **Ressalva:** o faturamento estimado por categoria não filtra `status` e, por ser `LEFT JOIN`, soma `e.preco` uma vez mesmo para evento sem inscrições |
| 5 | Porta real do frontend vs. README | ✅ Atendido | `eventos-web/vite.config.js` (L7) fixa `port: 3000` (sobrescrevendo o padrão `5173` do Vite), alinhado ao README |
| 6 | `spring.sql.init.mode=always`, `IF NOT EXISTS` no `schema.sql` e `data.sql` idempotente | ❌ Divergente | `application.properties` (L21) usa `mode=always`, porém `schema.sql` (L6–8) executava `DROP TABLE IF EXISTS ... CASCADE` e `data.sql` fazia `INSERT` direto sem guarda de idempotência — apagando dados a cada restart |
| 7 | Stack fixa e ausência de autenticação (deploy didático, CORS aberto) | ✅ Atendido | `pom.xml` (Spring Boot 3.2.4, Java 17), `package.json` (React 18, Vite 5, MUI, Recharts, Axios), `CorsConfig.java` (`allowedOriginPatterns("*")`) sem Spring Security |
| 8 | Segredos commitados (inclusive nos 17 commits do histórico) | ❌ Atenção histórica | `HEAD` (`b92983e`) não tem segredos de nuvem (apenas `postgres`/`postgres` local em `application.properties`), mas os commits históricos `657c70a` e `0a99d02` expuseram `Eventos2026!Master#Secure` e `DbEventos#Postgre2026!Admin` em `AccessSecurityFilter.java` e `GUIA_DE_ACESSO.md`. Recomenda-se não reutilizar essas credenciais |
| 9 | Preparação para nuvem (Neon + Render + Vercel) e filtro por categoria na UI | ⚠️ Pendente antes da Etapa 3 | Faltavam `Dockerfile`, variáveis de ambiente em `application.properties`, `VITE_API_URL` no `api.js`, `vercel.json` e seletor de filtro por categoria em `Eventos.jsx` (a API `/api/eventos/categoria/{categoriaId}` existia sem uso na tela) |

---

## 2. Comparativo: README × Código Real

| Item | O que o `README.md` anterior dizia | O que existe no código real |
|---|---|---|
| Disciplina / Turma / Grupo | Citava apenas "disciplina de Banco de Dados", sem citar Banco de Dados 2, UNITAU, entrega nem integrantes | Trabalho de Banco de Dados 2, 6º sem., Eng. da Computação, UNITAU (06/10/2026) e 4 integrantes |
| Biblioteca de UI | Informava "Material UI (MUI v5)" | `eventos-web/package.json` usa `@mui/material: ^9.4.0`, `recharts: ^3.10.1`, `react-router-dom: ^7.18.3` e `axios: ^1.20.0` (API compatível com MUI v5+) |
| Catálogo de endpoints | Não listava a tabela completa dos 19 endpoints na raiz (apenas em `eventos-api/README.md` e `DOCUMENTACAO_COMPLETA.md`) | Existem os 19 endpoints dos 4 controllers + `HealthController` (`/api/health` e `/health`) |
| Native Query | Mencionava "relatórios com consultas agregadas em SQL nativo" sem detalhar as métricas | `CategoriaRepository` retorna `categoriaId`, `nomeCategoria`, `totalInscricoes`, `totalEventos`, `faturamentoEstimado`; `EventoRepository` retorna `eventoId`, `tituloEvento`, `totalInscritos`, `inscricaoConfirmada`, `precoMedio` |
| Deploy online | Sem seção de deploy online | Necessária inclusão das URLs públicas (Vercel, Render, Neon) e variáveis de ambiente |

---

## 3. Contradições e Duplicidades entre Documentos

1. **`DOCUMENTACAO_COMPLETA.md` × Código real:**
   - **Exclusão de categoria (L171 e L401–402):** afirma que `CategoriaService` verifica e bloqueia a exclusão de uma categoria que possua eventos. Na prática, `schema.sql` (L26) define `ON DELETE CASCADE`, `Categoria.java` (L34) define `CascadeType.ALL, orphanRemoval = true` e `CategoriaService.deletar` (L64–69) apenas verifica `existsById` e chama `deleteById`.
   - **Duplicidade de categoria (L70):** cita método `findByNomeIgnoreCase` no `CategoriaService`, que não existe em `CategoriaRepository`; a unicidade é garantida pela constraint `UNIQUE` no banco, capturada pelo `GlobalExceptionHandler` (`409 Conflict`).
   - **Anotação de validação de preço (L405):** cita `@PositiveOrZero`, mas `EventoDTO.java` (L38) usa `@Min(value = 0)`.
2. **`COMO_RODAR_EM_OUTRO_PC.md` × `pom.xml`:**
   - O guia apontava `/swagger-ui/index.html` (L90), mas a dependência `springdoc-openapi-starter-webmvc-ui` não estava commitada no `pom.xml` do commit `b92983e` (estava apenas como alteração local não commitada na versão `2.5.0`).
3. **Duplicidade exata de arquivos `RELATORIO_*.md`:**
   - `RELATORIO_AUDITORIA.md` (raiz) e `eventos-api/RELATORIO_AUDITORIA.md` possuíam conteúdo idêntico (mesmo hash SHA-256) e caminhos locais quebrados apontando para `C:\Users\Henrique\Desktop\BD_TRABALHO\...`.
   - `RELATORIO_FRONTEND.md` (raiz) e `eventos-web/RELATORIO_FRONTEND.md` possuíam conteúdo idêntico (mesmo hash SHA-256), descrevendo a **V1** do frontend (Tailwind/glassmorphism, expansão 1:N em tabela, filtro de status e URL antiga `sistema-gerenciamento-eventos`).
   - `eventos-web/RELATORIO_FRONTEND_V2.md` descreve a **V2** real (MUI, tema claro, cards em `Eventos.jsx`, Recharts), porém listava versões genéricas (`MUI 5.x`, `React Router 6.x`, `Recharts 2.x`).
4. **Lições aprendidas com `RELATORIO_REVERSAO.md` e `RELATORIO_SINCRONIZACAO.md` (commits `657c70a`, `0a99d02`, `1aea615`, `9054f78`):**
   - A primeira tentativa de deploy usou `localtunnel` (`*.loca.lt`) + `render.yaml` + `AccessSecurityFilter.java` + `AccessGate.jsx` com senha mestra (`Eventos2026!Master#Secure`) e credenciais escritas em `GUIA_DE_ACESSO.md`.
   - Como gerou complexidade desnecessária para apresentação acadêmica e expôs segredos no histórico, foi revertida em `1aea615`.
   - **Lições aplicadas agora:**
     - Deploy didático aberto (sem `AccessSecurityFilter` nem `AccessGate`, conforme Regra 6).
     - Zero segredos em código ou Markdown (tudo via variáveis de ambiente no Render e Vercel).
     - Scripts `schema.sql` (`CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS`) e `data.sql` idempotentes para evitar perda de dados quando o container do Render reiniciar.
     - Pasta duplicada no workspace local (`BD_TRABALHO/BD_TRABALHO`): a raiz externa continha deleções não commitadas enquanto a subpasta aninhada preservava o repositório íntegro.

---

## 4. Comparativo: Ambiente Local × Ambiente Online

| Camada / Aspecto | Ambiente Local | Ambiente Online (Produção Acadêmica) |
|---|---|---|
| **Banco de Dados** | PostgreSQL local (`localhost:5432/db_eventos`) via Docker Compose ou instalação local (`postgres`/`postgres`) | **Neon** PostgreSQL gerenciado (`db_eventos`), conexão TLS (`sslmode=require`) via `DB_URL`, `DB_USER`, `DB_PASSWORD` |
| **Backend (API)** | Spring Boot na porta `8080` (`mvn spring-boot:run` ou `iniciar_backend.bat`) | **Render** Web Service (Docker multi-stage Maven + JDK 17 → JRE 17), porta injetada via `${PORT:8080}`, CORS liberado em `/api/**` |
| **Frontend (Web)** | Vite Dev Server na porta `3000` com proxy `/api` → `http://localhost:8080` | **Vercel** Static Build (`eventos-web`, `npm run build` → `dist`), consumindo `${VITE_API_URL}/api` e `vercel.json` com rewrite SPA |
| **Inicialização SQL** | `spring.sql.init.mode=always` com `IF NOT EXISTS` + `data.sql` idempotente | Mesma política idempotente: cria schema na 1ª subida e preserva dados criados pelos usuários entre restarts |
| **Disponibilidade** | Instantânea enquanto os terminais estiverem abertos | Render Free hiberna após ~15 min sem uso; a primeira requisição após hibernar leva cerca de 40–60s (*cold start*) |

---

## 5. Melhorias Futuras (Não Implementadas)

1. **Cálculo de faturamento na Native Query:** filtrar inscrições por `status = 'CONFIRMADA'` e corrigir o cálculo para que eventos sem nenhuma inscrição não somem `e.preco` no `LEFT JOIN` (`SUM(CASE WHEN i.id IS NOT NULL AND i.status = 'CONFIRMADA' THEN e.preco ELSE 0 END)`).
2. **Normalização de Participantes (N:N):** extrair `tb_participante` com e-mail único e chave composta `(evento_id, participante_id)` para evitar inscrições duplicadas da mesma pessoa no mesmo evento.
3. **Proteção contra exclusão acidental:** substituir `ON DELETE CASCADE` em `tb_evento.categoria_id` por `ON DELETE RESTRICT` ou implementar exclusão lógica (`ativo = false`), preservando histórico financeiro e de inscrições.
4. **Validação estrita de domínio e datas:** restringir `InscricaoDTO.status` aos valores `CONFIRMADA`, `PENDENTE` e `CANCELADA` via `Enum` ou `@Pattern`, e validar formatos/limites de datas em `EventoDTO`.
5. **Paginação, filtros e performance:** adicionar paginação (`Pageable`) nos `GET` de listagem e *code-splitting* no Vite para reduzir o bundle inicial do frontend.
6. **Segurança em produção real:** adicionar autenticação/autorização (ex.: Spring Security + JWT) e restringir `CorsConfig` apenas ao domínio oficial do frontend.
