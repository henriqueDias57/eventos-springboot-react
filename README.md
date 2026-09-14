# 🎯 Gerenciador de Eventos e Inscrições

> Projeto acadêmico de Banco de Dados — **Spring Boot 3 + React + PostgreSQL** (Execução 100% Local)

Sistema web para criar e gerenciar **categorias**, **eventos** e **inscrições de participantes**, com relatórios visuais e gráficos interativos, executando inteiramente no seu computador.

---

## 💻 Como Rodar o Projeto no seu Computador

### 📋 Pré-requisitos
- **Java 17+** (JDK)
- **Node.js 18+** e **npm**
- **PostgreSQL 14+** (ou Docker instalado)

---

### 🚀 Opção 1: Inicialização em 2 Cliques (Windows)

Na pasta raiz do projeto, basta dar duplo clique nos arquivos:

1. **`iniciar_backend.bat`** → Inicia a API Spring Boot na porta `8080`.
2. **`iniciar_frontend.bat`** → Inicia o Frontend React na porta `3000`.

Depois abra o navegador em: **`http://localhost:3000`**

---

### ⚙️ Opção 2: Inicialização pelo Terminal

#### 1. Banco de Dados PostgreSQL
Certifique-se de que o PostgreSQL está rodando na porta `5432` com o banco `db_eventos` criado.  
*Se preferir usar Docker:*
```bash
docker compose up -d
```

#### 2. Backend (Spring Boot)
Abra um terminal na pasta `eventos-api`:
```bash
mvn spring-boot:run
```
> O backend iniciará em `http://localhost:8080`. Os scripts `schema.sql` (tabelas) e `data.sql` (dados iniciais) são executados automaticamente pelo Spring Boot.

#### 3. Frontend (React + Vite)
Abra outro terminal na pasta `eventos-web`:
```bash
npm install
npm run dev
```
> O frontend estará disponível em `http://localhost:3000`.

---

## 🧭 Telas e Funcionalidades

- **Painel Inicial (`/`)**: Resumo de totais de categorias, eventos, participantes e faturamento estimado.
- **Categorias (`/categorias`)**: Cadastro, edição e exclusão de categorias temáticas.
- **Eventos (`/eventos`)**: Visualização em cards com data, local, preço e vagas.
- **Inscrições (`/inscricoes`)**: Gestão de participantes com status (Confirmada, Pendente, Cancelada).
- **Relatórios (`/relatorios`)**: Gráficos de barras e donuts gerados a partir de consultas SQL nativas (*Native Queries*).

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Java 17, Spring Boot 3.2.4, Spring Data JPA, Hibernate, PostgreSQL Driver, Maven.
- **Frontend**: React 18, Vite, Material UI v5 (MUI), Recharts (Gráficos), Axios.
- **Banco de Dados**: PostgreSQL com chaves estrangeiras, constraints e Native Queries agregadas.

---

## 📄 Documentação e Relatórios
- [RELATORIO_REVERSAO.md](file:///c:/Users/Henrique/Desktop/BD_TRABALHO/RELATORIO_REVERSAO.md) — Relatório detalhado da reversão para ambiente 100% local.
- [RELATORIO_AUDITORIA.md](file:///c:/Users/Henrique/Desktop/BD_TRABALHO/RELATORIO_AUDITORIA.md) — Auditoria técnica do backend e arquitetura de dados.
