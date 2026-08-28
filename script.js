/**
 * NETWO COMUNICAÇÃO - GSAP ANIMATIONS, SMOOTH SCROLL & INTERACTION SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. GSAP Inicialização da Lâmpada (Hero)
  if (typeof gsap !== 'undefined') {
    const bulbTl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    bulbTl.to('#heroAmbientGlow', {
      opacity: 0.95,
      scale: 1.15,
      duration: 3.5,
      ease: 'sine.inOut'
    }, 0)
    .to('#heroContainer', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, 0.4);
  }

  // 2. Header Glassmorphism no Scroll
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3. Navegação com Rolagem Suave Personalizada (Compensação do Header Fixo)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Multi-Seleção Interativa de Interesse (Tags / Pills)
  const interestPills = document.querySelectorAll('.interest-pill');
  interestPills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
    });
  });

  // 5. Ação dos Combos do Bloco 2 (Rola suave até o Formulário e Ativa os Interesses)
  function selectServicesForCombo(comboType) {
    // Limpa seleção anterior
    interestPills.forEach(pill => pill.classList.remove('active'));

    if (comboType === 'fundacao') {
      interestPills.forEach(pill => {
        const val = pill.getAttribute('data-value');
        if (val === 'Branding Estratégico' || val === 'Registro de Marcas') {
          pill.classList.add('active');
        }
      });
    } else if (comboType === 'performance') {
      interestPills.forEach(pill => {
        const val = pill.getAttribute('data-value');
        if (val === 'Tráfego Pago' || val === 'Sites e Landing Pages') {
          pill.classList.add('active');
        }
      });
    } else if (comboType === 'completo') {
      interestPills.forEach(pill => pill.classList.add('active'));
    }

    // Rolagem suave até o formulário
    const formTarget = document.getElementById('diagnostico');
    if (formTarget) {
      const headerOffset = 75;
      const elementPosition = formTarget.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Efeito de destaque no formulário
      const formCard = document.querySelector('.lead-form-card');
      if (formCard) {
        formCard.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
        formCard.style.borderColor = '#FFC814';
        formCard.style.boxShadow = '0 0 35px rgba(255, 200, 20, 0.6)';
        setTimeout(() => {
          formCard.style.borderColor = '';
          formCard.style.boxShadow = '';
        }, 1600);
      }
    }
  }

  // Atrelar botões dos combos
  document.querySelectorAll('[data-select-combo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const comboType = btn.getAttribute('data-select-combo');
      selectServicesForCombo(comboType);
    });
  });

  // 6. Máscara de WhatsApp / Telefone
  const phoneInput = document.getElementById('whatsapp');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }

  // 7. Envio do Formulário (WhatsApp e E-mail)
  const btnWhatsApp = document.getElementById('btnSubmitWhatsapp');
  const btnEmail = document.getElementById('btnSubmitEmail');
  const WHATSAPP_NUMBER = '5585987978486';

  function getSelectedInterests() {
    const activePills = document.querySelectorAll('.interest-pill.active');
    const selected = Array.from(activePills).map(p => p.getAttribute('data-value'));
    return selected.length > 0 ? selected.join(', ') : 'Consultoria Completa';
  }

  function getFormData() {
    const nome = document.getElementById('nome').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const email = document.getElementById('email').value.trim();
    const servico = getSelectedInterests();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !whatsapp) {
      alert('Por favor, preencha pelo menos seu Nome e WhatsApp.');
      return null;
    }

    return { nome, whatsapp, email, servico, mensagem };
  }

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data) return;

      let msg = `*Solicitação de Diagnóstico - Netwo Comunicação*\n\n`;
      msg += `👤 *Nome:* ${data.nome}\n`;
      msg += `📱 *WhatsApp:* ${data.whatsapp}\n`;
      if (data.email) msg += `✉️ *E-mail:* ${data.email}\n`;
      msg += `🎯 *Interesse(s):* ${data.servico}\n`;
      if (data.mensagem) msg += `💬 *Mensagem:* ${data.mensagem}\n`;

      const encodedMsg = encodeURIComponent(msg);
      window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}`, '_blank');
    });
  }

  if (btnEmail) {
    btnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data) return;

      const subject = encodeURIComponent(`Diagnóstico Estratégico - ${data.nome}`);
      let body = `Nome: ${data.nome}\n`;
      body += `WhatsApp: ${data.whatsapp}\n`;
      body += `E-mail: ${data.email || 'Não informado'}\n`;
      body += `Interesse(s): ${data.servico}\n`;
      body += `Mensagem: ${data.mensagem || 'Sem mensagem adicional'}\n`;

      const mailtoUrl = `mailto:agencianetwo@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }
});
