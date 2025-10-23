document.addEventListener('DOMContentLoaded', () => {
    const resizeImageInput = document.getElementById('resizeImageInput');
    const resizeWidth = document.getElementById('resizeWidth');
    const resizeHeight = document.getElementById('resizeHeight');
    const preserveAspectRatio = document.getElementById('preserveAspectRatio');
    const resizeImageBtn = document.getElementById('resizeImageBtn');
    const downloadResizedImageBtn = document.getElementById('downloadResizedImageBtn');
    const resizeImageCanvas = document.getElementById('resizeImageCanvas'); // Assuming a canvas for output
    const resizeImageResult = document.getElementById('resizeImageResult');

    let originalImage = null; // Store the original image to handle multiple resizes

    // Event listener for image upload
    if (resizeImageInput) {
        resizeImageInput.addEventListener('change', (e) => {
            if (e.target.files.length === 0) {
                resizeImageResult.textContent = 'Please select an image.';
                return;
            }
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img; // Store the original image
                    resizeWidth.value = img.width;
                    resizeHeight.value = img.height;
                    resizeImageResult.textContent = `Image loaded: ${img.width}x${img.height}`;
                    if (downloadResizedImageBtn) downloadResizedImageBtn.style.display = 'none';
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Event listeners to update height/width if aspect ratio is preserved
    function updateDimensions() {
        if (!originalImage || !preserveAspectRatio.checked) return;

        const currentWidth = parseInt(resizeWidth.value);
        const currentHeight = parseInt(resizeHeight.value);

        const aspectRatio = originalImage.width / originalImage.height;

        if (document.activeElement === resizeWidth) {
            resizeHeight.value = Math.round(currentWidth / aspectRatio);
        } else if (document.activeElement === resizeHeight) {
            resizeWidth.value = Math.round(currentHeight * aspectRatio);
        }
    }

    if (resizeWidth) resizeWidth.addEventListener('input', updateDimensions);
    if (resizeHeight) resizeHeight.addEventListener('input', updateDimensions);
    if (preserveAspectRatio) preserveAspectRatio.addEventListener('change', updateDimensions);


    if (resizeImageBtn) {
        resizeImageBtn.addEventListener('click', () => {
            if (!originalImage) {
                resizeImageResult.textContent = 'Please upload an image first.';
                return;
            }

            const newWidth = parseInt(resizeWidth.value);
            const newHeight = parseInt(resizeHeight.value);

            if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
                resizeImageResult.textContent = 'Please enter valid width and height.';
                return;
            }

            const canvas = resizeImageCanvas;
            const ctx = canvas.getContext('2d');

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

            const resizedDataUrl = canvas.toDataURL('image/png'); // Using PNG for lossless if possible

            resizeImageResult.textContent = `Image resized to ${newWidth}x${newHeight}.`;
            if (downloadResizedImageBtn) {
                downloadResizedImageBtn.style.display = 'inline-block';
                downloadResizedImageBtn.href = resizedDataUrl;
                downloadResizedImageBtn.download = `resized_${resizeImageInput.files[0].name}`;
            }
        });
    }

    if (downloadResizedImageBtn) {
        downloadResizedImageBtn.style.display = 'none'; // Hide initially
    }
});