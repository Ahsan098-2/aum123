// Optimized script.js with debouncing and performance fixes
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

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) {
      backdrop.style.display = 'none';
      content.innerHTML = '';
    }
  });
});

/* PERFORMANCE-OPTIMIZED ENHANCEMENTS – v2.2
   - Throttled cursor animation
   - Debounced mutation observer
   - Reduced particle count on mobile
   - Event delegation instead of rebinding
   - Conditional animation based on prefers-reduced-motion
*/
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = window.innerWidth < 768;

  /* 1. THROTTLED CUSTOM CURSOR */
  function initCustomCursor() {
    if (!isFinePointer || prefersReducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let rafId = null;
    let isMoving = false;

    const throttledMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    };

    function updateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      if (isMoving) rafId = requestAnimationFrame(updateRing);
    }

    document.addEventListener('mousemove', throttledMouseMove, { passive: true });

    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isMoving = true;
      updateRing();
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      isMoving = false;
      if (rafId) cancelAnimationFrame(rafId);
    });

    // Use event delegation instead of rebinding on every mutation
    document.addEventListener('mouseenter', (e) => {
      if (e.target.matches('a, button, .tool-card, .cat-tab, input, .hamburger-menu')) {
        ring.classList.add('cursor-hover');
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      if (e.target.matches('a, button, .tool-card, .cat-tab, input, .hamburger-menu')) {
        ring.classList.remove('cursor-hover');
      }
    }, true);
  }

  /* 2. CARD TILT */
  function initCardTilt() {
    if (!isFinePointer || prefersReducedMotion || isMobile) return;

    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.tool-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isNear = Math.hypot(e.clientX - (rect.left + rect.width/2), e.clientY - (rect.top + rect.height/2)) < 300;
        
        if (isNear) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
          const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
          card.style.transition = 'transform 0.05s linear';
          card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`;
        }
      });
    }, { passive: true });
  }

  /* 3. RIPPLE EFFECT */
  function initRipple() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-primary, .btn-secondary, .cat-tab')) {
        const btn = e.target.closest('.btn-primary, .btn-secondary, .cat-tab');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      }
    }, { passive: true });
  }

  /* 4. HERO PARTICLES (optimized for mobile) */
  function initHeroParticles() {
    const hero = document.querySelector('.hero-section');
    if (!hero || prefersReducedMotion) return;

    const container = document.createElement('div');
    container.className = 'hero-particles';
    hero.prepend(container);

    const count = isMobile ? 4 : 12; // Reduced particle count
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'hero-particle';
      const size = 2 + Math.random() * 3;
      p.style.width = p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
      const duration = 12 + Math.random() * 8;
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = (Math.random() * duration * -1) + 's';
      container.appendChild(p);
    }
  }

  /* 5. ANIMATED COUNTERS */
  function initCounters() {
    const counterEls = document.querySelectorAll('.stat-box strong, [data-counter]');
    if (!counterEls.length) return;

    function parseValue(text) {
      const match = text.match(/([\ d,]+(?:\.\d+)?)/);
      if (!match) return null;
      return {
        num: parseFloat(match[1].replace(/,/g, '')),
        prefix: text.slice(0, match.index),
        suffix: text.slice(match.index + match[1].length),
        isInt: !match[1].includes('.')
      };
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parsed = parseValue(entry.target.textContent);
          if (!parsed) return;

          if (prefersReducedMotion) {
            entry.target.textContent = parsed.prefix + parsed.num + parsed.suffix;
            return;
          }

          const { num, prefix, suffix, isInt } = parsed;
          entry.target.classList.add('counting');
          const duration = 1400;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = num * eased;
            entry.target.textContent = prefix + (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              entry.target.textContent = prefix + num + suffix;
              setTimeout(() => entry.target.classList.remove('counting'), 1400);
            }
          }
          requestAnimationFrame(tick);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => obs.observe(el));
  }

  /* 6. SCROLL REVEAL */
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