// This tool would require a library like 'qrcode.js' or 'davidshimjs/qrcodejs'
// For now, it will be a placeholder.
// You would need to add: <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
// or similar to your index.html head.

document.addEventListener('DOMContentLoaded', () => {
    const qrTextInput = document.getElementById('qrTextInput');
    const generateQrBtn = document.getElementById('generateQrBtn');
    const downloadQrBtn = document.getElementById('downloadQrBtn');
    const qrCodeContainer = document.getElementById('qrCodeContainer'); // Assuming a div to hold the QR code
    const qrResult = document.getElementById('qrResult');

    if (generateQrBtn) {
        generateQrBtn.addEventListener('click', () => {
            const textToEncode = qrTextInput.value.trim();
            if (!textToEncode) {
                qrResult.textContent = 'Please enter text or a URL to generate a QR code.';
                return;
            }

            // Clear previous QR code
            if (qrCodeContainer) qrCodeContainer.innerHTML = '';

            // Check if QRCode library is available
            if (typeof QRCode !== 'undefined') {
                new QRCode(qrCodeContainer, {
                    text: textToEncode,
                    width: 128,
                    height: 128,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });

                qrResult.textContent = 'QR Code generated!';
                downloadQrBtn.style.display = 'inline-block';

                // To download, we need to extract the image from the container
                // QRCode.js puts an <img> or <canvas> inside the target div.
                // We'll look for a canvas first.
                setTimeout(() => { // Give QR code time to render
                    const canvas = qrCodeContainer.querySelector('canvas');
                    if (canvas) {
                        downloadQrBtn.href = canvas.toDataURL('image/png');
                        downloadQrBtn.download = 'qrcode.png';
                    } else { // Fallback for <img> if canvas isn't used by the library
                        const img = qrCodeContainer.querySelector('img');
                        if (img && img.src.startsWith('data:')) { // Check if it's a data URL
                            downloadQrBtn.href = img.src;
                            downloadQrBtn.download = 'qrcode.png';
                        } else {
                            downloadQrBtn.style.display = 'none';
                            qrResult.textContent = 'QR Code generated, but unable to prepare for download.';
                        }
                    }
                }, 100); // Small delay to ensure rendering
            } else {
                qrResult.textContent = 'Error: QRCode.js library not loaded. Please ensure it is linked in index.html.';
                console.error("QRCode.js library is required for QR Code generation.");
                downloadQrBtn.style.display = 'none';
            }
        });
    }

    if (downloadQrBtn) {
        downloadQrBtn.style.display = 'none'; // Hide initially
    }
});