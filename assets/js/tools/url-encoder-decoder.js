document.addEventListener('DOMContentLoaded', () => {
    const urlText = document.getElementById('urlText');
    const encodeUrlBtn = document.getElementById('encodeUrlBtn');
    const decodeUrlBtn = document.getElementById('decodeUrlBtn');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const urlResult = document.getElementById('urlResult');

    if (encodeUrlBtn) {
        encodeUrlBtn.addEventListener('click', () => {
            const text = urlText.value;
            try {
                const encodedText = encodeURIComponent(text);
                urlResult.textContent = encodedText;
                copyUrlBtn.style.display = 'inline-block';
            } catch (e) {
                urlResult.textContent = 'Error encoding URL: ' + e.message;
                copyUrlBtn.style.display = 'none';
            }
        });
    }

    if (decodeUrlBtn) {
        decodeUrlBtn.addEventListener('click', () => {
            const text = urlText.value;
            try {
                const decodedText = decodeURIComponent(text);
                urlResult.textContent = decodedText;
                copyUrlBtn.style.display = 'inline-block';
            } catch (e) {
                urlResult.textContent = 'Error decoding URL: ' + e.message;
                copyUrlBtn.style.display = 'none';
            }
        });
    }

    if (copyUrlBtn) {
        copyUrlBtn.addEventListener('click', () => {
            if (urlResult && urlResult.textContent) {
                navigator.clipboard.writeText(urlResult.textContent)
                    .then(() => {
                        urlResult.textContent += ' (Copied!)';
                    })
                    .catch(err => {
                        console.error('Failed to copy URL:', err);
                        urlResult.textContent = 'Failed to copy.';
                    });
            }
        });
        copyUrlBtn.style.display = 'none'; // Hide initially
    }
});