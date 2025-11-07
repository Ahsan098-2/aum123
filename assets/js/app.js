// App script: load tool HTML files from /tools/ into the modal
document.addEventListener('DOMContentLoaded', () => {
  const modalBackdrop = document.getElementById('toolModalBackdrop');
  const modalContent = document.getElementById('toolModalContent');
  const closeBtn = document.getElementById('closeToolModal');

  function openModalWithHtml(html) {
    if (!modalBackdrop || !modalContent) return;
    modalContent.innerHTML = html;
    modalBackdrop.classList.add('active');
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    // clear content to free memory
    if (modalContent) modalContent.innerHTML = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Attach click handlers to tool cards that link to tools/*.html
  document.querySelectorAll('.tool-card').forEach(card => {
    // the card may be an <a> element or contain an <a>
    const anchor = card.closest('a') || card.querySelector('a') || card;
    const href = (anchor && anchor.getAttribute) ? anchor.getAttribute('href') : null;
    if (!href) return;

    card.addEventListener('click', (e) => {
      // If user holds ctrl/meta/middle-click, allow default behavior (open in new tab)
      if (e.ctrlKey || e.metaKey || e.button === 1) return;
      e.preventDefault();

      // Try to fetch the HTML from the href
      fetch(href, { cache: 'no-store' })
        .then(resp => {
          if (!resp.ok) throw new Error('Network response was not ok');
          return resp.text();
        })
        .then(html => {
          openModalWithHtml(html);
        })
        .catch(err => {
          console.error('Failed to load tool HTML:', err);
          // fallback: navigate to the tool page
          window.location.href = href;
        });
    });
  });

  // Optional: if the page was loaded with a #tool=slug hash, open that tool
  const hash = window.location.hash;
  if (hash && hash.startsWith('#tool=')) {
    const toolPath = hash.replace('#tool=', 'tools/') + '.html';
    fetch(toolPath).then(r => r.text()).then(html => openModalWithHtml(html)).catch(()=>{});
  }
});
