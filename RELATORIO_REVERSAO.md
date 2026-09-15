# Relatório de Reversão para Ambiente Local

Sistema de Gerenciamento de Eventos e Inscrições  
Data: 14/09/2026

---

## 1. Agentes Especializados Utilizados

1. **Deploy / Infraestrutura (`devops-deploy`, `appdeploy`)**:
   - Encerramento de processos de túneis de rede (`localtunnel`).
   - Remoção dos arquivos de configuração de nuvem (`render.yaml`, `vercel.json`, `GUIA_DE_ACESSO.md`).
   - Criação do `docker-compose.yml` para subida do PostgreSQL local com scripts DDL/DML automáticos.

2. **Backend (`backend-architect`, `java-pro`)**:
   - Exclusão do filtro `AccessSecurityFilter.java`.
   - Restauração de `application.properties` com as credenciais padrão de desenvolvimento local (`jdbc:postgresql://localhost:5432/db_eventos`, user: `postgres`, pass: `postgres`).
   - Remoção de checagens de senhas de infraestrutura ou cabeçalhos de Basic Auth.

3. **Frontend (`senior-frontend`, `react-patterns`)**:
   - Remoção da tela de bloqueio `AccessGate.jsx` e do botão de bloqueio de sessão.
   - Simplificação do cliente `api.js` para comunicação limpa com o backend local.
   - Validação da compilação de produção com `npm run build`.

---

## 2. O que foi Desfeito do Deploy Anterior

| Item Modificado | Ação Realizada | Motivo |
|---|---|---|
| Túneis HTTPS Localtunnel | Desativados e processos finalizados | Evitar exposição de portas ou links remotos |
| `AccessSecurityFilter.java` | Removido | Retirar obrigatoriedade de senha de infraestrutura |
| `AccessGate.jsx` | Removido | Permitir acesso imediato à interface sem telas de senha |
| `render.yaml` & `vercel.json` | Removidos | Eliminar dependências de configurações em nuvem |
| `GUIA_DE_ACESSO.md` | Removido | Substituído pelo guia local unificado no `README.md` |
| Cabeçalhos `X-Access-Key` | Removidos do frontend e backend | Tráfego local direto sem sobrecarga |

---

## 3. Estado Atual do Projeto

- **Banco de Dados**: PostgreSQL local na porta 5432 (`db_eventos`).
- **Backend API**: Spring Boot 3 na porta 8080 (`http://localhost:8080`).
- **Frontend Web**: React + Vite + Material UI v5 na porta 3000 (`http://localhost:3000`).
- **Scripts de Inicialização**: `iniciar_backend.bat` e `iniciar_frontend.bat` criados na raiz.

---

## 4. Validação dos Testes Locais

1. **API REST Local**: Retornando dados com código HTTP 200 OK sem necessidade de autenticação.
2. **Native Query Local**: Agregação de dados SQL nativo executada diretamente sobre o banco local com retorno correto de totais e faturamento.
3. **Frontend Build**: Compilação `npm run build` gerando assets finais em `dist/`.
4. **Navegação no Browser**: Acesso a `http://localhost:3000` abre diretamente o Painel Inicial.
