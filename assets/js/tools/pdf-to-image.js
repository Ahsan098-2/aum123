// This tool would require a library like 'pdf.js'
// For now, it will be a placeholder.
// You would need to add:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
// <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';</script>
// to your index.html head.

document.addEventListener('DOMContentLoaded', () => {
    const pdfToImageInput = document.getElementById('pdfToImageInput');
    const convertPdfToImageBtn = document.getElementById('convertPdfToImageBtn');
    const downloadImagesFromPdfBtn = document.getElementById('downloadImagesFromPdfBtn'); // This will likely be a zip or multiple links
    const pdfToImageResult = document.getElementById('pdfToImageResult');
    const pdfToImagePreviewContainer = document.getElementById('pdfToImagePreviewContainer'); // Assuming a div to show image previews

    let selectedPdfFile = null;

    if (pdfToImageInput) {
        pdfToImageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0 && e.target.files[0].type === 'application/pdf') {
                selectedPdfFile = e.target.files[0];
                pdfToImageResult.textContent = `"${selectedPdfFile.name}" selected.`;
                convertPdfToImageBtn.style.display = 'inline-block';
                downloadImagesFromPdfBtn.style.display = 'none';
                if (pdfToImagePreviewContainer) pdfToImagePreviewContainer.innerHTML = ''; // Clear previews
            } else {
                selectedPdfFile = null;
                pdfToImageResult.textContent = 'Please select a PDF file.';
                convertPdfToImageBtn.style.display = 'none';
            }
        });
    }

    if (convertPdfToImageBtn) {
        convertPdfToImageBtn.addEventListener('click', async () => {
            if (!selectedPdfFile) {
                pdfToImageResult.textContent = 'Please select a PDF file first.';
                return;
            }

            pdfToImageResult.textContent = 'Converting PDF pages to images...';
            if (pdfToImagePreviewContainer) pdfToImagePreviewContainer.innerHTML = '';

            if (typeof pdfjsLib !== 'undefined' && pdfjsLib.getDocument) {
                try {
                    const fileReader = new FileReader();
                    fileReader.onload = async () => {
                        const typedarray = new Uint8Array(fileReader.result);
                        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                        const numPages = pdf.numPages;
                        const imageLinks = [];

                        for (let i = 1; i <= numPages; i++) {
                            const page = await pdf.getPage(i);
                            const viewport = page.getViewport({ scale: 2 }); // Scale up for better quality
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            await page.render({
                                canvasContext: context,
                                viewport: viewport,
                            }).promise;

                            const imgData = canvas.toDataURL('image/png'); // Convert to PNG
                            imageLinks.push({ src: imgData, filename: `page_${i}.png` });

                            // Add preview to the container
                            if (pdfToImagePreviewContainer) {
                                const imgEl = document.createElement('img');
                                imgEl.src = imgData;
                                imgEl.alt = `PDF Page ${i}`;
                                imgEl.style.maxWidth = '100px';
                                imgEl.style.margin = '5px';
                                imgEl.style.border = '1px solid var(--glass-border)';
                                pdfToImagePreviewContainer.appendChild(imgEl);
                            }
                        }

                        // Create a zip file for multiple images or provide individual links
                        // For simplicity, we'll just show multiple download links for now.
                        // For a real app, consider using JSZip library.
                        let downloadHtml = 'Conversion complete! Download images:<br>';
                        imageLinks.forEach((img, index) => {
                            downloadHtml += `<a href="${img.src}" download="${img.filename}" class="btn-secondary" style="margin: 5px; display: inline-block;">Page ${index + 1}</a>`;
                        });
                        pdfToImageResult.innerHTML = downloadHtml;

                        downloadImagesFromPdfBtn.style.display = 'none'; // We're using individual links
                        // If you want a single zip download, you'd integrate JSZip here.
                    };
                    fileReader.readAsArrayBuffer(selectedPdfFile);

                } catch (error) {
                    console.error('Error converting PDF to images:', error);
                    pdfToImageResult.textContent = `Error converting PDF: ${error.message}`;
                    downloadImagesFromPdfBtn.style.display = 'none';
                }
            } else {
                pdfToImageResult.textContent = 'Error: PDF.js library not loaded. Please ensure it is linked in index.html.';
                console.error("PDF.js library is required for PDF to Image conversion.");
            }
        });
    }

    if (downloadImagesFromPdfBtn) {
        downloadImagesFromPdfBtn.style.display = 'none'; // Hide initially
    }
    if (convertPdfToImageBtn) {
        convertPdfToImageBtn.style.display = 'none'; // Hide initially
    }
});