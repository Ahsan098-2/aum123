document.addEventListener('DOMContentLoaded', () => {
    const compressImageInput = document.getElementById('compressImageInput');
    const compressImageBtn = document.getElementById('compressImageBtn');
    const downloadCompressImageBtn = document.getElementById('downloadCompressImageBtn');
    const imageQuality = document.getElementById('imageQuality');
    const compressImageResult = document.getElementById('compressImageResult');
    const compressImageCanvas = document.getElementById('compressImageCanvas'); // Assuming a canvas for preview

    if (compressImageBtn) {
        compressImageBtn.addEventListener('click', () => {
            if (!compressImageInput || compressImageInput.files.length === 0) {
                compressImageResult.textContent = 'Please select an image to compress.';
                return;
            }

            const file = compressImageInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = compressImageCanvas;
                    const ctx = canvas.getContext('2d');

                    // Set canvas dimensions to image dimensions
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Get image data URL with specified quality
                    const quality = parseFloat(imageQuality.value) / 100; // Convert range (1-100) to (0.01-1)
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

                    // Display result (optional, can also just enable download)
                    compressImageResult.textContent = `Image compressed! Original size: ${(file.size / 1024).toFixed(2)} KB.`;

                    // Enable download button and set its href
                    if (downloadCompressImageBtn) {
                        downloadCompressImageBtn.style.display = 'inline-block'; // Show button
                        downloadCompressImageBtn.href = compressedDataUrl;
                        downloadCompressImageBtn.download = `compressed_${file.name}`;
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    if (downloadCompressImageBtn) {
        downloadCompressImageBtn.style.display = 'none'; // Hide download button initially
    }
});