# API de Gerenciamento de Eventos e Inscrições (eventos-api)

Projeto Acadêmico de Banco de Dados e Desenvolvimento Backend com Java, Spring Boot 3 e PostgreSQL.

---

## 1. Domínio Escolhido e Justificativa

- **Domínio**: Sistema de Gerenciamento de Eventos e Inscrições de Participantes.
- **Justificativa**: O domínio de gerenciamento de eventos foi selecionado por ser realista, estruturado para apresentação acadêmica e adequado para demonstrar o modelo relacional de banco de dados com integridade referencial de chaves estrangeiras.
- **Entidades Principais**:
  1. `tb_categoria`: Categorias temáticas dos eventos (ex: Tecnologia, Negócios, Cultura).
  2. `tb_evento`: Eventos cadastrados na plataforma com data, local, preço e chave estrangeira para `tb_categoria`.
  3. `tb_inscricao`: Inscrições de participantes associadas a um determinado `tb_evento`.

---

## 2. Modelo Relacional do Banco de Dados

### Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    TB_CATEGORIA {
        BIGINT id PK "BIGSERIAL"
        VARCHAR nome "NOT NULL, UNIQUE"
        TEXT descricao
    }

    TB_EVENTO {
        BIGINT id PK "BIGSERIAL"
        VARCHAR titulo "NOT NULL"
        TEXT descricao
        TIMESTAMP data_evento "NOT NULL"
        VARCHAR local_evento "NOT NULL"
        NUMERIC preco "NOT NULL"
        BIGINT categoria_id FK "NOT NULL"
    }

    TB_INSCRICAO {
        BIGINT id PK "BIGSERIAL"
        VARCHAR nome_participante "NOT NULL"
        VARCHAR email_participante "NOT NULL"
        TIMESTAMP data_inscricao "NOT NULL"
        VARCHAR status "NOT NULL"
        BIGINT evento_id FK "NOT NULL"
    }

    TB_CATEGORIA ||--o{ TB_EVENTO : "1:N (Uma Categoria possui N Eventos)"
    TB_EVENTO ||--o{ TB_INSCRICAO : "1:N (Um Evento possui N Inscrições)"
```

### Relacionamentos 1:N (Um-para-Muitos):
- `tb_categoria` 1:N `tb_evento`: Uma categoria agrupa múltiplos eventos. Mapeado via `@OneToMany` em `Categoria` e `@ManyToOne` em `Evento`.
- `tb_evento` 1:N `tb_inscricao`: Um evento recebe múltiplas inscrições de participantes. Mapeado via `@OneToMany` em `Evento` e `@ManyToOne` em `Inscricao`.

---

## 3. Como Rodar o Backend

### Pré-requisitos
- Java 17 ou superior.
- PostgreSQL rodando na porta 5432 com banco `db_eventos` criado.
- Maven 3.8+.

### Configuração do Banco de Dados (PostgreSQL)
No terminal do PostgreSQL (`psql`) ou ferramenta de administração (DBeaver / pgAdmin), execute:
```sql
CREATE DATABASE db_eventos;
```

As credenciais configuradas em `application.properties` são:
- URL: `jdbc:postgresql://localhost:5432/db_eventos`
- Usuário: `postgres`
- Senha: `postgres`

### Execução
No terminal, dentro da pasta `eventos-api`:
```bash
mvn spring-boot:run
```
A API estará acessível em: `http://localhost:8080`

---

## 4. Endpoints REST

### Categorias (`/api/categorias`)

| Método | Rota | Descrição | Payload (Body) Exemplo |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/categorias` | Lista todas as categorias | N/A |
| **GET** | `/api/categorias/{id}` | Busca categoria por ID | N/A |
| **POST** | `/api/categorias` | Cria uma nova categoria | `{"nome": "Educação", "descricao": "Cursos e Palestras"}` |
| **PUT** | `/api/categorias/{id}` | Atualiza categoria existente | `{"nome": "Educação Tech", "descricao": "Workshops de TI"}` |
| **DELETE** | `/api/categorias/{id}` | Remove uma categoria | N/A |

### Eventos (`/api/eventos`)

| Método | Rota | Descrição | Payload (Body) Exemplo |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/eventos` | Lista todos os eventos | N/A |
| **GET** | `/api/eventos/{id}` | Busca evento por ID | N/A |
| **GET** | `/api/eventos/categoria/{categoriaId}` | Lista eventos por categoria | N/A |
| **POST** | `/api/eventos` | Cria um novo evento | `{"titulo": "Hackathon 2026", "descricao": "Desafio Dev", "dataEvento": "2026-11-10T08:00:00", "localEvento": "Lab 3", "preco": 0.00, "categoriaId": 1}` |
| **PUT** | `/api/eventos/{id}` | Atualiza evento | `{"titulo": "Hackathon 2026 - Edição Final", "descricao": "Desafio Dev de 48h", "dataEvento": "2026-11-10T08:00:00", "localEvento": "Auditório Principal", "preco": 20.00, "categoriaId": 1}` |
| **DELETE** | `/api/eventos/{id}` | Remove um evento | N/A |

### Inscrições (`/api/inscricoes`)

| Método | Rota | Descrição | Payload (Body) Exemplo |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/inscricoes` | Lista todas as inscrições | N/A |
| **GET** | `/api/inscricoes/{id}` | Busca inscrição por ID | N/A |
| **GET** | `/api/inscricoes/evento/{eventoId}` | Lista inscrições de um evento | N/A |
| **POST** | `/api/inscricoes` | Realiza inscrição em evento | `{"nomeParticipante": "Lucas Mendes", "emailParticipante": "lucas@email.com", "eventoId": 1}` |
| **PUT** | `/api/inscricoes/{id}` | Atualiza dados/status da inscrição | `{"nomeParticipante": "Lucas Mendes", "emailParticipante": "lucas@email.com", "status": "CONFIRMADA", "eventoId": 1}` |
| **DELETE** | `/api/inscricoes/{id}` | Cancela/Deleta inscrição | N/A |

### Relatórios Agregados com Native Query (`/api/relatorios`)

| Método | Rota | Descrição | Tipo de SQL Utilizado |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/relatorios/agregacao-categoria` | Retorna total de inscrições, total de eventos e faturamento estimado por categoria | SQL Nativo com `COUNT`, `SUM`, `COALESCE`, `LEFT JOIN` e `GROUP BY` |
| **GET** | `/api/relatorios/estatisticas-eventos` | Retorna total de inscritos, confirmados e preço médio por evento | SQL Nativo com `COUNT`, `SUM(CASE)`, `AVG` e `GROUP BY` |

---

## 5. Requisitos Atendidos

1. **Endpoints REST completos de cadastro (CRUD)**: `CategoriaController.java`, `EventoController.java` e `InscricaoController.java` contêm os verbos `GET`, `POST`, `PUT` e `DELETE`.
2. **Mínimo de 3 tabelas relacionais**: Tabelas `tb_categoria`, `tb_evento` e `tb_inscricao` definidas em `schema.sql`.
3. **Relacionamento 1:N mapeado**: Mapeado via `@OneToMany` e `@ManyToOne` nas entidades JPA.
4. **Agregação usando Native Query**: Implementado em `CategoriaRepository.java` via `@Query(nativeQuery = true)` e exposto em `RelatorioController.java`.
