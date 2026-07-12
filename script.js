// Tool modal open/close logic
document.addEventListener('DOMContentLoaded', () => {
  const openButtons = document.querySelectorAll('.open-tool-btn');
  const backdrop = document.getElementById('toolModalBackdrop');
  const content = document.getElementById('toolModalContent');
  const closeBtn = document.getElementById('closeToolModal');

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const toolId = btn.getAttribute('data-tool');
      const fullTool = document.getElementById(`tool-full-${toolId}`);
      if (fullTool) {
        content.innerHTML = fullTool.innerHTML;
        backdrop.style.display = 'flex';
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    backdrop.style.display = 'none';
    content.innerHTML = '';
  });

  // Close on backdrop click
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) {
      backdrop.style.display = 'none';
      content.innerHTML = '';
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   EYE-CATCHING ENHANCEMENTS — v2.1
   Custom cursor · card tilt · ripple · particles · counters · reveal
   All functions are guarded — safe to include on every page even
   if a given element (hero, stat-box, etc.) doesn't exist there.
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── 1. Custom liquid cursor (desktop only) ── */
  function initCustomCursor() {
    if (!isFinePointer || prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    // Re-bind hover targets whenever new content loads (e.g. modal opens)
    function bindHoverTargets() {
      document.querySelectorAll('a, button, .tool-card, .cat-tab, input, .hamburger-menu').forEach(el => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';
        el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
      });
    }
    bindHoverTargets();
    new MutationObserver(bindHoverTargets).observe(document.body, { childList: true, subtree: true });
  }

  /* ── 2. Tool card 3D tilt (desktop only) ── */
  function initCardTilt() {
    if (!isFinePointer || prefersReducedMotion) return;

    document.querySelectorAll('.tool-card').forEach(card => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = 'true';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
        card.style.transition = 'transform 0.05s linear';
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        card.style.transform = '';
      });
    });
  }

  /* ── 3. Ripple effect on buttons / tabs ── */
  function initRipple() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .cat-tab').forEach(el => {
      if (el.dataset.rippleBound) return;
      el.dataset.rippleBound = 'true';

      el.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* ── 4. Floating gold particles in hero section ── */
  function initHeroParticles() {
    const hero = document.querySelector('.hero-section');
    if (!hero || prefersReducedMotion) return;

    const container = document.createElement('div');
    container.className = 'hero-particles';
    hero.prepend(container);

    const count = window.innerWidth < 768 ? 8 : 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'hero-particle';
      const size = 3 + Math.random() * 5;
      p.style.width = p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      const duration = 10 + Math.random() * 10;
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = (Math.random() * duration * -1) + 's';
      container.appendChild(p);
    }
  }

  /* ── 5. Animated number counters (stat boxes) ── */
  function initCounters() {
    const counterEls = document.querySelectorAll('.stat-box strong, [data-counter]');
    if (!counterEls.length) return;

    function parseValue(text) {
      const match = text.match(/([\d,]+(?:\.\d+)?)/);
      if (!match) return null;
      return {
        num: parseFloat(match[1].replace(/,/g, '')),
        prefix: text.slice(0, match.index),
        suffix: text.slice(match.index + match[1].length),
        isInt: !match[1].includes('.')
      };
    }

    function animate(el) {
      const parsed = parseValue(el.textContent);
      if (!parsed) return;
      const { num, prefix, suffix, isInt } = parsed;

      if (prefersReducedMotion) {
        el.textContent = prefix + num + suffix;
        return;
      }

      el.classList.add('counting');
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = num * eased;
        el.textContent = prefix + (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + num + suffix;
          setTimeout(() => el.classList.remove('counting'), 1400);
        }
      }
      requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => obs.observe(el));
  }

  /* ── 6. Scroll reveal (safe to run alongside any existing observer) ── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal:not(.visible), .stagger-children > *:not(.visible)');
    if (!revealEls.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => obs.observe(el));
  }

  initCustomCursor();
  initCardTilt();
  initRipple();
  initHeroParticles();
  initCounters();
  initScrollReveal();
});
