# 📖 GUIA COMPLETO DE ACESSO E ADMINISTRAÇÃO

> **Sistema de Gerenciamento de Eventos e Inscrições**  
> Backend: **Spring Boot 3 (Java 17)** • Frontend: **React + Vite + Material UI** • Banco de Dados: **PostgreSQL**

---

## 🔒 1. Credenciais e Senhas de Acesso

O sistema foi blindado para que **somente você** consiga acessar pela internet. Ninguém sem a chave mestra conseguirá ver ou utilizar o sistema ou as APIs.

| Item | Valor / Credencial | Descrição |
|---|---|---|
| **Chave Mestra de Acesso (Aplicação)** | `Eventos2026!Master#Secure` | Senha digitada na tela de bloqueio do frontend e usada nas requisições da API. |
| **Usuário Administrador da API** | `admin` | Usuário padrão para autenticação HTTP Basic Auth. |
| **Usuário Padrão do Banco de Dados** | `db_eventos_user` (ou `postgres`) | Usuário de administração do PostgreSQL. |
| **Senha Inicial do Banco de Dados** | `DbEventos#Postgre2026!Admin` | Senha forte gerada para conexão remota ao banco de dados. |

---

## 🌐 2. Como Acessar o Sistema no Ar

### Acesso pelo Navegador (Qualquer Computador ou Celular)
1. Abra o navegador de sua preferência (Google Chrome, Edge, Safari, Firefox, etc.).
2. Acesse a URL do Frontend hospedado:
   - **Ambiente Local**: `http://localhost:3000`
   - **Ambiente em Nuvem (Render / Vercel)**: `https://eventos-web-frontend.onrender.com` *(ou o link gerado na sua conta Render)*
3. Na primeira vez que você abrir a página, aparecerá uma tela preta elegante de **Acesso Restrito**.
4. No campo **"Senha de Acesso Mestra"**, digite:
   ```text
   Eventos2026!Master#Secure
   ```
5. Clique no botão azul **"Desbloquear Acesso"**.
6. Pronto! O sistema é desbloqueado e você terá acesso total a todas as telas (Painel Inicial, Categorias, Eventos, Inscrições e Relatórios).

> 💡 **Dica de Segurança**: Quando terminar de usar em um computador público ou compartilhado, basta clicar no botão vermelho **"Bloquear Sessão"** no menu lateral esquerdo para fechar o acesso imediatamente.

### O que fazer se esquecer a senha de acesso?
1. Abra o painel da sua plataforma de hospedagem (ex: **Render Dashboard** em https://dashboard.render.com).
2. Clique no serviço do backend (`eventos-api-backend`).
3. Vá na aba **"Environment"** (Ambiente).
4. Localize a variável `SECURITY_ADMIN_PASSWORD` para visualizar ou redefinir o valor.

---

## 💻 3. Como Acessar de Outro Computador (Zero Instalação)

Você pode abrir o sistema em **qualquer computador no mundo**:
- **Não precisa instalar nada**: Não precisa de Java, Node.js, Git, nem extensões.
- **Não precisa de VPN**: O sistema roda via HTTPS com certificado de segurança SSL.
- **Passo a passo**:
  1. No computador novo, abra o navegador.
  2. Digite a URL do sistema no ar.
  3. Digite sua senha mestra (`Eventos2026!Master#Secure`).
  4. O navegador guardará sua sessão enquanto a aba estiver aberta.

---

## 🗄️ 4. Como Acessar o Banco de Dados Diretamente (DBeaver / pgAdmin)

Se você ou o professor quiserem inspecionar as tabelas diretamente via software de banco de dados:

### 🛠️ Ferramenta Recomendada
Recomendamos o **DBeaver Community** (Gratuito e simples de usar):
👉 Download: [dbeaver.io/download](https://dbeaver.io/download/)

### 📝 Passo a Passo no DBeaver:
1. Abra o DBeaver e clique no menu **Banco de Dados > Nova Conexão** (ou no ícone de tomada com `+`).
2. Selecione **PostgreSQL** e clique em **Avançar**.
3. Preencha os campos com os dados da sua hospedagem:
   - **Host / Servidor**: `db-eventos-postgres.oregon-postgres.render.com` *(pegar no painel da Render em "External Database URL")*
   - **Porta**: `5432`
   - **Banco de Dados**: `db_eventos`
   - **Nome de Usuário**: `db_eventos_user`
   - **Senha**: Sua senha configurada no banco (ex: `DbEventos#Postgre2026!Admin`).
4. Na aba **SSL**, certifique-se de marcar `SSL mode: require` (obrigatório para conexões seguras em nuvem).
5. Clique em **Testar Conexão**. Aparecerá uma mensagem verde de "Conectado!".
6. Clique em **Concluir**.

Agora você pode expandir as tabelas `tb_categoria`, `tb_evento` e `tb_inscricao`, rodar comandos `SELECT`, `INSERT` ou exportar relatórios em SQL.

---

## 🔑 5. Como Trocar as Senhas

### A) Trocar a Senha de Acesso ao Sistema (Frontend e API)
1. Acesse o **Render Dashboard** ([dashboard.render.com](https://dashboard.render.com)).
2. Clique no serviço **`eventos-api-backend`**.
3. No menu lateral esquerdo, clique em **"Environment"**.
4. Encontre a linha da variável:
   ```text
   SECURITY_ADMIN_PASSWORD
   ```
5. Clique no ícone de lápis / editar, digite a nova senha desejada e clique em **"Save Changes"** (Salvar Alterações).
6. O Render fará um restart automático em menos de 1 minuto.
7. Na próxima vez que abrir o site, use a sua nova senha!

---

### B) Trocar a Senha do Banco de Dados PostgreSQL
1. No **Render Dashboard**, clique no banco de dados **`db-eventos-postgres`**.
2. Role a página até a seção **"Access Control"** ou **"Database Credentials"**.
3. Clique no botão **"Reset Password"** (Redefinir Senha).
4. O Render gerará uma nova senha e atualizará automaticamente a variável de conexão do backend sem que você precise reconfigurar nada manualmente.

---

## 🚀 6. Como Fazer Mudanças no Código Depois do Deploy (CI/CD Automático)

O projeto está totalmente configurado para **Deploy Contínuo (Continuous Deployment)** a partir do repositório no GitHub:

👉 **Repositório**: `https://github.com/henriqueDias57/eventos-springboot-react`

### Como funciona:
1. Você faz qualquer alteração nos arquivos no seu computador (seja no backend ou no frontend).
2. Salva e envia para o GitHub com os comandos normais do Git:
   ```powershell
   git add .
   git commit -m "Minha melhoria no sistema"
   git push origin main
   ```
3. **Automático**: Assim que o GitHub recebe o `push`, a plataforma de nuvem (Render) detecta a alteração, compila o código novo e atualiza o site no ar sem interrupções!

---

## 🩺 7. O que Fazer se o Site Sair do Ar (Diagnóstico Rápido)

Se o site não abrir ou apresentar lentidão:

1. **Checar se o serviço está "acordando" (Sleep Mode no plano gratuito)**:
   - No plano gratuito da Render, se o backend ficar 15 minutos sem receber acessos, ele entra em modo de espera ("hibernação").
   - Ao abrir o site, a primeira requisição pode demorar cerca de **40 a 50 segundos** para acordar o servidor. Isso é perfeitamente normal no plano gratuito. Basta aguardar e recarregar a página.
2. **Verificar os Logs em Tempo Real**:
   - Entre no painel da Render ([dashboard.render.com](https://dashboard.render.com)).
   - Clique em `eventos-api-backend` e depois na aba **"Logs"**.
   - Lá você verá exatamente as mensagens de log do Spring Boot e qualquer eventual erro de banco de dados.
3. **Verificar o Status do Banco de Dados**:
   - Clique em `db-eventos-postgres` e confirme se o status está como **"Available"** (Disponível com ícone verde).

---

## 💰 8. Custos e Limites de Uso

| Serviço | Plano Escolhido | Custo Mensal | Limites |
|---|---|---|---|
| **Render Web Service (API)** | Gratuito (*Free Tier*) | **R$ 0,00** | 750 horas/mês (suficiente para rodar o mês todo). Hiberna após 15 min de inatividade. |
| **Render Static Site (Frontend)** | Gratuito (*Free Tier*) | **R$ 0,00** | 100 GB de tráfego/mês, SSL automático ilimitado. Não hiberna. |
| **PostgreSQL Database** | Gratuito (*Free Tier*) | **R$ 0,00** | 1 GB de armazenamento, conexões simultâneas adequadas para projeto acadêmico. |

> ℹ️ **O que acontece se passar do limite?**  
> Em plataformas como a Render, o serviço é pausado até o próximo ciclo ou solicita confirmação antes de gerar qualquer cobrança. Não há cobranças automáticas indesejadas no plano gratuito.

---

## 📋 9. Como Criar o Projeto na Nuvem em 3 Cliques com o Arquivo `render.yaml`

Para publicar este repositório no ar na sua conta Render:

1. Acesse **[dashboard.render.com](https://dashboard.render.com)** e faça login com sua conta do GitHub.
2. No canto superior direito, clique no botão azul **"New +"** e selecione **"Blueprint"**.
3. Conecte o repositório `eventos-springboot-react`.
4. O Render lerá automaticamente o arquivo [`render.yaml`](file:///c:/Users/Henrique/Desktop/BD_TRABALHO/render.yaml) que criamos na raiz do projeto e mostrará os 3 componentes (Banco PostgreSQL + Backend Java 17 + Frontend React).
5. Clique em **"Apply"** (Aplicar).
6. Em cerca de 3 a 5 minutos, todos os 3 serviços estarão online com URLs públicas seguras!
