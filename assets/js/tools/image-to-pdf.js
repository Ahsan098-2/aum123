// This tool would require a library like 'jspdf'
// For now, it will be a placeholder.
// You would need to add: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// or similar to your index.html head.

document.addEventListener('DOMContentLoaded', () => {
    const imageToPdfInput = document.getElementById('imageToPdfInput');
    const convertImageToPdfBtn = document.getElementById('convertImageToPdfBtn');
    const downloadPdfFromImageBtn = document.getElementById('downloadPdfFromImageBtn');
    const imageToPdfResult = document.getElementById('imageToPdfResult');

    // Store files to convert
    let selectedImages = [];

    if (imageToPdfInput) {
        imageToPdfInput.addEventListener('change', (e) => {
            selectedImages = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
            if (selectedImages.length > 0) {
                imageToPdfResult.textContent = `${selectedImages.length} image(s) selected.`;
                convertImageToPdfBtn.style.display = 'inline-block';
                downloadPdfFromImageBtn.style.display = 'none';
            } else {
                imageToPdfResult.textContent = 'No images selected or invalid file types.';
                convertImageToPdfBtn.style.display = 'none';
            }
        });
    }

    if (convertImageToPdfBtn) {
        convertImageToPdfBtn.addEventListener('click', async () => {
            if (selectedImages.length === 0) {
                imageToPdfResult.textContent = 'Please select image(s) first.';
                return;
            }

            imageToPdfResult.textContent = 'Converting images to PDF...';
            // Placeholder for jsPDF logic
            if (typeof jspdf !== 'undefined' && jspdf.jsPDF) {
                const { jsPDF } = jspdf;
                const doc = new jsPDF({
                    orientation: 'p', // portrait
                    unit: 'mm',
                    format: 'a4'
                });

                for (let i = 0; i < selectedImages.length; i++) {
                    const file = selectedImages[i];
                    if (i > 0) doc.addPage(); // Add a new page for each image after the first

                    await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const imgData = e.target.result;
                            const img = new Image();
                            img.onload = () => {
                                const imgWidth = img.width;
                                const imgHeight = img.height;

                                const a4Width = doc.internal.pageSize.getWidth();
                                const a4Height = doc.internal.pageSize.getHeight();

                                let widthRatio = a4Width / imgWidth;
                                let heightRatio = a4Height / imgHeight;
                                let ratio = Math.min(widthRatio, heightRatio);

                                const scaledWidth = imgWidth * ratio;
                                const scaledHeight = imgHeight * ratio;

                                // Center the image
                                const x = (a4Width - scaledWidth) / 2;
                                const y = (a4Height - scaledHeight) / 2;

                                doc.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
                                resolve();
                            };
                            img.src = imgData;
                        };
                        reader.readAsDataURL(file);
                    });
                }

                const pdfBlob = doc.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);

                downloadPdfFromImageBtn.href = pdfUrl;
                downloadPdfFromImageBtn.download = 'converted_images.pdf';
                downloadPdfFromImageBtn.style.display = 'inline-block';
                imageToPdfResult.textContent = 'Images converted to PDF successfully!';

            } else {
                imageToPdfResult.textContent = 'Error: jsPDF library not loaded. Please ensure it is linked in index.html.';
                console.error("jsPDF library is required for Image to PDF conversion.");
            }
        });
    }

    if (downloadPdfFromImageBtn) {
        downloadPdfFromImageBtn.style.display = 'none'; // Hide initially
    }
    if (convertImageToPdfBtn) {
        convertImageToPdfBtn.style.display = 'none'; // Hide initially
    }
});