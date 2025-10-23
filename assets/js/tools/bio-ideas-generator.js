// Simple Bio Ideas Generator
function generateBios() {
  const input = document.getElementById('bioPrompt');
  const list = document.getElementById('bioList');
  const result = document.getElementById('bioResult');
  if (!input || !list || !result) return;
  const keywords = input.value.split(',').map(s=>s.trim()).filter(Boolean);
  if (keywords.length === 0) { result.textContent = 'Add at least one keyword'; return; }

  const templates = [
    "{k} • Living the {k} life",
    "{k} enthusiast | Sharing {k} tips",
    "Daily {k} inspirations ✨",
    "{k} creator | DM for collab",
    "Turning {k} into memories",
    "{k} + coffee = ❤️",
    "Exploring {k} around the world",
  ];

  list.innerHTML = '';
  const bios = [];
  for (let i = 0; i < Math.min(6, templates.length); i++) {
    const k = keywords[i % keywords.length];
    const text = templates[i].replace(/\{k\}/g, k);
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
    bios.push(text);
  }
  result.textContent = 'Generated ' + bios.length + ' bio ideas.';
  result.dataset.bios = JSON.stringify(bios);
}

function copyBios() {
  const result = document.getElementById('bioResult');
  if (!result || !result.dataset.bios) { result.textContent = 'Generate bios first'; return; }
  const bios = JSON.parse(result.dataset.bios);
  const text = bios.join('\n');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(()=> result.textContent = 'Copied ✅');
  } else {
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); result.textContent='Copied ✅'; } catch { result.textContent = 'Unable to copy'; } ta.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const gen = document.getElementById('generateBioBtn');
  const copy = document.getElementById('copyBioBtn');
  const input = document.getElementById('bioPrompt');
  if (gen) gen.addEventListener('click', generateBios);
  if (copy) copy.addEventListener('click', copyBios);
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') generateBios(); });
});
