// Background Remover (client-side color-based)
// Note: This is a simple color-based background remover. For complex images
// with detailed hair/background separation, integrate a 3rd-party API (remove.bg,
// Adobe, or a custom ML endpoint). See comments below where to plug an API call.

function loadImageToCanvas(file, canvas, cb, options = {}) {
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    // scale image to a safe maximum dimension while preserving aspect ratio
    const maxDim = options.maxDim || 1200; // max width/height in px
    let w = img.width;
    let h = img.height;
    const scale = Math.min(maxDim / w, maxDim / h, 1);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    if (cb) cb(null, img);
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    if (cb) cb(new Error('Failed to load image'));
  };
  img.src = url;
}

function sampleBackgroundColor(ctx, w, h) {
  // sample multiple pixels along the border and compute median color to be robust
  const samples = [];
  const step = Math.max(1, Math.floor(Math.min(w, h) / 30));
  for (let x = 0; x < w; x += step) {
    samples.push(ctx.getImageData(x, 0, 1, 1).data);
    samples.push(ctx.getImageData(x, h - 1, 1, 1).data);
  }
  for (let y = 0; y < h; y += step) {
    samples.push(ctx.getImageData(0, y, 1, 1).data);
    samples.push(ctx.getImageData(w - 1, y, 1, 1).data);
  }

  const rs = samples.map(d => d[0]).sort((a, b) => a - b);
  const gs = samples.map(d => d[1]).sort((a, b) => a - b);
  const bs = samples.map(d => d[2]).sort((a, b) => a - b);
  const mid = Math.floor(samples.length / 2);
  return { r: rs[mid] || rs[0], g: gs[mid] || gs[0], b: bs[mid] || bs[0] };
}

function colorDistance(a, b) {
  // Euclidean distance in RGB space
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function removeBackground(canvas, options = {}) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const bgColor = sampleBackgroundColor(ctx, w, h);
  const threshold = options.threshold || 60; // tweak for sensitivity

  // first pass: mark transparent if within threshold
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const pixel = { r: data[i], g: data[i + 1], b: data[i + 2] };
      const dist = colorDistance(pixel, bgColor);
      if (dist < threshold) mask[y * w + x] = 1; // background
    }
  }

  // optional: simple morphological erosion to remove small foreground holes
  const erode = options.erode || 1;
  if (erode > 0) {
    for (let e = 0; e < erode; e++) {
      const newMask = new Uint8Array(w * h);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          // if all neighbors are background, keep it background
          let allBg = true;
          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              if (!mask[(y + oy) * w + (x + ox)]) { allBg = false; break; }
            }
            if (!allBg) break;
          }
          newMask[idx] = allBg ? 1 : 0;
        }
      }
      mask.set(newMask);
    }
  }

  // apply mask to alpha channel
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (mask[y * w + x]) {
        data[i + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function downloadCanvasAsPng(canvas, filename = 'transparent.png') {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

document.addEventListener('DOMContentLoaded', () => {
  const upload = document.getElementById('bgUpload');
  const removeBtn = document.getElementById('removeBgBtn');
  const downloadBtn = document.getElementById('downloadBgBtn');
  const canvas = document.getElementById('bgCanvas');
  const result = document.getElementById('bgResult');
  let lastFile = null;

  if (!upload || !removeBtn || !downloadBtn || !canvas || !result) return;

  upload.addEventListener('change', () => {
    const file = upload.files && upload.files[0];
    if (!file) {
      result.textContent = 'No file selected.';
      return;
    }
    lastFile = file;
    result.textContent = 'Previewing...';
    loadImageToCanvas(file, canvas, (err) => {
      if (err) {
        result.textContent = 'Failed to load image.';
      } else {
        result.textContent = 'Image loaded. Adjust Sensitivity and click Remove Background.';
      }
    }, { maxDim: 1200 });
  });

  removeBtn.addEventListener('click', () => {
    if (!lastFile) {
      result.textContent = 'Please upload an image first.';
      return;
    }
    result.textContent = 'Removing background...';
    // small timeout so UI updates before heavy computation on large images
    setTimeout(() => {
      // run removal
      try {
        const thresholdInput = document.getElementById('bgThreshold');
        const threshold = thresholdInput ? parseInt(thresholdInput.value, 10) : 60;
        removeBackground(canvas, { threshold, erode: 1 });
        result.textContent = 'Background removed. Click Download to save PNG with transparency.';
      } catch (e) {
        result.textContent = 'Failed to remove background.';
        console.error(e);
      }
    }, 50);
  });

  downloadBtn.addEventListener('click', () => {
    downloadCanvasAsPng(canvas, 'transparent.png');
  });

  // Optional: support paste (Ctrl+V) to paste an image from clipboard
  document.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.type.indexOf('image') !== -1) {
        const file = it.getAsFile();
        if (file) {
          upload.files = new DataTransfer().files; // noop for older browsers
          lastFile = file;
          result.textContent = 'Pasted image. Previewing...';
          loadImageToCanvas(file, canvas, () => (result.textContent = 'Image loaded. Click Remove Background.'));
        }
      }
    }
  });
});

/*
  Notes: For production-quality background removal (hair, semi-transparent edges),
  integrate an external API. Example flow:

  1) Upload the file to your backend.
  2) Backend calls a 3rd-party removal API (remove.bg, Adobe, or an ML model).
  3) Return the processed PNG to client for download/preview.

  This client-side algorithm works best on images with a fairly uniform background color.
*/
