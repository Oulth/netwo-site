# Formulário de Leads via Google Apps Script (E-mail + Planilha) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o envio assíncrono do formulário de diagnóstico da Netwo Comunicação via Google Apps Script para o e-mail `agencianetwo@gmail.com` com Reply-To dinâmico, gravação no Google Sheets e feedback visual na interface.

**Architecture:** O frontend (`script.js`) valida os dados do formulário e realiza um `fetch` assíncrono via POST para uma URL de Web App do Google Apps Script. O script em nuvem recebe os dados, insere uma linha no Google Sheets com data/hora formatada e envia um e-mail HTML estilizado para `agencianetwo@gmail.com` com o cabeçalho `replyTo` configurado para o e-mail do cliente.

**Tech Stack:** HTML5, CSS3, JavaScript Vanilla (ES6+), Google Apps Script (JavaScript V8 runtime).

## Global Constraints

- Destinatário oficial: `agencianetwo@gmail.com`
- Reply-To configurado para o e-mail preenchido pelo visitante
- Botão principal com o texto: `"Conversar com a equipe da Netwo"`
- Rótulo de e-mail: `"E-mail"`
- Cláusula de consentimento formal incluída no rodapé do formulário
- Manter integridade visual existente com design tokens da Netwo (#3779BF, #FFC814, #25D366)

---

### Task 1: Criar o Script do Backend Google Apps Script (`google-apps-script.js`)

**Files:**
- Create: `google-apps-script.js`

**Interfaces:**
- Produz: Função `doPost(e)` que recebe `{ nome, whatsapp, email, servicos, mensagem }`, registra na planilha e envia e-mail com Reply-To.

- [ ] **Step 1: Criar o arquivo `google-apps-script.js` com o código completo do Web App**
  - Implementar parser de payload JSON / Form URL Encoded.
  - Implementar gravação na aba ativa do Google Sheets com colunas automáticas.
  - Implementar montagem do e-mail HTML estilizado com link direto para WhatsApp e Reply-To.
  - Implementar resposta com `ContentService.MimeType.JSON`.

- [ ] **Step 2: Verificar sintaxe do script via Node.js**
  - Run: `node -c "google-apps-script.js"`
  - Expected: Saída limpa sem erros de sintaxe.

- [ ] **Step 3: Commit**
  - `git add google-apps-script.js`
  - `git commit -m "feat: adicionar backend do google apps script para envio de leads"`

---

### Task 2: Atualizar Estrutura do Formulário no HTML (`index.html`)

**Files:**
- Modify: `index.html:205-276`

**Interfaces:**
- Consome: IDs de campos `#nome`, `#whatsapp`, `#email`, `#mensagem`, `#interestPills`.
- Produz: `#leadForm`, `#btnSubmitLead`, `#formStatus`, link secundário de WhatsApp.

- [ ] **Step 1: Modificar o formulário em `index.html`**
  - Alterar label do campo de e-mail de "E-mail Profissional" para "E-mail".
  - Substituir os botões lado a lado por um botão principal único com o id `btnSubmitLead` e texto `"Conversar com a equipe da Netwo"`.
  - Inserir container de feedback `#formStatus` para mensagens de sucesso ou erro.
  - Inserir link auxiliar sutil para WhatsApp: *"Prefere atendimento imediato? Fale no WhatsApp"*.
  - Atualizar o texto da nota de privacidade para a cláusula de consentimento acordada.

- [ ] **Step 2: Verificar validação das tags no HTML**
  - Checar fechamento de tags e atributos `required`.

- [ ] **Step 3: Commit**
  - `git add index.html`
  - `git commit -m "feat: atualizar estrutura do formulario com novo botao e rotulos"`

---

### Task 3: Estilização do Novo Botão e Mensagens de Feedback (`style.css`)

**Files:**
- Modify: `style.css`

**Interfaces:**
- Estilos para `.btn-form-submit`, `.form-status-alert`, `.btn-form-spinner`, `.form-wa-helper`.

- [ ] **Step 1: Adicionar estilos CSS no `style.css`**
  - Estilo do botão principal `.btn-form-submit` com gradiente e hover suave.
  - Estilo do spinner de carregamento para o estado enviando.
  - Estilo dos alertas de status (`.form-status-success` e `.form-status-error`).
  - Estilo do link auxiliar de WhatsApp logo abaixo do botão.

- [ ] **Step 2: Validar layout responsivo no CSS**
  - Garantir que o botão e os alertas fiquem proporcionais em desktop e mobile.

- [ ] **Step 3: Commit**
  - `git add style.css`
  - `git commit -m "style: estilizar novo botao de envio e mensagens de status do formulario"`

---

### Task 4: Lógica de Envio Assíncrono e Fallback no JavaScript (`script.js`)

**Files:**
- Modify: `script.js:565-640`

**Interfaces:**
- Consome: `#leadForm`, `#btnSubmitLead`, URL do Webhook do Google Apps Script.
- Produz: Event listener de envio com `fetch`, tratamento de loading/sucesso e fallback de WhatsApp em caso de erro.

- [ ] **Step 1: Implementar o envio assíncrono em `script.js`**
  - Coletar e validar `nome`, `whatsapp`, `email` e serviços selecionados.
  - Definir constante de configuração `GOOGLE_SCRIPT_URL`.
  - Alternar estado do botão para "Enviando solicitação..." com spinner.
  - Disparar `fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify(data) })`.
  - Exibir alerta de sucesso amigável e limpar os campos.
  - Em caso de falha de conexão, exibir alerta de erro com botão direto para enviar via WhatsApp.

- [ ] **Step 2: Verificar sintaxe do JavaScript**
  - Run: `node -c "script.js"`
  - Expected: Código 0 sem erros.

- [ ] **Step 3: Commit**
  - `git add script.js`
  - `git commit -m "feat: implementar envio assincrono do formulario para o webhook"`

---

### Task 5: Documentação de Implantação e Verificação Final

**Files:**
- Create: `COMO_CONFIGURAR_GOOGLE_APPS_SCRIPT.md`

- [ ] **Step 1: Criar guia passo a passo em markdown explicando:**
  - Como abrir o Google Sheets / Google Drive.
  - Como colar o código do `google-apps-script.js`.
  - Como publicar como Web App (acesso: "Qualquer pessoa" / "Anyone").
  - Como colar a URL gerada no `script.js`.

- [ ] **Step 2: Commit e verificação geral**
  - `git add COMO_CONFIGURAR_GOOGLE_APPS_SCRIPT.md`
  - `git commit -m "docs: adicionar guia passo a passo de configuracao do google apps script"`
