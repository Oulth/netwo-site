/**
 * ============================================================================
 * NETWO COMUNICAÇÃO - WEBHOOK DE RECEBIMENTO DE LEADS (GOOGLE APPS SCRIPT)
 * ============================================================================
 * 
 * Funcionalidades:
 * 1. Recebe dados via requisição POST (JSON ou formulário).
 * 2. Registra automaticamente o lead em uma nova linha do Google Sheets.
 * 3. Cria os cabeçalhos da planilha na primeira execução, se necessário.
 * 4. Envia e-mail formatado para agencianetwo@gmail.com.
 * 5. Configura o Reply-To com o e-mail do lead para resposta direta no Gmail.
 * 6. Gera link direto para iniciar conversa no WhatsApp do lead com 1 clique.
 */

// E-mail de destino oficial da agência
const DESTINATION_EMAIL = "agencianetwo@gmail.com";

/**
 * Ponto de entrada para requisições POST
 */
function doPost(e) {
  try {
    let data = {};

    // 1. Extração segura dos dados enviados
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const nome = (data.nome || "Não informado").trim();
    const whatsapp = (data.whatsapp || "Não informado").trim();
    const email = (data.email || "Não informado").trim();
    const servicos = (data.servicos || data.servico || "Não informado").trim();
    const mensagem = (data.mensagem || "Sem mensagem adicional").trim();

    // Data e Hora de Brasília (Fortaleza)
    const agora = new Date();
    const dataHoraFormatada = Utilities.formatDate(agora, "America/Fortaleza", "dd/MM/yyyy HH:mm:ss");

    // 2. Gravação na Planilha vinculada
    registrarNaPlanilha(dataHoraFormatada, nome, whatsapp, email, servicos, mensagem);

    // 3. Envio do E-mail formatado com Reply-To dinâmico
    enviarEmailNotificacao(dataHoraFormatada, nome, whatsapp, email, servicos, mensagem);

    // 4. Retorno JSON de sucesso
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead registrado e e-mail enviado com sucesso!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Erro ao processar lead: " + error.toString());

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Registra o lead na primeira aba da planilha ativa
 */
function registrarNaPlanilha(dataHora, nome, whatsapp, email, servicos, mensagem) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) return;

    const sheet = spreadsheet.getActiveSheet();

    // Cria cabeçalhos automaticamente se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      const headers = ["Data e Hora", "Nome", "WhatsApp", "E-mail", "Serviço(s) de Interesse", "Mensagem"];
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#3779BF");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Adiciona o lead
    sheet.appendRow([dataHora, nome, whatsapp, email, servicos, mensagem]);
  } catch (sheetErr) {
    Logger.log("Aviso: Não foi possível salvar na planilha (script não vinculado a uma planilha): " + sheetErr.toString());
  }
}

/**
 * Envia e-mail profissional com design Netwo e Reply-To dinâmico
 */
function enviarEmailNotificacao(dataHora, nome, whatsapp, email, servicos, mensagem) {
  // Limpa números do telefone para o link wa.me
  const apenasNumeros = whatsapp.replace(/\D/g, '');
  const linkWhatsApp = apenasNumeros.length >= 10 
    ? "https://wa.me/55" + apenasNumeros 
    : "https://api.whatsapp.com/send?phone=5585987978486";

  const assunto = "🎯 Novo Diagnóstico Solicitado: " + nome + (servicos !== "Não informado" ? " (" + servicos + ")" : "");

  // Corpo em texto puro (fallback)
  const textoPuro = 
    "NOVO DIAGNÓSTICO SOLICITADO NO SITE DA NETWO\n\n" +
    "Data: " + dataHora + "\n" +
    "Nome: " + nome + "\n" +
    "WhatsApp: " + whatsapp + " (" + linkWhatsApp + ")\n" +
    "E-mail: " + email + "\n" +
    "Interesse(s): " + servicos + "\n" +
    "Mensagem: " + mensagem + "\n\n" +
    "Dica: Para responder o cliente por e-mail, basta clicar em 'Responder' nesta mensagem.";

  // Template HTML Premium com a identidade visual da Netwo
  const corpoHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #163A66 0%, #3779BF 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 0; font-size: 14px; opacity: 0.85; }
        .badge { display: inline-block; background: #FFC814; color: #04060C; font-weight: 800; font-size: 11px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 32px 28px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .info-table td { padding: 12px 14px; border-bottom: 1px solid #F1F5F9; vertical-align: top; font-size: 14px; }
        .info-label { font-weight: 600; color: #64748B; width: 32%; }
        .info-value { color: #0F172A; font-weight: 500; }
        .highlight { color: #3779BF; font-weight: 700; }
        .actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #E2E8F0; }
        .btn-wa { display: inline-block; background: #25D366; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; margin-right: 8px; }
        .btn-reply { display: inline-block; background: #3779BF; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; }
        .footer { background: #F8FAFC; padding: 16px 24px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="badge">Novo Lead do Site</span>
          <h1>Solicitação de Diagnóstico</h1>
          <p>Recebido em ${dataHora}</p>
        </div>
        <div class="content">
          <table class="info-table">
            <tr>
              <td class="info-label">👤 Nome:</td>
              <td class="info-value"><strong>${nome}</strong></td>
            </tr>
            <tr>
              <td class="info-label">📱 WhatsApp:</td>
              <td class="info-value"><a href="${linkWhatsApp}" style="color: #25D366; text-decoration: none; font-weight: bold;">${whatsapp} ↗</a></td>
            </tr>
            <tr>
              <td class="info-label">✉️ E-mail:</td>
              <td class="info-value"><a href="mailto:${email}" style="color: #3779BF; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td class="info-label">🎯 Interesse(s):</td>
              <td class="info-value highlight">${servicos}</td>
            </tr>
            <tr>
              <td class="info-label">💬 Mensagem:</td>
              <td class="info-value" style="background: #F8FAFC; padding: 10px; border-radius: 6px;">${mensagem.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${linkWhatsApp}" class="btn-wa">Abrir Conversa no WhatsApp</a>
            <a href="mailto:${email}?subject=Re:%20Diagnóstico%20Estratégico%20-%20Netwo%20Comunicação" class="btn-reply">Responder por E-mail</a>
          </div>
        </div>
        <div class="footer">
          Netwo Comunicação • Nós Somos a Sua Ideia • Fortaleza - CE<br>
          <em>Dica: Clicar em "Responder" no Gmail responde diretamente para ${email}</em>
        </div>
      </div>
    </body>
    </html>
  `;

  // Envio seguro via MailApp com Reply-To dinâmico
  const options = {
    htmlBody: corpoHtml,
    name: "Netwo Leads"
  };

  // Se o e-mail do lead for válido, define como replyTo
  if (email && email.includes("@") && email !== "Não informado") {
    options.replyTo = email;
  }

  MailApp.sendEmail(DESTINATION_EMAIL, assunto, textoPuro, options);
}
