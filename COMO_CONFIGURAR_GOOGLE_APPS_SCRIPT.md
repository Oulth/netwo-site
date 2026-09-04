# Guia Passo a Passo: Ativar o Envio de Leads no Google Sheets e Gmail

Este guia ensina como hospedar o script na conta **`tecnologianetwo@gmail.com`** para que todos os leads preenchidos no site cheguem diretamente na caixa de entrada da agência: **`agencianetwo@gmail.com`**.

---

### Passo 1: Criar a Planilha no Google Drive
1. Acesse o seu [Google Drive](https://drive.google.com/) ou [Google Sheets](https://sheets.new) logado na conta **`tecnologianetwo@gmail.com`**.
2. Crie uma nova planilha em branco.
3. Dê o nome que preferir (exemplo: **Leads - Netwo Comunicação**).

---

### Passo 2: Abrir o Editor do Apps Script
1. No menu superior da planilha, clique em:  
   **Extensões** > **Apps Script**.
2. Uma nova aba será aberta com o editor de código do Google.
3. Apague qualquer código de exemplo que estiver lá dentro (`function myFunction() { ... }`).

---

### Passo 3: Colar o Código do Script
1. Abra o arquivo [`google-apps-script.js`](./google-apps-script.js) deste projeto.
2. Copie todo o código.
3. Cole no editor do Apps Script.
4. Clique no ícone de disquete (💾 **Salvar projeto**) ou aperte `Ctrl + S`.

---

### Passo 4: Publicar como Web App (Gerar a URL)
1. No canto superior direito, clique no botão azul **Implantar** (ou *Deploy*) > **Nova implantação** (*New deployment*).
2. Na engrenagem ao lado de "Selecione o tipo", escolha: **App da Web** (*Web app*).
3. Preencha as configurações exatamente assim:
   * **Descrição:** `Webhook Leads Netwo`
   * **Executar como:** `Eu (tecnologianetwo@gmail.com)`
   * **Quem pode acessar:** **Qualquer pessoa** (*Anyone*) ⚠️ *(Importante: se deixar restrito, o site não conseguirá enviar os dados)*.
4. Clique em **Implantar** (*Deploy*).
5. O Google pedirá para **Autorizar o acesso**:
   * Clique em *Autorizar acesso*.
   * Escolha sua conta do Google.
   * Se aparecer *"O Google não verificou este app"*, clique no link cinza pequeno **Avançado** > **Acessar [Nome do Projeto] (não seguro)**.
   * Clique em **Permitir**.
6. O Google exibirá a tela com a **URL do app da Web** (um link que termina em `/exec`).
7. Clique em **Copiar**.

---

### Passo 5: Colar a URL no Site
1. Abra o arquivo [`script.js`](./script.js) do seu site.
2. Localize a linha (em torno da linha 600):
   ```javascript
   const GOOGLE_SCRIPT_WEBHOOK_URL = "";
   ```
3. Cole a sua URL entre as aspas:
   ```javascript
   const GOOGLE_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
   ```
4. Salve o arquivo (`Ctrl + S`).

---

### Pronto! 🎉
A partir de agora:
1. Toda vez que alguém preencher o formulário no site e clicar em **"Conversar com a equipe da Netwo"**:
   * Uma linha será registrada na planilha criada na sua conta **`tecnologianetwo@gmail.com`** com todos os dados.
   * Um e-mail formatado chegará diretamente na caixa de entrada oficial da agência: **`agencianetwo@gmail.com`**!
   * Ao clicar em **"Responder"** no Gmail, o campo de destinatário já será preenchido automaticamente com o e-mail do cliente!
