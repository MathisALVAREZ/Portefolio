/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — JavaScript principal
   Fonctionnalités : navbar scroll, reveal, burger menu, formulaire
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── NAVBAR SCROLL ──────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // état initial
})();


// ─── SMOOTH SCROLL ─────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // hauteur navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ─── REVEAL ON SCROLL (Intersection Observer) ─────────────
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // une seule fois
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


// ─── BURGER MENU MOBILE ─────────────────────────────────────
(function initBurger() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  let open = false;

  const toggleMenu = () => {
    open = !open;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';

    // Animate burger spans
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  };

  burger.addEventListener('click', toggleMenu);

  // Fermer en cliquant sur un lien
  menu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      if (open) toggleMenu();
    });
  });

  // Fermer avec Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) toggleMenu();
  });
})();


// ─── TERMINAL TYPING EFFECT ─────────────────────────────────
(function initTerminal() {
  // Efface puis retape le curseur — effet cosmétique déjà présent en CSS
  // On peut ajouter un typage progressif des lignes si souhaité
  const terminalLines = document.querySelectorAll('.t-line');
  terminalLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transition = `opacity 0.4s ease ${i * 0.15 + 0.5}s`;
    requestAnimationFrame(() => {
      setTimeout(() => { line.style.opacity = '1'; }, i * 150 + 500);
    });
  });
})();


// ─── CONTACT FORM ───────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  // Validation basique
  const validate = (data) => {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) errors.push('Nom trop court.');
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Email invalide.');
    if (!data.subject || data.subject.trim().length < 3) errors.push('Sujet requis.');
    if (!data.message || data.message.trim().length < 10) errors.push('Message trop court.');
    return errors;
  };

  const showStatus = (message, type) => {
    status.textContent = message;
    status.className = `form-status ${type}`;
    status.hidden = false;
    setTimeout(() => { status.hidden = true; }, 6000);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    const errors = validate(data);
    if (errors.length) {
      showStatus(errors.join(' '), 'error');
      return;
    }

    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').hidden = true;
    submitBtn.querySelector('.btn-loading').hidden = false;

    try {
      /*
       * INTEGRATION BACKEND :
       * Remplacez l'URL ci-dessous par votre endpoint (ex: PHP mailer,
       * script Python Flask, ou service comme Formspree/EmailJS).
       *
       * Exemple avec Formspree :
       *   const res = await fetch('https://formspree.io/f/VOTRE_ID', { ... });
       *
       * Exemple avec votre propre backend Flask :
       *   const res = await fetch('/api/contact', { ... });
       */

      // SIMULATION : remplacez par un vrai fetch en production
      await new Promise(r => setTimeout(r, 1500)); // simule latence réseau
      const success = true; // remplacez par la vraie réponse

      if (success) {
        showStatus('✓ Message envoyé ! Je vous répondrai sous 24h.', 'success');
        form.reset();
      } else {
        showStatus('Erreur lors de l\'envoi. Réessayez ou contactez-moi par email.', 'error');
      }
    } catch (err) {
      console.error('Erreur formulaire:', err);
      showStatus('Erreur réseau. Contactez-moi directement par email.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').hidden = false;
      submitBtn.querySelector('.btn-loading').hidden = true;
    }
  });
})();


// ─── ACTIVE NAV LINK (scroll spy) ──────────────────────────
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--accent)'
              : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();


// ─── YEAR AUTO-UPDATE IN FOOTER ─────────────────────────────
(function updateYear() {
  const el = document.querySelector('.footer-copy p');
  if (!el) return;
  el.textContent = el.textContent.replace('2025', new Date().getFullYear());
})();
