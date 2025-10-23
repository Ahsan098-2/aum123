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
