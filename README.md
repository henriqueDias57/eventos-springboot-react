# 🎯 Gerenciador de Eventos e Inscrições

> Projeto acadêmico de Banco de Dados — Spring Boot 3 + React + PostgreSQL

Sistema web para criar e gerenciar **categorias**, **eventos** e **inscrições de participantes**, com relatórios visuais e gráficos.

---

## 📸 O que o sistema faz

- **Categorias** — Organize seus eventos por tipo (Workshop, Palestra, Conferência, etc.)
- **Eventos** — Crie eventos com data, local, preço e categoria
- **Inscrições** — Registre participantes nos eventos (nome, e-mail, situação)
- **Relatórios** — Veja gráficos e números consolidados (inscrições por categoria, faturamento estimado)

---

## 🚀 Como abrir o sistema

### Pré-requisitos
Você precisa ter instalado no computador:
1. **Java 17** (ou superior)
2. **PostgreSQL** (com um banco chamado `db_eventos` criado)
3. **Node.js 18+** (com npm)

### Passo 1 — Criar o banco de dados

Abra o **pgAdmin** (ou outro gerenciador PostgreSQL) e crie um banco chamado:
```
db_eventos
```
Usuário: `postgres` / Senha: `postgres` (se sua senha for diferente, edite o arquivo `eventos-api/src/main/resources/application.properties`).

### Passo 2 — Iniciar o Backend (servidor)

Abra um terminal (PowerShell) e rode:
```powershell
cd C:\Users\Henrique\Desktop\BD_TRABALHO\eventos-api
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
..\apache-maven-3.9.6\bin\mvn spring-boot:run
```
Espere aparecer `Started EventosApiApplication` — o servidor vai estar na porta **8080**.

### Passo 3 — Iniciar o Frontend (tela)

Abra um **segundo terminal** (sem fechar o primeiro) e rode:
```powershell
cd C:\Users\Henrique\Desktop\BD_TRABALHO\eventos-web
npm run dev
```
O sistema vai abrir na porta **3000**.

### Passo 4 — Abrir no navegador

Acesse: **http://localhost:3000**

Você vai ver o Painel Inicial com as estatísticas. Use o menu lateral para navegar.

---

## 🏗️ Estrutura do Projeto

```
BD_TRABALHO/
├── eventos-api/          ← Backend (Spring Boot 3 + PostgreSQL)
│   ├── src/main/java/    ← Código Java (Controllers, Services, Models)
│   ├── src/main/resources/
│   │   ├── application.properties  ← Configuração do banco
│   │   ├── schema.sql              ← Script de criação das tabelas
│   │   └── data.sql                ← Dados iniciais (seed)
│   ├── schema.sql        ← Script DDL completo
│   └── pom.xml           ← Dependências Maven
│
├── eventos-web/          ← Frontend (React + MUI + Vite)
│   ├── src/
│   │   ├── pages/        ← Telas (Dashboard, Categorias, Eventos, Inscrições, Relatórios)
│   │   ├── components/   ← Componentes reutilizáveis (Layout, ConfirmDialog, EmptyState)
│   │   ├── api.js        ← Integração com o backend
│   │   ├── theme.js      ← Tema visual (cores, fontes)
│   │   └── App.jsx       ← Roteamento principal
│   └── package.json
│
└── README.md             ← Este arquivo
```

## 📊 Banco de Dados

### Tabelas (3 tabelas com relacionamentos)

| Tabela | Descrição | Relacionamento |
|--------|-----------|----------------|
| `tb_categoria` | Tipos de evento | 1 categoria → N eventos |
| `tb_evento` | Eventos cadastrados | 1 evento → N inscrições |
| `tb_inscricao` | Participantes inscritos | Pertence a 1 evento |

### Diagrama ER

```
Categoria (1) ───→ (N) Evento (1) ───→ (N) Inscrição
```

### Native Queries (SQL puro)
- **Agregação por Categoria**: COUNT, SUM, GROUP BY com JOIN de 3 tabelas
- **Estatísticas por Evento**: COUNT, AVG, CASE com GROUP BY

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Data JPA, PostgreSQL |
| Frontend | React 18, MUI (Material UI), Vite, Axios, Recharts |
| Banco | PostgreSQL 16 |

---

*Projeto acadêmico — Disciplina de Banco de Dados*
