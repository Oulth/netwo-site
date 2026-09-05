/**
 * NETWO COMUNICAÇÃO - GSAP & SCROLLTRIGGER PREMIUM ANIMATION ENGINE
 * 
 * Includes:
 * - GSAP & ScrollTrigger & ScrollToPlugin initialization
 * - Hero cinematic entrance & ambient breathing glow
 * - Hero scroll parallax
 * - Smooth scroll navigation with custom offset
 * - Bloco 1: staggered service cards entrance + 3D Tilt effect
 * - Bloco 1: smooth form entrance & highlight animation
 * - Bloco 2: staggered combo cards entrance + featured card pulse
 * - Interactive combo selection with fluid transition & form pulse
 * - Interactive tags / pills micro-animations
 * - Floating WhatsApp reveal on scroll
 * - Input mask & Form submission (WhatsApp + E-mail)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. REGISTRO DE PLUGINS GSAP
  // =========================================================================
  const hasGsap = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  const hasScrollTo = typeof ScrollToPlugin !== 'undefined';

  if (hasGsap) {
    if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (hasScrollTo) gsap.registerPlugin(ScrollToPlugin);
  }

  // =========================================================================
  // 2. HEADER FIXO DIRETO, SCROLLSPY & ROLAGEM SUAVE
  // =========================================================================
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sectionsToTrack = [
    { id: 'hero', link: document.querySelector('.nav-links a[href="#hero"]') },
    { id: 'bloco-1', link: document.querySelector('.nav-links a[href="#bloco-1"]') },
    { id: 'bloco-2', link: document.querySelector('.nav-links a[href="#bloco-2"]') },
    { id: 'bloco-3', link: document.querySelector('.nav-links a[href="#bloco-3"]') }
  ];

  // Menu Mobile Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  if (mobileMenuBtn && mobileNavOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNavOverlay.classList.toggle('open');
    });

    // Fecha o menu ao clicar em qualquer link da gaveta mobile
    document.querySelectorAll('.mobile-nav-link, .mobile-wa-cta-btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('open');
      });
    });

    // Fecha se o usuário clicar fora do header
    document.addEventListener('click', (e) => {
      if (header && !header.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('open');
      }
    });
  }

  // Cache de posições das seções para eliminar Reflow Forçado (Layout Thrashing) no scroll
  let cachedSwitchThreshold = 100;
  let cachedSectionRanges = [];

  const updateCachedPositions = () => {
    const bloco1 = document.getElementById('bloco-1');
    cachedSwitchThreshold = bloco1 ? Math.max(100, bloco1.offsetTop - 120) : (window.innerHeight * 0.7);

    cachedSectionRanges = sectionsToTrack.map(sec => {
      const el = document.getElementById(sec.id);
      if (!el) return null;
      const top = el.offsetTop - 120;
      const height = el.offsetHeight;
      return { id: sec.id, top, bottom: top + height, link: sec.link };
    }).filter(Boolean);
  };

  updateCachedPositions();
  window.addEventListener('resize', updateCachedPositions, { passive: true });
  window.addEventListener('load', updateCachedPositions, { passive: true });

  let lastActiveId = '';
  const updateHeaderAndScrollSpy = (scrollPos) => {
    // Efeito do Header
    if (header) {
      if (scrollPos >= cachedSwitchThreshold) {
        if (!header.classList.contains('scrolled')) header.classList.add('scrolled');
      } else {
        if (header.classList.contains('scrolled')) header.classList.remove('scrolled');
      }
    }

    // ScrollSpy: Identifica seção ativa
    let currentSectionId = 'hero';
    for (let i = 0; i < cachedSectionRanges.length; i++) {
      const sec = cachedSectionRanges[i];
      if (scrollPos >= sec.top && scrollPos < sec.bottom) {
        currentSectionId = sec.id;
        break;
      }
    }

    if (currentSectionId !== lastActiveId) {
      lastActiveId = currentSectionId;
      sectionsToTrack.forEach(sec => {
        if (sec.link) {
          if (sec.id === currentSectionId) {
            sec.link.classList.add('active');
          } else {
            sec.link.classList.remove('active');
          }
        }
      });
    }
  };

  // Botão flutuante WhatsApp - visibilidade vinculada ao RAF centralizado
  const floatingWa = document.querySelector('.whatsapp-floating-btn');
  if (floatingWa && hasGsap) {
    gsap.set(floatingWa, { scale: 0, opacity: 0 });
  }
  let isWaVisible = false;

  const updateFloatingWa = (scrollPos) => {
    if (!floatingWa || !hasGsap) return;
    if (scrollPos > 250 && !isWaVisible) {
      isWaVisible = true;
      gsap.to(floatingWa, {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: 'back.out(1.8)',
        force3D: true
      });
    } else if (scrollPos <= 250 && isWaVisible) {
      isWaVisible = false;
      gsap.to(floatingWa, {
        scale: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        force3D: true
      });
    }
  };

  // Loop Único de Rolagem Otimizado via requestAnimationFrame (60/120 FPS fluido)
  let isScrollTicking = false;
  const onWindowScroll = () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        updateHeaderAndScrollSpy(scrollPos);
        updateFloatingWa(scrollPos);
        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  };

  window.addEventListener('scroll', onWindowScroll, { passive: true });
  onWindowScroll(); // Executa imediatamente

  // Navegação com Rolagem Suave 100% Estável
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;

        let targetPosition = 0;
        if (targetId !== '#hero') {
          const rectTop = targetEl.getBoundingClientRect().top;
          const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
          targetPosition = Math.max(0, rectTop + currentY - headerOffset);
        }

        if (hasGsap && hasScrollTo) {
          gsap.to(window, {
            duration: 0.95,
            scrollTo: { y: targetPosition, autoKill: false },
            ease: 'power2.inOut',
            onComplete: updateHeaderAndScrollSpy
          });
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // =========================================================================
  // 3. ANIMAÇÕES DO HERO (LÂMPADA, SLOGAN & PARALLAX)
  // =========================================================================
  if (hasGsap) {
    // 3.1 Pulso Contínuo de Luz na Lâmpada (Hero Ambient Glow)
    const heroGlow = document.getElementById('heroAmbientGlow');
    if (heroGlow) {
      gsap.to(heroGlow, {
        opacity: 0.95,
        scale: 1.18,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // 3.2 Timeline de Entrada dos Textos e Botões do Hero
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.hero-slogan', {
        y: 45,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.25
      })
      .from('.hero-subtitle', {
        y: 25,
        opacity: 0,
        duration: 0.9
      }, '-=0.8')
      .from('.scroll-indicator', {
        y: 15,
        opacity: 0,
        duration: 0.8,
        clearProps: 'opacity,transform'
      }, '-=0.4');

    // 3.3 Efeito Parallax no Scroll do Hero (com ScrollTrigger)
    if (hasScrollTrigger) {
      gsap.to('#heroContainer', {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: -70,
        opacity: 0.15,
        force3D: true,
        ease: 'none'
      });

      const heroVideo = document.getElementById('heroBgVideo');
      if (heroVideo) {
        gsap.to(heroVideo, {
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
          },
          scale: 1.08,
          y: 40,
          force3D: true,
          ease: 'none'
        });
      }
    }
  }

  // =========================================================================
  // 4. ANIMAÇÕES DO BLOCO 1 (SOLUÇÕES + FORMULÁRIO)
  // =========================================================================
  if (hasGsap && hasScrollTrigger) {
    // 4.1 Revelação dos Títulos da Coluna de Soluções
    gsap.from(['#bloco-1 .section-tag', '#bloco-1 .services-title', '#bloco-1 .services-description'], {
      scrollTrigger: {
        trigger: '#bloco-1',
        start: 'top 82%'
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.85,
      ease: 'power3.out'
    });

    // 4.2 Efeito Cascata (Stagger) nos 4 Cards de Serviços
    const serviceCards = gsap.utils.toArray('.service-card');
    if (serviceCards.length > 0) {
      gsap.from(serviceCards, {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 85%'
        },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }

    // 4.3 Entrada Fluida do Formulário de Diagnóstico
    const formCard = document.querySelector('.lead-form-card');
    if (formCard) {
      gsap.from(formCard, {
        scrollTrigger: {
          trigger: '#diagnostico',
          start: 'top 85%'
        },
        x: 45,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }
  }

  // =========================================================================
  // 5. ANIMAÇÕES DO BLOCO 2 (COMBOS ESTRATÉGICOS)
  // =========================================================================
  if (hasGsap && hasScrollTrigger) {
    // 5.1 Revelação do Cabeçalho dos Combos
    gsap.from(['.combos-tag', '.combos-title', '.combos-description'], {
      scrollTrigger: {
        trigger: '#bloco-2',
        start: 'top 82%'
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.85,
      ease: 'power3.out'
    });

    // 5.1.1 Revelação da Metodologia two by two
    const methodSteps = gsap.utils.toArray('.methodology-step');
    if (methodSteps.length > 0) {
      gsap.from(methodSteps, {
        scrollTrigger: {
          trigger: '.methodology-wrapper',
          start: 'top 85%'
        },
        y: 25,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
      });
    }

    // 5.2 Efeito Cascata (Stagger) nos 3 Cards de Combos
    const comboCards = gsap.utils.toArray('.combo-card');
    if (comboCards.length > 0) {
      gsap.from(comboCards, {
        scrollTrigger: {
          trigger: '.combos-grid',
          start: 'top 85%'
        },
        y: 45,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }

    // 5.3 Pulso Sutil no Combo em Destaque (360°)
    // Otimizado: agora rodando via animação CSS por GPU (@keyframes featuredGlowPulse) sem travar a thread JS

    // 5.4 Revelação do Bloco 3: Cases de Sucesso & Marcas
    gsap.from(['.cases-tag', '.cases-title', '.cases-description'], {
      scrollTrigger: {
        trigger: '#bloco-3',
        start: 'top 82%'
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.85,
      ease: 'power3.out'
    });

    const caseCards = gsap.utils.toArray('.case-card');
    if (caseCards.length > 0) {
      gsap.from(caseCards, {
        scrollTrigger: {
          trigger: '.cases-grid',
          start: 'top 85%'
        },
        y: 45,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }
  }

  // =========================================================================
  // 6. EFEITO 3D TILT NOS CARDS (OTIMIZADO COM RAF & FORCE3D)
  // =========================================================================
  const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isPointerFine && hasGsap) {
    const tiltCards = document.querySelectorAll('.service-card, .combo-card, .case-card');
    tiltCards.forEach(card => {
      let tiltRaf = null;

      card.addEventListener('mousemove', (e) => {
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        tiltRaf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const cardX = e.clientX - rect.left;
          const cardY = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((cardY - centerY) / centerY) * -5;
          const rotateY = ((cardX - centerX) / centerX) * 5;

          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 800,
            scale: 1.015,
            duration: 0.35,
            force3D: true,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.6,
          force3D: true,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }, { passive: true });
    });
  }

  // =========================================================================
  // 8. MULTI-SELEÇÃO INTERATIVA DE INTERESSE (TAGS / PILLS)
  // =========================================================================
  const interestPills = document.querySelectorAll('.interest-pill');
  interestPills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      if (hasGsap) {
        gsap.fromTo(pill,
          { scale: 0.92 },
          { scale: 1, duration: 0.25, ease: 'back.out(2)' }
        );
      }
    });
  });

  // =========================================================================
  // 9. AÇÃO DOS COMBOS DO BLOCO 2 (ROLAGEM SUAVE + REALCE DO FORMULÁRIO)
  // =========================================================================
  function selectServicesForCombo(comboType) {
    // 1. Limpa seleção anterior
    interestPills.forEach(pill => pill.classList.remove('active'));

    // 2. Ativa os serviços específicos do combo selecionado
    const pillsToActivate = [];
    if (comboType === 'fundacao') {
      interestPills.forEach(pill => {
        const val = pill.getAttribute('data-value');
        if (val === 'Branding Estratégico' || val === 'Registro de Marcas') {
          pill.classList.add('active');
          pillsToActivate.push(pill);
        }
      });
    } else if (comboType === 'performance') {
      interestPills.forEach(pill => {
        const val = pill.getAttribute('data-value');
        if (val === 'Tráfego Pago' || val === 'Sites e Landing Pages') {
          pill.classList.add('active');
          pillsToActivate.push(pill);
        }
      });
    } else if (comboType === 'completo') {
      interestPills.forEach(pill => {
        pill.classList.add('active');
        pillsToActivate.push(pill);
      });
    }

    // Micro-animação nas pills ativadas
    if (hasGsap && pillsToActivate.length > 0) {
      gsap.fromTo(pillsToActivate,
        { scale: 0.85 },
        { scale: 1, stagger: 0.07, duration: 0.35, ease: 'back.out(2)' }
      );
    }

    // 3. Rolagem cinematográfica até o formulário de diagnóstico
    const formTarget = document.getElementById('diagnostico');
    if (formTarget) {
      const headerOffset = 75;

      if (hasGsap && hasScrollTo) {
        gsap.to(window, {
          duration: 1.1,
          scrollTo: { y: formTarget, offsetY: headerOffset },
          ease: 'power3.inOut'
        });
      } else {
        const elementPosition = formTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      // 4. Animação de Realce e Pulso Luminoso no Formulário
      const formCard = document.querySelector('.lead-form-card');
      if (formCard) {
        if (hasGsap) {
          gsap.timeline()
            .fromTo(formCard, 
              { scale: 0.98 }, 
              { scale: 1.02, duration: 0.3, ease: 'power2.out' }
            )
            .to(formCard, {
              borderColor: '#FFC814',
              boxShadow: '0 0 35px rgba(255, 200, 20, 0.7)',
              duration: 0.4
            })
            .to(formCard, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.inOut'
            })
            .to(formCard, {
              borderColor: '',
              boxShadow: '',
              delay: 1.4,
              duration: 0.8
            });
        } else {
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
  }

  // Atrelar botões dos combos
  document.querySelectorAll('[data-select-combo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const comboType = btn.getAttribute('data-select-combo');
      selectServicesForCombo(comboType);
    });
  });

  // =========================================================================
  // 10. MÁSCARA DE WHATSAPP / TELEFONE
  // =========================================================================
  const phoneInput = document.getElementById('whatsapp');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }

  // =========================================================================
  // 11. ENVIO ASSÍNCRONO DO FORMULÁRIO (GOOGLE APPS SCRIPT WEBHOOK)
  // =========================================================================
  // URL do Web App do Google Apps Script (gerada no Google Drive)
  const GOOGLE_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzNTQBlkOgU86qdF-J78teod0kbd5JsWwV6WOgy4HvqLX6HDagAZ8ZgNCZoEIi-Oivs/exec"; 
  const WHATSAPP_NUMBER = '5585987978486';

  const leadForm = document.getElementById('leadForm');
  const btnSubmitLead = document.getElementById('btnSubmitLead');
  const formStatus = document.getElementById('formStatus');

  function getSelectedInterests() {
    const activePills = document.querySelectorAll('.interest-pill.active');
    const selected = Array.from(activePills).map(p => p.getAttribute('data-value'));
    return selected.length > 0 ? selected.join(', ') : 'Consultoria Completa';
  }

  function showFormStatus(type, message) {
    if (!formStatus) return;
    formStatus.className = 'form-status-alert ' + type;
    formStatus.innerHTML = message;
    formStatus.style.display = 'block';
  }

  function hideFormStatus() {
    if (!formStatus) return;
    formStatus.style.display = 'none';
    formStatus.innerHTML = '';
  }

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideFormStatus();

      const nomeEl = document.getElementById('nome');
      const whatsappEl = document.getElementById('whatsapp');
      const emailEl = document.getElementById('email');
      const mensagemEl = document.getElementById('mensagem');

      const nome = nomeEl ? nomeEl.value.trim() : '';
      const whatsapp = whatsappEl ? whatsappEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const servicos = getSelectedInterests();
      const mensagem = mensagemEl ? mensagemEl.value.trim() : '';

      // Validações
      if (!nome || !whatsapp || !email) {
        showFormStatus('error', '⚠️ Por favor, preencha todos os campos obrigatórios (Nome, WhatsApp e E-mail).');
        if (!nome && nomeEl) nomeEl.focus();
        else if (!whatsapp && whatsappEl) whatsappEl.focus();
        else if (!email && emailEl) emailEl.focus();
        return;
      }

      const payload = { nome, whatsapp, email, servicos, mensagem };

      // Fallback amigável caso a URL do Webhook ainda não tenha sido configurada
      if (!GOOGLE_SCRIPT_WEBHOOK_URL || GOOGLE_SCRIPT_WEBHOOK_URL.trim() === '') {
        let msg = `*Solicitação de Diagnóstico - Netwo Comunicação*\n\n`;
        msg += `👤 *Nome:* ${nome}\n`;
        msg += `📱 *WhatsApp:* ${whatsapp}\n`;
        msg += `✉️ *E-mail:* ${email}\n`;
        msg += `🎯 *Interesse(s):* ${servicos}\n`;
        if (mensagem) msg += `💬 *Mensagem:* ${mensagem}\n`;

        const encodedMsg = encodeURIComponent(msg);
        window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}`, '_blank');

        showFormStatus('success', '✓ Sua solicitação foi aberta no WhatsApp da Netwo! <em>(Para receber também por e-mail, siga as instruções em COMO_CONFIGURAR_GOOGLE_APPS_SCRIPT.md)</em>.');
        return;
      }

      // Estado de Carregamento
      if (btnSubmitLead) {
        btnSubmitLead.classList.add('loading');
        btnSubmitLead.disabled = true;
        const btnText = btnSubmitLead.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Enviando solicitação...';
      }

      try {
        // Envio via POST para o Google Apps Script (modo no-cors para contornar redirecionamentos do Google)
        await fetch(GOOGLE_SCRIPT_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // Sucesso: Animação GSAP substituindo o formulário por completo
        const formHeader = document.querySelector('.lead-form-card .form-header');
        const formSuccessCard = document.getElementById('formSuccessCard');

        if (hasGsap && formSuccessCard && formHeader) {
          gsap.timeline()
            .to([formHeader, leadForm], {
              opacity: 0,
              y: -15,
              duration: 0.35,
              ease: 'power2.in',
              onComplete: () => {
                formHeader.style.display = 'none';
                leadForm.style.display = 'none';
                formSuccessCard.style.display = 'flex';
              }
            })
            .fromTo(formSuccessCard,
              { opacity: 0, scale: 0.94, y: 15 },
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            )
            .fromTo('.success-icon-wrapper',
              { scale: 0, rotation: -45 },
              { scale: 1, rotation: 0, duration: 0.65, ease: 'back.out(2)' },
              '-=0.3'
            )
            .fromTo(['.success-card-title', '.success-card-desc'],
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, stagger: 0.1, duration: 0.45, ease: 'power2.out' },
              '-=0.2'
            );
        } else if (formSuccessCard && formHeader) {
          formHeader.style.display = 'none';
          leadForm.style.display = 'none';
          formSuccessCard.style.display = 'flex';
        }

        leadForm.reset();

        // Restaura seleção padrão das tags de interesse
        const pills = document.querySelectorAll('.interest-pill');
        pills.forEach((p, idx) => {
          if (idx === 0) p.classList.add('active');
          else p.classList.remove('active');
        });

      } catch (err) {
        console.error('Erro ao enviar para Google Apps Script:', err);

        // Fallback para WhatsApp caso haja queda de rede
        let msg = `*Solicitação de Diagnóstico - Netwo Comunicação*\n\n`;
        msg += `👤 *Nome:* ${nome}\n`;
        msg += `📱 *WhatsApp:* ${whatsapp}\n`;
        msg += `✉️ *E-mail:* ${email}\n`;
        msg += `🎯 *Interesse(s):* ${servicos}\n`;
        if (mensagem) msg += `💬 *Mensagem:* ${mensagem}\n`;
        const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`;

        showFormStatus('error', `⚠️ Não foi possível conectar ao servidor. <a href="${waUrl}" target="_blank" style="color: #FFC814; font-weight: bold; text-decoration: underline;">Clique aqui para enviar via WhatsApp</a>.`);
      } finally {
        if (btnSubmitLead) {
          btnSubmitLead.classList.remove('loading');
          btnSubmitLead.disabled = false;
          const btnText = btnSubmitLead.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Conversar com a equipe da Netwo';
        }
      }
    });
  }

  // =========================================================================
  // 12. RODAPÉ: BOTÃO VOLTAR AO TOPO & REVELAÇÃO GSAP
  // =========================================================================
  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', (e) => {
      e.preventDefault();
      if (hasGsap && hasScrollTo) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: 0 },
          ease: 'power3.inOut'
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // Revelação fluida dos elementos do rodapé
  if (hasGsap && hasScrollTrigger) {
    gsap.from('.footer-col', {
      scrollTrigger: {
        trigger: '.footer-grid',
        start: 'top 88%'
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.85,
      ease: 'power3.out'
    });
  }
});
