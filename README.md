# Sistema de Gerenciamento de Eventos e Inscrições

Aplicação web full stack para gerenciamento de **categorias**, **eventos** e **inscrições de participantes**, com relatórios gerenciais calculados diretamente no banco de dados relacional por meio de **Native Queries**.

**Disciplina:** Banco de Dados 2 — 6º Semestre — Engenharia da Computação — **Universidade de Taubaté (UNITAU)**  
**Integrantes:**
- Henrique Dias Ferreira
- Vinicius Souza e Santos
- João Pedro Beserra
- Luan Eduardo Monteiro

---

## Tecnologias Utilizadas

| Camada | Stack |
|---|---|
| **Banco de Dados** | PostgreSQL (`db_eventos`), scripts DDL/DML idempotentes (`schema.sql` e `data.sql`) |
| **Backend (`eventos-api`)** | Java 17, Spring Boot 3.2.4, Spring Web, Spring Data JPA, Hibernate, Bean Validation, Lombok, Springdoc OpenAPI |
| **Frontend (`eventos-web`)** | React 18, Vite 5, Material UI (`@mui/material`), React Router DOM, Axios, Recharts |
| **Infraestrutura Local** | Docker Compose (`postgres:15-alpine`) e scripts `.bat` (Windows) |

---

## Modelo de Dados

O banco possui exatamente **3 tabelas relacionais** interligadas por dois relacionamentos **1:N**:

```text
tb_categoria (1) ──< tb_evento (1) ──< tb_inscricao
```

| Tabela | Colunas Principais | Regras e Índices |
|---|---|---|
| `tb_categoria` | `id` (PK), `nome` (`NOT NULL`, `UNIQUE`), `descricao` | Impede categorias com nome duplicado |
| `tb_evento` | `id` (PK), `titulo`, `descricao`, `data_evento`, `local_evento`, `preco`, `categoria_id` (FK) | `fk_evento_categoria` com `ON DELETE CASCADE`; índice `idx_evento_categoria` |
| `tb_inscricao` | `id` (PK), `nome_participante`, `email_participante`, `data_inscricao`, `status`, `evento_id` (FK) | `fk_inscricao_evento` com `ON DELETE CASCADE`; índices `idx_inscricao_evento` e `idx_inscricao_email` |

- **Integridade referencial e cascata:** não existe evento sem categoria nem inscrição sem evento. A exclusão usa `ON DELETE CASCADE` nas chaves estrangeiras.
- **Diagrama ER:** [eventos-api/database_diagram.mermaid](eventos-api/database_diagram.mermaid)

---

## API REST (19 Endpoints)

Todos os endpoints respondem em JSON, com validação de entrada (`@Valid`, `@NotBlank`, `@Email`, `@Min`, `@NotNull`) nos cadastros (`POST` e `PUT`) e tratamento padronizado de erros via `GlobalExceptionHandler` (`400`, `404`, `409`, `500`).

### Categorias (`/api/categorias`)
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/categorias` | Lista todas as categorias |
| `GET` | `/api/categorias/{id}` | Busca uma categoria por ID |
| `POST` | `/api/categorias` | Cadastra uma nova categoria |
| `PUT` | `/api/categorias/{id}` | Atualiza uma categoria existente |
| `DELETE` | `/api/categorias/{id}` | Exclui uma categoria (e eventos vinculados em cascata) |

### Eventos (`/api/eventos`)
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/eventos` | Lista todos os eventos |
| `GET` | `/api/eventos/{id}` | Busca um evento por ID |
| `GET` | `/api/eventos/categoria/{categoriaId}` | Filtra eventos por categoria |
| `POST` | `/api/eventos` | Cadastra um novo evento |
| `PUT` | `/api/eventos/{id}` | Atualiza um evento existente |
| `DELETE` | `/api/eventos/{id}` | Exclui um evento (e inscrições vinculadas em cascata) |

### Inscrições (`/api/inscricoes`)
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/inscricoes` | Lista todas as inscrições |
| `GET` | `/api/inscricoes/{id}` | Busca uma inscrição por ID |
| `GET` | `/api/inscricoes/evento/{eventoId}` | Lista inscrições de um evento específico |
| `POST` | `/api/inscricoes` | Registra uma nova inscrição |
| `PUT` | `/api/inscricoes/{id}` | Atualiza dados e situação (`CONFIRMADA`, `PENDENTE`, `CANCELADA`) |
| `DELETE` | `/api/inscricoes/{id}` | Exclui uma inscrição |

### Relatórios (`/api/relatorios`)
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/relatorios/agregacao-categoria` | Totais de eventos, inscrições e faturamento estimado por categoria |
| `GET` | `/api/relatorios/estatisticas-eventos` | Total de inscritos, confirmados e preço médio por evento |

> Além dos 19 endpoints principais acima, a API expõe `GET /api/health` (`HealthController`) para monitoramento do servidor e documentação OpenAPI em `/swagger-ui/index.html`.

---

## Nota sobre Native Query

Os relatórios são calculados diretamente no PostgreSQL usando `@Query(nativeQuery = true)` (sem JPQL):

- **`CategoriaRepository.gerarRelatorioAgregadoNativeQuery()` (`/api/relatorios/agregacao-categoria`)**: executa `LEFT JOIN` entre `tb_categoria`, `tb_evento` e `tb_inscricao`, aplicando `COUNT(i.id)`, `COUNT(DISTINCT e.id)` (evita duplicação pela junção com inscrições), `COALESCE(SUM(e.preco), 0.0)` e `GROUP BY c.id, c.nome` ordenado por `totalInscricoes DESC`. O campo `faturamentoEstimado` representa uma estimativa bruta somando `e.preco` nas linhas retornadas pelo `LEFT JOIN`, sem filtrar por `status`.
- **`EventoRepository.obterEstatisticasEventosNativeQuery()` (`/api/relatorios/estatisticas-eventos`)**: executa `LEFT JOIN` entre `tb_evento` e `tb_inscricao`, retornando `COUNT(i.id)`, `SUM(CASE WHEN i.status = 'CONFIRMADA' THEN 1 ELSE 0 END)` e `COALESCE(AVG(e.preco), 0.0)` agrupados por `e.id, e.titulo`.

---

## Telas da Aplicação (`eventos-web`)

| Rota | Tela | Funcionalidades |
|---|---|---|
| `/` | **Painel Inicial** | Cards com totais consolidados e guia rápido |
| `/categorias` | **Categorias** | Listagem, criação, edição e exclusão com confirmação |
| `/eventos` | **Eventos** | Grade em cards com filtro por categoria, data, local e preço |
| `/inscricoes` | **Inscrições** | Cadastro de participantes, vínculo ao evento e troca de status |
| `/relatorios` | **Relatórios** | Gráficos (Recharts) e tabelas alimentados pelas Native Queries |

---

## Como Executar Localmente

### Pré-requisitos
- **Java 17 JDK** (ou superior)
- **Node.js 18+** com `npm`
- **PostgreSQL 14+** (ou **Docker**)

### 1. Subir o Banco de Dados (`db_eventos`, porta `5432`)
Via Docker Compose na raiz do repositório:
```bash
docker compose up -d
```
Ou crie manualmente no PostgreSQL local (`postgres` / `postgres`):
```sql
CREATE DATABASE db_eventos;
```

### 2. Iniciar o Backend (porta `8080`)
No Windows, execute `iniciar_backend.bat`, ou via terminal:
```bash
cd eventos-api
mvn spring-boot:run
```
Os scripts `schema.sql` e `data.sql` rodam automaticamente de forma idempotente (`IF NOT EXISTS` + inserts protegidos por `WHERE NOT EXISTS`).

Variáveis de ambiente aceitas pelo backend (com fallbacks locais):
- `PORT` (padrão: `8080`)
- `DB_URL` (padrão: `jdbc:postgresql://localhost:5432/db_eventos`)
- `DB_USER` (padrão: `postgres`)
- `DB_PASSWORD` (padrão: `postgres`)

### 3. Iniciar o Frontend (porta `3000`)
O arquivo `eventos-web/vite.config.js` fixa a porta **`3000`** (em vez da `5173` padrão do Vite) e faz proxy de `/api` para `http://localhost:8080`.

No Windows, execute `iniciar_frontend.bat`, ou via terminal:
```bash
cd eventos-web
npm install
npm run dev
```

Acesse: **`http://localhost:3000`**

---

## Deploy Online

> **Aviso de hibernação (Render Free):** no plano gratuito do Render, a API entra em modo de suspensão após ~15 minutos sem uso; o primeiro acesso pode levar cerca de **40 a 60 segundos** para responder.

- **Frontend (Vercel):** https://eventos-web-psi.vercel.app
- **API Backend (Render):** https://eventos-api-0xff.onrender.com
- **Banco de Dados (Neon PostgreSQL):** `ep-gentle-sky-bbh3cgl4.c-15.us-east-1.aws.neon.tech` (banco `db_eventos`)

---

## Documentação Adicional

- [docs/DOCUMENTACAO.md](docs/DOCUMENTACAO.md) — Arquitetura, banco de dados, catálogo de rotas, frontend e perguntas para defesa
- [docs/COMPARATIVO.md](docs/COMPARATIVO.md) — Auditoria técnica, comparativos entre documentos/código e melhorias futuras
