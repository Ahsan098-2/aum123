// Simple barcode generator (Code39-like) using canvas
// NOTE: This is a simplified renderer and may not follow full barcode specs.
function generateBarcode() {
  const textInput = document.getElementById('barcodeText');
  const canvas = document.getElementById('barcodeCanvas');
  const result = document.getElementById('barcodeResult');
  if (!textInput || !canvas || !result) return;
  const text = (textInput.value || '').toUpperCase().trim();
  if (!text) { result.textContent = 'Enter text to generate barcode'; return; }

  // Basic Code39 character set mapping (simplified widths)
  const patterns = {
    '0':'101001101101', '1':'110100101011', '2':'101100101011', '3':'110110010101',
    '4':'101001101011', '5':'110100110101', '6':'101100110101', '7':'101001011011',
    '8':'110100101101', '9':'101100101101', 'A':'110101001011', 'B':'101101001011',
    'C':'110110100101', 'D':'101011001011', 'E':'110101100101', 'F':'101101100101',
    'G':'101010011011', 'H':'110101001101', 'I':'101101001101', 'J':'101011001101',
    'K':'110101010011', 'L':'101101010011', 'M':'110110101001', 'N':'101011010011',
    'O':'110101101001', 'P':'101101101001', 'Q':'101010110011', 'R':'110101011001',
    'S':'101101011001', 'T':'101011011001', 'U':'110010101011', 'V':'100110101011',
    'W':'110011010101', 'X':'100101101011', 'Y':'110010110101', 'Z':'100110110101',
    '-':'100101011011', '.':'110010101101', ' ':'100110101101', '$':'100100100101',
    '/':'100100101001', '+':'100101001001', '%':'101001001001', '*':'100101101101'
  };

  const startStop = patterns['*'];
  let full = startStop + '0'; // inter-character narrow space (0)
  for (let ch of text) {
    if (!patterns[ch]) { result.textContent = 'Unsupported character: ' + ch; return; }
    full += patterns[ch] + '0';
  }
  full += startStop;

  // draw on canvas
  const ctx = canvas.getContext('2d');
  const w = full.length * 2; // bar width multiplier
  const h = canvas.height;
  canvas.width = Math.max(w, 300);
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#000';
  let x = 0;
  for (let i = 0; i < full.length; i++) {
    const bit = full[i];
    const bw = (bit === '1') ? 3 : 1; // wide or narrow
    if (i % 2 === 0) {
      // bar
      ctx.fillRect(x, 0, bw, h - 20);
    }
    x += bw;
  }
  // draw text
  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height - 4);
  result.textContent = 'Barcode generated.';
  result.dataset.generated = '1';
  return true;
}

function downloadBarcode() {
  const canvas = document.getElementById('barcodeCanvas');
  const result = document.getElementById('barcodeResult');
  if (!canvas || !result) return;
  if (!result.dataset.generated) { result.textContent = 'Generate barcode first.'; return; }
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url; a.download = 'barcode.png'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });
}

// wire buttons if DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const gen = document.getElementById('generateBarcodeBtn');
  const down = document.getElementById('downloadBarcodeBtn');
  const input = document.getElementById('barcodeText');
  if (gen) gen.addEventListener('click', generateBarcode);
  if (down) down.addEventListener('click', downloadBarcode);
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') generateBarcode(); });
});
