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
document.addEventListener("DOMContentLoaded", function () {
  
  // ----------------------------------------------------
  // 1. BROKEN LINKS & 404 AUTOMATIC FIXER
  // ----------------------------------------------------
  // Sabhi navigation links ko scan karna aur kharab/empty links ko auto-fix karna
  const allLinks = document.querySelectorAll("a");
  
  allLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Empty ya kharab hash links ko disable karna
    if (!href || href === "#" || href.trim() === "" || href === "undefined") {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        alert("This tool/page is currently under maintenance.");
      });
      link.style.opacity = "0.6";
      link.style.cursor = "not-allowed";
    }

    // Un-indexed / Broken draft tools ko menu se visually clean rakhna
    if (href && (href.includes("coming-soon") || href.includes("draft"))) {
      link.style.display = "none"; // Broken draft links ko automatic hide karna
    }
  });

  // ----------------------------------------------------
  // 2. AUTOMATIC CSS THEME & DESIGN INJECTION
  // ----------------------------------------------------
  const themeStyle = document.createElement("style");
  themeStyle.textContent = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      background-color: #f8f9fa !important;
      color: #212529 !important;
      margin: 0;
      padding: 0;
    }

    /* Container Styling */
    .tool-container, main {
      max-width: 900px !important;
      margin: 30px auto !important;
      padding: 25px !important;
      background: #ffffff !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
      border: 1px solid #e9ecef !important;
    }

    /* Modern Blue Buttons */
    button, input[type="submit"], .btn {
      background: linear-gradient(135deg, #0d6efd, #0b5ed7) !important;
      color: #ffffff !important;
      border: none !important;
      padding: 12px 24px !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 2px 5px rgba(13, 110, 253, 0.2) !important;
    }

    button:hover, input[type="submit"]:hover, .btn:hover {
      background: linear-gradient(135deg, #0b5ed7, #0a58ca) !important;
      transform: translateY(-1px) !important;
    }

    /* Form Inputs */
    input[type="text"], input[type="number"], textarea, select {
      width: 100% !important;
      padding: 12px !important;
      border: 1px solid #ced4da !important;
      border-radius: 8px !important;
      font-size: 14px !important;
      margin-bottom: 15px !important;
      box-sizing: border-box !important;
      outline: none !important;
    }

    input:focus, textarea:focus, select:focus {
      border-color: #0d6efd !important;
      box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15) !important;
    }
  `;
  document.head.appendChild(themeStyle);

  // ----------------------------------------------------
  // 3. AUTO SEO, META TAGS & SCHEMA MARKUP INJECTOR
  // ----------------------------------------------------
  const pageTitle = document.title ? document.title.replace(/\|.*/, "").trim() : "Daily Online Utility Tool";
  const pageUrl = window.location.href;
  const baseKeywords = `${pageTitle}, free online ${pageTitle}, ${pageTitle} tool, web utility, daily toolkit, free tools`;

  let head = document.head;

  // Auto Meta Description
  if (!document.querySelector('meta[name="description"]')) {
    let metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    metaDesc.content = `Use our free online ${pageTitle} tool on DailyToolkit. Fast, secure, client-side, no registration required.`;
    head.appendChild(metaDesc);
  }

  // Auto Meta Keywords
  if (!document.querySelector('meta[name="keywords"]')) {
    let metaKey = document.createElement("meta");
    metaKey.name = "keywords";
    metaKey.content = baseKeywords;
    head.appendChild(metaKey);
  }

  // Google Schema Markup (JSON-LD)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": pageTitle,
    "url": pageUrl,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  let scriptSchema = document.createElement("script");
  scriptSchema.type = "application/ld+json";
  scriptSchema.text = JSON.stringify(schemaData);
  head.appendChild(scriptSchema);

  // ----------------------------------------------------
  // 4. AUTO HIGH-VALUE CONTENT & FAQ INJECTOR
  // ----------------------------------------------------
  const toolContainer = document.querySelector(".tool-container") || document.querySelector("main") || document.body;

  const contentHTML = `
    <article class="auto-seo-block" style="margin-top: 40px; padding: 25px; background: #ffffff; border-top: 2px solid #e9ecef; color: #333; font-family: sans-serif;">
      <h2 style="font-size: 22px; color: #0d6efd; margin-bottom: 15px;">Complete Guide to ${pageTitle}</h2>
      <p style="line-height: 1.6; font-size: 15px;">Welcome to <strong>${pageTitle}</strong> on DailyToolkit. Easily process your tasks directly inside your browser with complete privacy and zero speed lag.</p>

      <h3 style="font-size: 18px; margin-top: 20px; color: #212529;">How to Use ${pageTitle}?</h3>
      <ol style="margin-left: 20px; line-height: 1.7; font-size: 14px;">
        <li>Enter or upload your input data into the specified field above.</li>
        <li>Adjust any custom parameters or options according to your requirement.</li>
        <li>Click the primary process/generate button to view instant results.</li>
        <li>Copy or download your finalized output instantly.</li>
      </ol>

      <h3 style="font-size: 18px; margin-top: 20px; color: #212529;">Why Use Our Tool?</h3>
      <ul style="margin-left: 20px; line-height: 1.7; font-size: 14px;">
        <li><strong>Client-Side Security:</strong> Your files and text remain on your device and are never uploaded to remote servers.</li>
        <li><strong>100% Free Access:</strong> Unlimited usage without registration barriers or hidden costs.</li>
        <li><strong>Cross-Platform Support:</strong> Fully optimized for Mobile, Desktop, and Tablets.</li>
      </ul>

      <h3 style="font-size: 18px; margin-top: 20px; color: #212529;">Frequently Asked Questions (FAQs)</h3>
      <details style="margin-bottom: 10px; padding: 10px; border: 1px solid #dee2e6; border-radius: 6px; cursor: pointer;">
        <summary style="font-weight: 600; color: #0d6efd;">Is this ${pageTitle} free to use?</summary>
        <p style="margin-top: 8px; font-size: 14px;">Yes, all tools hosted on DailyToolkit are 100% free with no registration required.</p>
      </details>
      <details style="margin-bottom: 10px; padding: 10px; border: 1px solid #dee2e6; border-radius: 6px; cursor: pointer;">
        <summary style="font-weight: 600; color: #0d6efd;">Is my data private and secure?</summary>
        <p style="margin-top: 8px; font-size: 14px;">Yes, all operations run on client-side JavaScript inside your own web browser.</p>
      </details>
    </article>
  `;

  toolContainer.insertAdjacentHTML("beforeend", contentHTML);
});
