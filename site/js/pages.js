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


// ─── TERMINAL INTERACTIF ────────────────────────────────────
(function initInteractiveTerminal() {
  const input = document.getElementById('termInput');
  const history = document.getElementById('termHistory');
  const body = document.getElementById('terminalBody');
  if (!input || !history || !body) return;

  const history_cmds = [];
  let hPos = -1;

  const print = (html, cls = 't-output') => {
    const line = document.createElement('div');
    line.className = 't-line ' + cls;
    line.innerHTML = html;
    history.appendChild(line);
  };
  const scroll = () => { body.scrollTop = body.scrollHeight; };

  const commands = {
    help() {
      print('Commandes disponibles :', 't-output');
      print(
        '<span class="t-accent">whoami</span>    qui suis-je\n' +
        '<span class="t-accent">skills</span>    mes compétences\n' +
        '<span class="t-accent">exp</span>       mes expériences\n' +
        '<span class="t-accent">certs</span>     mes certifications\n' +
        '<span class="t-accent">books</span>     mes livres\n' +
        '<span class="t-accent">contact</span>   me joindre\n' +
        '<span class="t-accent">cv</span>        télécharger mon CV\n' +
        '<span class="t-accent">clear</span>     nettoyer l\'écran',
        't-output'
      );
    },
    whoami() {
      print('Mathis Alvarez — Bachelor Cybersécurité &amp; Ethical Hacking', 't-ok');
      print('Alternant RSSI @ Spirica (Crédit Agricole Assurance) · EFREI Bordeaux 2023→2026.');
    },
    skills() {
      print('Cyber   : Ethical Hacking · SOC · SIEM Graylog · Vulnérabilités · Pentest', 't-output');
      print('Code    : Python · C · SQL · PowerShell · JavaScript · Lua', 't-output');
      print('Systèmes: Linux · Windows · DHCP/DNS · Virtualisation', 't-output');
    },
    exp() {
      print('→ <a href="experiences/spirica-rssi.html">Alternant RSSI — Spirica</a>');
      print('→ <a href="experiences/credit-agricole-secops.html">Stage SecOps — Crédit Agricole</a>');
      print('→ <a href="experiences/evogen-rp.html">Evogen RP — 13K+ membres</a>');
      print('→ <a href="experiences/the-hostel.html">The Hostel — Escape game</a>');
    },
    certs() {
      print('eJPT ............ en cours (55%)', 't-output');
      print('Security+ ....... visée 2026 (30%)', 't-output');
      print('CEH ............. planifiée (15%)', 't-output');
      print('TryHackMe ....... actif (70%)', 't-output');
    },
    books() {
      print('→ <a href="livres.html">Mes livres (thriller)</a>', 't-ok');
    },
    contact() {
      print('email   : <a href="mailto:mathis.alvarez@efrei.net">mathis.alvarez@efrei.net</a>');
      print('github  : <a href="https://github.com/mathisalvarez" target="_blank" rel="noopener">github.com/mathisalvarez</a>');
      print('lieu    : Bordeaux / Paris');
    },
    cv() {
      print('Téléchargement du CV… <a href="assets/CV-Mathis-Alvarez.pdf" download>CV-Mathis-Alvarez.pdf</a>', 't-ok');
      const a = document.createElement('a');
      a.href = 'assets/CV-Mathis-Alvarez.pdf';
      a.download = '';
      document.body.appendChild(a); a.click(); a.remove();
    },
    clear() { history.innerHTML = ''; },
    sudo() { print('Nice try. 😏 Tu n\'as pas les droits ici.', 't-err'); },
    ls() { print('about  skills  certs  experiences  livres  contact', 't-output'); },
  };

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    print('<span class="t-prompt">$</span> <span class="t-cmd">' + raw.replace(/</g, '&lt;') + '</span>', '');
    const fn = commands[cmd]
      || commands[{ projects: 'exp', experiences: 'exp', livres: 'books', mail: 'contact', clr: 'clear', h: 'help' }[cmd]];
    if (fn) fn();
    else print('commande introuvable : ' + cmd.replace(/</g, '&lt;') + ' — tape <span class="t-accent">help</span>', 't-err');
    scroll();
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = input.value;
      if (v.trim()) { history_cmds.push(v); hPos = history_cmds.length; }
      run(v);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      if (hPos > 0) { hPos--; input.value = history_cmds[hPos] || ''; e.preventDefault(); }
    } else if (e.key === 'ArrowDown') {
      if (hPos < history_cmds.length) { hPos++; input.value = history_cmds[hPos] || ''; }
    }
  });

  // Cliquer n'importe où dans le terminal donne le focus à l'input
  body.addEventListener('click', () => input.focus());
})();


// ─── BARRES DE CERTIFICATION (anim au scroll) ───────────────
(function initCertBars() {
  const cards = document.querySelectorAll('.cert-card[data-pct]');
  if (!cards.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target.querySelector('.cert-bar span');
      if (bar) bar.style.width = (entry.target.getAttribute('data-pct') || 0) + '%';
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  cards.forEach(c => obs.observe(c));
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
