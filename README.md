# Gerenciador de Eventos e Inscrições

Trabalho prático da disciplina de Banco de Dados desenvolvido com **Spring Boot 3**, **React** e **PostgreSQL**.

O sistema gerencia categorias, eventos e inscrições de participantes, incluindo relatórios com consultas agregadas em SQL nativo.

---

## Como Executar o Projeto Localmente

### Pré-requisitos
- **Java 17 JDK** (ou superior)
- **Node.js 18+** com npm
- **PostgreSQL 14+** (ou Docker)

---

### Execução Rápida no Windows

Na pasta raiz do projeto, execute os scripts:

1. Execute `iniciar_backend.bat` para iniciar a API na porta 8080.
2. Execute `iniciar_frontend.bat` para iniciar o React na porta 3000.
3. Acesse `http://localhost:3000` no navegador.

---

### Execução via Terminal

#### 1. Banco de Dados PostgreSQL
Certifique-se de que o PostgreSQL está rodando na porta 5432 com o banco `db_eventos` criado.  
Caso utilize Docker:
```bash
docker compose up -d
```

#### 2. Backend (Spring Boot)
No terminal, dentro da pasta `eventos-api`:
```bash
mvn spring-boot:run
```
O backend estará acessível em `http://localhost:8080`. Os scripts `schema.sql` e `data.sql` são carregados automaticamente.

#### 3. Frontend (React)
Em outro terminal, dentro da pasta `eventos-web`:
```bash
npm install
npm run dev
```
O frontend estará acessível em `http://localhost:3000`.

---

## Telas da Aplicação

- **Painel Inicial (`/`)**: Visão geral de métricas consolidadas e atalhos rápidos.
- **Categorias (`/categorias`)**: Listagem, cadastro, edição e exclusão de categorias.
- **Eventos (`/eventos`)**: Exibição em cards com informações de data, local, preço e categoria.
- **Inscrições (`/inscricoes`)**: Cadastro de participantes e controle de status da inscrição.
- **Relatórios (`/relatorios`)**: Gráficos estatísticos e de faturamento alimentados por Native Queries no PostgreSQL.

---

## Estrutura de Tecnologias

- **Backend:** Java 17, Spring Boot 3.2.4, Spring Data JPA, Hibernate, PostgreSQL Driver.
- **Frontend:** React 18, Vite, Material UI (MUI v5), Recharts, Axios.
- **Banco de Dados:** PostgreSQL com integridade referencial e Native Queries.

---

## Documentação Técnica
- [DOCUMENTACAO_COMPLETA.md](DOCUMENTACAO_COMPLETA.md) — Explicação detalhada da arquitetura, banco de dados, rotas e perguntas para defesa.
- [COMO_RODAR_EM_OUTRO_PC.md](COMO_RODAR_EM_OUTRO_PC.md) — Passo a passo para executar o projeto em outro computador.
- [RELATORIO_REVERSAO.md](RELATORIO_REVERSAO.md) — Detalhes da reversão de deploy para execução local.
