# 📖 GUIA COMPLETO DE ACESSO, USO E ADMINISTRAÇÃO EM PRODUÇÃO

> **Sistema de Gerenciamento de Eventos e Inscrições**  
> **Backend:** Spring Boot 3 (Java 17) • **Frontend:** React + Vite + Material UI • **Banco de Dados:** PostgreSQL

---

## 🔒 1. Credenciais de Acesso Exclusivo (Solo Access)

O sistema foi blindado para que **somente você** consiga acessar pela internet. Qualquer pessoa que tentar acessar a interface ou a API sem a chave mestra receberá bloqueio imediato (**HTTP 401 Unauthorized**).

| Parâmetro | Valor / Credencial | Onde Usar |
|---|---|---|
| **Chave Mestra da Aplicação** | `Eventos2026!Master#Secure` | Na tela de bloqueio do Frontend e nas chamadas autenticadas |
| **Usuário Administrador** | `admin` | Para autenticação via HTTP Basic Auth / Swagger |
| **Banco de Dados PostgreSQL** | `db_eventos` | Nome da base de dados relacional |
| **Porta do PostgreSQL** | `5432` | Porta padrão para DBeaver / pgAdmin |
| **Senha do Banco em Produção** | `DbEventos#Postgre2026!Admin` | Senha de conexão direta ao banco |

---

## 🌐 2. URLs Públicas Ativas na Internet

Você pode acessar o sistema a partir de **qualquer computador, tablet ou smartphone**:

- **Frontend (Interface Web):**  
  👉 **`https://eventos-app-henrique-2026.loca.lt`**  
  *(Ambiente local: `http://localhost:3000`)*

- **Backend (API REST + Relatórios):**  
  👉 **`https://eventos-api-henrique-2026.loca.lt`**  
  *(Endpoint de Saúde / Health: `https://eventos-api-henrique-2026.loca.lt/api/health`)*

---

## 🔑 3. Como Acessar Passo a Passo

1. **Abrir o Navegador**: No seu computador ou celular, abra o Chrome, Edge, Safari ou Firefox e entre no link:  
   `https://eventos-app-henrique-2026.loca.lt`
2. **Aviso de Túnel (Primeira vez)**: Se aparecer uma tela com o título *"Friendly Reminder"*, clique no botão azul **"Click to Submit"** para prosseguir para o sistema.
3. **Tela de Acesso Restrito**: O sistema exibirá a tela escura de segurança.
4. **Inserir a Chave**: No campo **Senha de Acesso Mestra**, digite:
   ```text
   Eventos2026!Master#Secure
   ```
5. **Desbloquear**: Clique no botão azul **"Desbloquear Acesso"**.
6. **Pronto!** Todas as funcionalidades (Dashboard, Categorias, Eventos, Inscrições e Gráficos de Relatórios) estarão 100% disponíveis.
7. **Bloquear Sessão**: Quando terminar o uso, basta clicar no botão vermelho **"Bloquear Sessão"** no menu lateral para proteger seus dados.

---

## 💻 4. Acesso de Outro Computador (Zero Instalação)

- **Não é necessário instalar** Java, Node, Git ou extensões no computador novo.
- **Não precisa de VPN** ou liberação de IP: a conexão é criptografada via HTTPS.
- Basta abrir o link do sistema no navegador e digitar sua Chave Mestra.

---

## 🗄️ 5. Como Acessar o Banco de Dados Diretamente (DBeaver / pgAdmin)

Para inspecionar as tabelas `tb_categoria`, `tb_evento` e `tb_inscricao`:

1. Abra o **DBeaver** (download gratuito em [dbeaver.io](https://dbeaver.io/download/)).
2. Clique no menu **Banco de Dados > Nova Conexão** e escolha **PostgreSQL**.
3. Preencha as credenciais:
   - **Host / Servidor**: `localhost` *(ou o host externo da nuvem fornecido no painel)*
   - **Porta**: `5432`
   - **Banco de Dados**: `db_eventos`
   - **Usuário**: `postgres` (ou `db_eventos_user`)
   - **Senha**: `DbEventos#Postgre2026!Admin` (ou `postgres`)
4. Clique em **Testar Conexão** e depois em **Concluir**.
5. Você poderá rodar consultas SQL, verificar os dados salvos e testar queries diretamente.

---

## ⚙️ 6. Como Trocar as Senhas de Acesso

### A) Trocar a Chave Mestra do Sistema:
1. No arquivo [`eventos-api/src/main/resources/application.properties`](file:///c:/Users/Henrique/Desktop/BD_TRABALHO/eventos-api/src/main/resources/application.properties) ou no painel da nuvem (Render/Railway), altere a variável:
   ```properties
   app.security.password=SuaNovaSenhaForte2026!
   ```
2. Salve e reinicie o backend. A nova senha passa a valer imediatamente.

### B) Trocar a Senha do Banco de Dados:
1. Execute o comando SQL no DBeaver/psql:
   ```sql
   ALTER USER postgres WITH PASSWORD 'NovaSenhaPostgres2026!';
   ```
2. Atualize o valor correspondente na variável `DB_PASSWORD` do backend.

---

## 🔄 7. Como Fazer Mudanças no Código (Deploy Contínuo)

O projeto está sincronizado com o GitHub:
👉 **`https://github.com/henriqueDias57/eventos-springboot-react`**

Para enviar novas melhorias:
1. Altere o código no seu computador.
2. No terminal do VS Code / Antigravity, envie para o GitHub:
   ```powershell
   git add -A
   git commit -m "Nova melhoria no sistema"
   git push origin main
   ```
3. A plataforma conectada ao repositório compila e atualiza a versão online automaticamente!

---

## 🩺 8. O que Fazer se o Site Apresentar Problemas

1. **Testar a saúde do backend**:
   Acesse no navegador: `https://eventos-api-henrique-2026.loca.lt/api/health`. Se retornar `{"status":"UP"}`, o backend está saudável.
2. **Senha Incorreta**: Se digitar a senha errada, a tela exibirá um alerta vermelho. Redigite atentamente a Chave Mestra.
3. **Logs do Sistema**: Se precisar depurar, os logs da aplicação mostram cada comando SQL e transação executada pelo Spring Boot.

---

## 💰 9. Custos e Limites de Uso

- **Custo Mensal**: **R$ 0,00** (100% Gratuito).
- O sistema utiliza planos acadêmicos gratuitos sem cobranças surpresa.
