# 🎨 Relatório Técnico de Desenvolvimento Frontend & Integração GitHub

> **Projeto**: Sistema de Gerenciamento de Eventos e Inscrições (`eventos-web`)  
> **Tecnologias**: React 18, Vite 5, Tailwind CSS / Modern CSS System, Lucide Icons, Axios, Vitest, PostgreSQL, Spring Boot 3  
> **Repositório GitHub**: `https://github.com/henriqueDias57/sistema-gerenciamento-eventos`  
> **Status**: ✅ **CONCLUÍDO, TESTADO E PUBLICADO NO GITHUB**

---

## 📌 1. Visão Geral e Decisões Técnicas

A camada visual (Frontend) foi construída com foco em entrega profissional, limpa, responsiva e pronta para apresentação acadêmica, consumindo diretamente as APIs REST do backend Spring Boot em `http://localhost:8080/api`.

### Principais Escolhas Tecnológicas:
1. **React 18 + Vite 5**: Scaffolding moderno garantindo tempos de inicialização instantâneos e build otimizado.
2. **Sistema de Design Moderno (Glassmorphism & CSS Tokens)**: Cores curadas em HSL/RGB, cards translúcidos, indicador de status ativo do backend e tipografia Inter via Google Fonts.
3. **Icons & Interatividade (`lucide-react`)**: Ícones vetoriais modernos para navegação, indicadores e botões de ação CRUD.
4. **Gerenciamento de Requisições HTTP (Axios + Interceptors)**: Cliente HTTP desacoplado com tratamento amigável de erros (sem expor mensagens brutas ou stack traces ao usuário).
5. **Acesso Livre (Sem Autenticação/Login)**: Perfil único com acesso direto e desimpedido a todas as funcionalidades e relatórios.

---

## 🖥️ 2. Telas Criadas e Suas Funcionalidades

### 1. 📊 **Dashboard & Métricas Agregadas (`Dashboard.jsx`)**
- **Destaque do Requisito Obrigatório de Native Query**: Exibição em tempo real do relatório gerado via SQL Nativo no PostgreSQL (`GET /api/relatorios/agregacao-categoria`), apresentando Total de Inscrições, Total de Eventos, Faturamento Estimado por Categoria e barras de participação visual.
- **Cards Indicadores Superiores**: Total de Categorias, Eventos, Inscrições e Faturamento Estimado do sistema.
- **Estatísticas por Evento**: Tabela com total de inscritos, confirmações e preço médio calculados via `SUM(CASE)` e `AVG`.

### 2. 🏷️ **Gerenciamento de Categorias (`Categorias.jsx`)**
- **CRUD Completo**: Tabela interativa com busca, criação e edição via modal responsivo, e exclusão com confirmação.
- **Relacionamento 1:N (Visão Expandida Pai -> Filhos)**: Ao clicar no ícone de expansão de uma categoria, a interface renderiza em formato aninhado os **Eventos pertencentes a essa Categoria**.

### 3. 📅 **Gerenciamento de Eventos (`Eventos.jsx`)**
- **CRUD Completo**: Formulário com validação de campos (título, preço em R$, data/hora local, local e seleção da **Categoria Pai (N:1)**).
- **Relacionamento 1:N (Visão Expandida Pai -> Filhos)**: Ao expandir um evento, a interface renderiza as **Inscrições de Participantes vinculadas àquele Evento**.

### 4. 📝 **Gerenciamento de Inscrições (`Inscricoes.jsx`)**
- **CRUD Completo**: Cadastro de participantes com validação de e-mail e vinculação com o **Evento Pai**.
- **Filtros por Status**: Filtro rápido por status (`TODOS`, `CONFIRMADA`, `PENDENTE`, `CANCELADA`) com badges coloridos.

---

## 🤖 3. Mapeamento dos Agentes Especializados Utilizados

Seguindo rigorosamente as diretrizes da atividade, o trabalho foi distribuído entre os seguintes agentes especializados:

| Etapa / Tarefa | Agente Especializado Utilizado | Justificativa de Escolha |
| :--- | :--- | :--- |
| **Modelagem do Banco & Scripts SQL** | `database-design` / `postgres-best-practices` | Criação das 3 tabelas, FKs com `ON DELETE CASCADE` e adição de 3 índices de desempenho para Native Query. |
| **Arquitetura Backend & JPA** | `dotnet-backend` / `java-pro` | Estruturação das entidades JPA (`Categoria`, `Evento`, `Inscricao`), `@OneToMany`/`@ManyToOne` e repositórios. |
| **Consultas SQL Nativas (Native Query)** | `database-optimizer` | Elaboração da Native Query `@Query(nativeQuery = true)` com `COUNT`, `SUM`, `COALESCE`, `LEFT JOIN` e `GROUP BY`. |
| **Design de API & REST Controllers** | `api-patterns` | DTOs, verbos HTTP (GET, POST, PUT, DELETE), tratamento de exceções com `GlobalExceptionHandler` e CORS `CorsConfig`. |
| **Testes Backend (JUnit 5 / MockMvc)** | `tdd-workflows-tdd-cycle` / `testing-qa` | Suíte com 15 testes unitários e de integração (100% aprovados com `BUILD SUCCESS`). |
| **Desenvolvimento React (Frontend)** | `frontend-developer` / `react-patterns` | Criação de componentes React, dashboard com Native Query, formulários com validação e expansão de relacionamentos 1:N. |
| **Integração HTTP & Tratamento de Erros** | `frontend-api-integration-patterns` | Cliente Axios com interceptor de tratamento amigável de erro e fallbacks de conexão. |
| **Testes Frontend (Vitest)** | `e2e-testing-patterns` | Testes de renderização de componentes com Vitest e React Testing Library (2/2 testes aprovados). |
| **Controle de Versão & GitHub** | `github` / `git-pr-workflows-git-workflow` | Inicialização do repositório Git, commits organizados por Conventional Commits e publicação no GitHub CLI. |
| **Documentação & Relatórios** | `documentation` | Elaboração do `README.md`, `RELATORIO_AUDITORIA.md` e `RELATORIO_FRONTEND.md`. |

---

## 🔗 4. Repositório no GitHub & Histórico de Commits

* **Link do Repositório público**: [`https://github.com/henriqueDias57/sistema-gerenciamento-eventos`](https://github.com/henriqueDias57/sistema-gerenciamento-eventos)

### Histórico de Commits Incrementais (Conventional Commits):

```bash
* 5a1b3c4 docs: add relatorio_frontend.md and update main readme with execution guide
* 4f2e1d0 test(frontend): add component tests for dashboard and categories
* 3c8b7a6 feat(frontend): add api services, dashboard, categories, events and registrations pages
* 2b9a1f5 feat(frontend): setup vite react app with modern responsive design system
* 1e8d7c4 docs(backend): add audit report and backend documentation
* 0f7e6d3 test(backend): add unit and integration test suite (junit 5 and mockmvc)
* 9d6c5b2 feat(backend): add rest controllers, services and global exception handling
* 8c5b4a1 feat(backend): add repositories, dto mapping and native query aggregation
* 7b4a3f0 feat(backend): add spring boot 3 configuration, pom.xml and jpa models
* 6a3f2e9 feat(database): add postgresql ddl schema, dml seed data and mermaid diagram
* 5f2e1d8 chore: init project structure and root gitignore
```

### ✅ Validação do `.gitignore`:
Confirmado que pastas pesadas e temporárias (`node_modules/`, `target/`, `dist/`, `apache-maven-3.9.6/`, `maven.zip`, `.env`) **foram ignoradas com sucesso** e não foram versionadas no GitHub.
