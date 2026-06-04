/* ═══════════════════════════════════════════════════════════
   PAGES.JS — Lightbox galerie + helpers pages dédiées
   Chargé sur toutes les pages (avec main.js).
═══════════════════════════════════════════════════════════ */
'use strict';

// ─── LIGHTBOX (galerie d'images plein écran) ────────────────
(function initLightbox() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  // Construit l'overlay une seule fois
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <button class="lb-close" aria-label="Fermer">✕</button>
    <button class="lb-nav prev" aria-label="Précédent">‹</button>
    <img alt="" />
    <button class="lb-nav next" aria-label="Suivant">›</button>
    <div class="lb-cap"></div>`;
  document.body.appendChild(box);

  const imgEl = box.querySelector('img');
  const capEl = box.querySelector('.lb-cap');
  let index = 0;

  const sources = items.map(it => {
    const img = it.querySelector('img');
    return {
      src: it.getAttribute('data-full') || (img && img.src) || '',
      cap: it.getAttribute('data-caption') || (img && img.alt) || '',
    };
  });

  const render = () => {
    const s = sources[index];
    imgEl.src = s.src;
    imgEl.alt = s.cap;
    capEl.textContent = s.cap;
    capEl.style.display = s.cap ? 'block' : 'none';
  };
  const open = (i) => {
    index = i;
    render();
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    box.classList.remove('open');
    document.body.style.overflow = '';
  };
  const move = (dir) => {
    index = (index + dir + sources.length) % sources.length;
    render();
  };

  items.forEach((it, i) => it.addEventListener('click', () => open(i)));
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.prev').addEventListener('click', e => { e.stopPropagation(); move(-1); });
  box.querySelector('.next').addEventListener('click', e => { e.stopPropagation(); move(1); });
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
  });
})();


// ─── COPIER L'EMAIL AU CLIC ─────────────────────────────────
(function initCopyEmail() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', async (e) => {
      const value = el.getAttribute('data-copy');
      if (!navigator.clipboard) return; // laisse le mailto: agir
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(value);
        const original = el.textContent;
        el.textContent = '✓ Copié !';
        setTimeout(() => { el.textContent = original; }, 1600);
      } catch { /* fallback: ne fait rien, le lien reste cliquable */ }
    });
  });
})();
