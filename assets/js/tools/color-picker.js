// Simple Color Picker tool
function copyColorHex() {
  const input = document.getElementById('colorInput');
  const res = document.getElementById('colorResult');
  if (!input || !res) return;
  const hex = input.value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(hex).then(()=> { res.textContent = 'Copied ' + hex; });
  } else {
    const ta = document.createElement('textarea'); ta.value = hex; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); res.textContent = 'Copied ' + hex; } catch { res.textContent = 'Unable to copy'; } ta.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('copyColorBtn');
  const input = document.getElementById('colorInput');
  const res = document.getElementById('colorResult');
  if (btn) btn.addEventListener('click', copyColorHex);
  if (input) input.addEventListener('input', () => { if (res) res.textContent = 'Selected: ' + input.value; });
});
