# 💻 Guia Completo: Como Rodar o Projeto em Outro Computador

> **Sistema de Gerenciamento de Eventos e Inscrições**  
> **Tecnologias:** Java 17 (Spring Boot 3) • React (Vite + Material UI) • PostgreSQL

Este guia explica passo a passo tudo o que é necessário para executar este projeto do zero em qualquer outro computador (seja o notebook do professor, de um colega ou outra máquina).

---

## 📦 1. Pré-requisitos (O que precisa estar instalado)

Antes de iniciar, certifique-se de que o computador possui os seguintes softwares instalados:

| Software | Versão Recomendada | Link para Download Gratuito |
|---|---|---|
| **Java JDK** | **Java 17 LTS** (ou superior) | [Download Adoptium Temurin JDK 17](https://adoptium.net/temurin/releases/?version=17) |
| **Node.js** | **v18 ou v20 LTS** *(já inclui npm)* | [Download Node.js](https://nodejs.org/) |
| **PostgreSQL** | **v14, v15 ou v16** *(ou Docker)* | [Download PostgreSQL](https://www.postgresql.org/download/) |
| **Git** | Qualquer versão recente | [Download Git](https://git-scm.com/) |

> 💡 **Nota sobre a instalação do PostgreSQL**:  
> Durante a instalação do PostgreSQL, quando o instalador pedir uma senha para o usuário `postgres`, defina como **`postgres`** (que é o padrão configurado no projeto).

---

## 🚀 2. Passo a Passo de Execução

### Passo 1: Obter o Projeto
Abra o terminal (Prompt de Comando ou PowerShell) e clone o repositório:
```bash
git clone https://github.com/henriqueDias57/eventos-springboot-react.git
cd eventos-springboot-react
```
*(Ou baixe e extraia o arquivo `.zip` do repositório).*

---

### Passo 2: Criar o Banco de Dados no PostgreSQL

#### Opção A — Pelo pgAdmin, DBeaver ou SQL Shell (psql):
Abra sua ferramenta de banco de dados e execute o comando:
```sql
CREATE DATABASE db_eventos;
```

#### Opção B — Via Docker (se o computador tiver Docker instalado):
Na pasta raiz do projeto, basta rodar:
```bash
docker compose up -d
```
*(O banco PostgreSQL subirá automaticamente na porta 5432 com as tabelas e dados prontos).*

---

### Passo 3: Instalar as Dependências do Frontend
No terminal, entre na pasta `eventos-web` e execute o comando abaixo *(necessário apenas na primeira vez)*:
```bash
cd eventos-web
npm install
cd ..
```

---

### Passo 4: Iniciar o Sistema

#### 🔹 Modo 1: Em 2 Cliques (No Windows)
Na pasta raiz do projeto, basta dar **duplo clique** nos dois arquivos:
1. **`iniciar_backend.bat`** *(Abre o terminal iniciando o Spring Boot na porta 8080)*
2. **`iniciar_frontend.bat`** *(Abre o terminal iniciando o React na porta 3000)*

---

#### 🔹 Modo 2: Manualmente via Linha de Comando (Qualquer Sistema Operacional)

Abra **dois terminais separados**:

**Terminal 1 — Backend (Spring Boot):**
```bash
cd eventos-api
mvn spring-boot:run
```
*(Se o computador não tiver o comando `mvn` configurado nas variáveis de ambiente, utilize o Maven incluso na pasta raiz: `..\apache-maven-3.9.6\bin\mvn spring-boot:run` no Windows).*

> ⏳ *Aguarde alguns segundos até aparecer a mensagem:*  
> `Started EventosApiApplication in ... seconds`  
> *(As tabelas `schema.sql` e os dados iniciais `data.sql` são criados automaticamente pelo Spring Boot).*

**Terminal 2 — Frontend (React):**
```bash
cd eventos-web
npm run dev
```

---

## 🌐 3. Acessar o Sistema no Navegador

Com os dois terminais em execução, abra o navegador de sua preferência:

- **Interface do Sistema (React):** [http://localhost:3000](http://localhost:3000)
- **API Backend (Spring Boot):** [http://localhost:8080](http://localhost:8080)
- **Documentação Swagger / OpenAPI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Console do Banco H2 (se ativado):** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## 🔍 4. Resolução de Problemas Comuns (Troubleshooting)

### 1. Erro: *"Connection refused"* ou *"Não foi possível conectar ao banco de dados"*
- **Causa:** O serviço do PostgreSQL não está em execução ou o banco `db_eventos` ainda não foi criado.
- **Solução:** Verifique no painel de Serviços do Windows se o serviço `postgresql-x64-XX` está em status "Em Execução", e certifique-se de ter executado `CREATE DATABASE db_eventos;`.

### 2. Erro: *"Password authentication failed for user postgres"*
- **Causa:** A senha do seu PostgreSQL local é diferente de `postgres`.
- **Solução:** Abra o arquivo `eventos-api/src/main/resources/application.properties` e altere a linha:
  ```properties
  spring.datasource.password=sua_senha_aqui
  ```

### 3. Erro: *"'mvn' não é reconhecido como um comando interno"*
- **Causa:** O Apache Maven não está no `PATH` global do sistema.
- **Solução:** Use o script `iniciar_backend.bat` que já detecta e utiliza o Maven embutido no projeto na pasta `apache-maven-3.9.6`.

### 4. Erro: *"Port 8080 is already in use"* ou *"Port 3000 is already in use"*
- **Causa:** Outro processo já está usando a porta.
- **Solução:** Feche outras instâncias de terminais ou altere a porta no `application.properties` / `vite.config.js`.
