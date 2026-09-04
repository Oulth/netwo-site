# Especificação Técnica: Envio de Formulário via Google Apps Script (E-mail + Google Sheets)

**Data:** 04/09/2026  
**Projeto:** Netwo Comunicação (`netwo agencia`)  
**Destinatário dos Leads:** `agencianetwo@gmail.com`  

---

## 1. Visão Geral e Objetivos

Substituir o comportamento atual de envio do formulário de diagnóstico (que abria o cliente de e-mail via `mailto:`) por um envio assíncrono em segundo plano integrado a um Webhook no **Google Apps Script**.

### Principais Objetivos:
1. **Envio Direto para o E-mail:** Disparo automático de e-mail formatado para `agencianetwo@gmail.com` a cada envio.
2. **Reply-To Dinâmico:** Ao clicar em "Responder" no Gmail, a resposta vai diretamente para o endereço de e-mail preenchido pelo visitante.
3. **Registro em Planilha:** Registro automático de todos os dados do lead em uma planilha do Google Sheets.
4. **Interface Otimizada:**
   - Botão de ação único: *"Conversar com a equipe da Netwo"*.
   - Rótulo de e-mail simplificado para: *"E-mail"*.
   - Cláusula padrão de segurança de dados e autorização de contato.
   - Feedback de carregamento (*loading spinner*) e confirmação de sucesso sem recarregar a página.
   - Link secundário sutil de WhatsApp para quem preferir atendimento imediato.

---

## 2. Arquitetura e Fluxo de Dados

```
[Visitante preenche formulário no site]
                     │
                     ▼
[Validação no Frontend (Nome, WhatsApp, E-mail, Interesses)]
                     │
                     ▼
[Fetch POST assíncrono com dados JSON para Google Apps Script Web App]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
[Registra linha no          [Dispara E-mail formatado para
 Google Sheets]              agencianetwo@gmail.com com Reply-To]
         │                       │
         └───────────┬───────────┘
                     ▼
[Retorno HTTP 200 { status: "success" }]
                     │
                     ▼
[Frontend: Limpa campos e exibe mensagem amigável de sucesso]
```

---

## 3. Frontend (Interface do Usuário)

### 3.1 Campos do Formulário (`index.html`)
* **Nome** (`#nome`): `required`, tipo texto.
* **WhatsApp** (`#whatsapp`): `required`, máscara `(85) 99999-9999`.
* **E-mail** (`#email`): `required`, rótulo *"E-mail"*, tipo email.
* **Interesse** (`#interestPills`): Pílulas multi-seleção interativas já existentes.
* **Mensagem** (`#mensagem`): Opcional, textarea.
* **Cláusula de Privacidade & Contato**:
  > *"Ao enviar, você concorda que seus dados estão seguros e autoriza a Netwo Comunicação a entrar em contato via WhatsApp ou e-mail."*

### 3.2 Botão de Envio e Estados
* **Texto:** `"Conversar com a equipe da Netwo"`.
* **Estado Enviando:** Botão desabilitado, spinner animado e texto *"Enviando solicitação..."*.
* **Estado Sucesso:** Mensagem de confirmação visível abaixo do formulário e reset dos campos.
* **Fallback / WhatsApp Secundário:** Link logo abaixo: *"Prefere atendimento imediato? Fale no WhatsApp"*.

---

## 4. Backend: Google Apps Script (`Code.gs`)

### 4.1 Endpoint Web App (`doPost`)
* Recebe a requisição POST com payload JSON contendo:
  ```json
  {
    "nome": "João da Silva",
    "whatsapp": "(85) 99999-9999",
    "email": "joao@empresa.com",
    "servicos": "Branding Estratégico, Tráfego Pago",
    "mensagem": "Quero renovar minha marca"
  }
  ```
* Extrai data/hora formatada no horário de Brasília (`America/Fortaleza`).
* Localiza a planilha vinculada ou cria os cabeçalhos padrão na primeira aba:
  `["Data/Hora", "Nome", "WhatsApp", "E-mail", "Serviços", "Mensagem"]`.
* Insere a nova linha com os dados recebidos.

### 4.2 Envio de E-mail via `MailApp.sendEmail`
* **Destinatário (`to`):** `agencianetwo@gmail.com`
* **Reply-To (`replyTo`):** `dados.email`
* **Assunto:** `🎯 Novo Diagnóstico Solicitado: [Nome] - [Serviço]`
* **HTML Body:** Template profissional com as cores da Netwo (#3779BF e #FFC814), listando todas as informações de forma clara, com botão/link direto para o WhatsApp do cliente (`https://wa.me/55...`).

### 4.3 Tratamento de Erros e CORS
* Utiliza `ContentService.createTextOutput` com cabeçalho JSON.
* Em caso de falha de conexão no frontend, uma notificação amigável avisa o usuário e oferece o envio dos dados diretamente pelo WhatsApp da agência.

---

## 5. Plano de Entrega
1. Criar o arquivo `google-apps-script.js` no repositório com o código pronto para implantação no Google Apps Script.
2. Atualizar o formulário no `index.html` (rótulo "E-mail", botão com novo texto, cláusula e container de feedback).
3. Atualizar o `script.js` para realizar o `fetch` assíncrono com estados de loading, sucesso e fallback para WhatsApp.
4. Ajustar os estilos necessários no `style.css`.
5. Fornecer instruções passo a passo para o usuário implantar a URL do Webhook no Google Drive em menos de 2 minutos.
