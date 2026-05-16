/**
 * COMPREI BARATO FC — script.js
 * JS mínimo, limpo e performático.
 * Sem dependências externas.
 */

/* ── CONFIGURAÇÃO CENTRALIZADA ──────────────────────────── */
const CONFIG = {
  /**
   * Substitua pelo link real do seu grupo/canal do WhatsApp.
   * Exemplo: 'https://chat.whatsapp.com/XXXXXXXXXXXXXXXX'
   */
  whatsappLink: 'https://chat.whatsapp.com/GYL3zJS5lajAcBqt53NKoQ',

  /**
   * Classe CSS dos botões CTA que devem abrir o WhatsApp.
   */
  ctaClass: '.js-whatsapp-cta',
};

/* ── INICIALIZAÇÃO ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppCTAs();
  initRevealAnimations();
  initFooterYear();
  initHoverHaptics();
});

/* ── LINK DO WHATSAPP ───────────────────────────────────── */
/**
 * Atribui o link do WhatsApp a todos os botões CTA
 * e rastreia os cliques no console (trocar por analytics real se necessário).
 */
function initWhatsAppCTAs() {
  const buttons = document.querySelectorAll(CONFIG.ctaClass);

  buttons.forEach((btn) => {
    // Define href dinâmico a partir da configuração central
    btn.setAttribute('href', CONFIG.whatsappLink);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');

    // Evento de clique para rastreamento / analytics
    btn.addEventListener('click', (e) => {
      console.log('[CTA] Clique no botão WhatsApp:', btn.textContent.trim());

      /**
       * Se quiser integrar com Google Analytics 4, descomente:
       * gtag('event', 'click_whatsapp_cta', { button_text: btn.textContent.trim() });
       *
       * Para Meta Pixel:
       * fbq('track', 'Lead');
       */
    });
  });
}

/* ── ANIMAÇÃO DE ENTRADA (REVEAL ON SCROLL) ─────────────── */
/**
 * Adiciona a classe 'reveal' aos elementos das seções
 * e usa IntersectionObserver para acionar 'visible' ao entrar na viewport.
 */
function initRevealAnimations() {
  // Elementos alvo para animar
  const targets = [
    '.benefit-card',
    '.cat-card',
    '.trust-item',
    '.hero-stats',
    '.section-header',
    '.cta-final-title',
    '.cta-final-text',
    '.btn-cta--final',
  ];

  const elements = document.querySelectorAll(targets.join(', '));

  // Adiciona classe reveal se o usuário não prefere menos movimento
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Sem animação para quem preferir
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  elements.forEach((el) => el.classList.add('reveal'));

  // Observer com delay escalonado para grids
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Delay baseado na posição do elemento dentro do pai
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const index = siblings.indexOf(entry.target);
          const delay = Math.min(index * 70, 350); // máximo 350ms de delay

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target); // anima apenas uma vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ── ANO NO FOOTER ──────────────────────────────────────── */
/**
 * Atualiza automaticamente o ano no rodapé.
 */
function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ── FEEDBACK HÁPTICO MOBILE (TOUCH) ───────────────────── */
/**
 * Adiciona um leve efeito visual de "press" nos botões CTA em dispositivos touch.
 */
function initHoverHaptics() {
  const ctaButtons = document.querySelectorAll('.btn-cta');

  ctaButtons.forEach((btn) => {
    btn.addEventListener('touchstart', () => {
      btn.style.transform = 'scale(0.97)';
    }, { passive: true });

    btn.addEventListener('touchend', () => {
      btn.style.transform = '';
    }, { passive: true });

    btn.addEventListener('touchcancel', () => {
      btn.style.transform = '';
    }, { passive: true });
  });
}

/* ── SCROLL SUAVE (FALLBACK) ────────────────────────────── */
/**
 * Scroll suave para links internos (#âncora).
 * Reforço além do scroll-behavior: smooth do CSS.
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
