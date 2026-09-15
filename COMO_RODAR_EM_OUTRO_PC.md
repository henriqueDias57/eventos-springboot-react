# Guia de Execução em Outro Computador

Sistema de Gerenciamento de Eventos e Inscrições  
Java 17 (Spring Boot 3), React (Vite + Material UI) e PostgreSQL

Este documento descreve as etapas para instalar e executar o projeto em qualquer máquina.

---

## 1. Pré-requisitos

Instale os seguintes programas no computador de destino:

| Software | Versão Mínima | Link para Download |
|---|---|---|
| **Java JDK** | **Java 17 LTS** | [Adoptium Temurin JDK 17](https://adoptium.net/temurin/releases/?version=17) |
| **Node.js** | **v18 ou v20 LTS** | [Node.js Oficial](https://nodejs.org/) |
| **PostgreSQL** | **v14 ou superior** | [PostgreSQL Oficial](https://www.postgresql.org/download/) |
| **Git** | Qualquer versão | [Git Oficial](https://git-scm.com/) |

> Nota: Durante a instalação do PostgreSQL, configure a senha do usuário `postgres` como `postgres` para corresponder ao padrão configurado no projeto.

---

## 2. Passo a Passo

### Passo 1: Clonar o Repositório
Abra o terminal e execute:
```bash
git clone https://github.com/henriqueDias57/eventos-springboot-react.git
cd eventos-springboot-react
```

---

### Passo 2: Criar o Banco de Dados

#### Opção A — Utilizando o PostgreSQL local:
No pgAdmin, DBeaver ou terminal SQL (`psql`), execute:
```sql
CREATE DATABASE db_eventos;
```

#### Opção B — Utilizando Docker:
Caso o computador tenha Docker instalado:
```bash
docker compose up -d
```

---

### Passo 3: Instalar as Dependências do Frontend
No terminal, entre na pasta `eventos-web` e instale as dependências:
```bash
cd eventos-web
npm install
cd ..
```

---

### Passo 4: Iniciar a Aplicação

#### No Windows:
Execute os dois scripts presentes na raiz:
1. `iniciar_backend.bat`
2. `iniciar_frontend.bat`

#### Em outros sistemas operacionais (Linux / macOS):
Abra dois terminais separados:

**Terminal 1 (Backend):**
```bash
cd eventos-api
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd eventos-web
npm run dev
```

---

## 3. Endereços de Acesso

- **Frontend:** http://localhost:3000
- **API Backend:** http://localhost:8080
- **Documentação Swagger:** http://localhost:8080/swagger-ui/index.html

---

## 4. Diagnóstico de Problemas Comuns

1. **Erro de conexão com o banco:** Verifique se o serviço do PostgreSQL está ativo e se a base `db_eventos` foi criada.
2. **Erro de senha do PostgreSQL:** Caso a senha local seja diferente de `postgres`, atualize o campo `spring.datasource.password` no arquivo `eventos-api/src/main/resources/application.properties`.
3. **Porta em uso:** Certifique-se de que nenhum outro serviço esteja ocupando as portas 8080 ou 3000.
