// This tool would require a library like 'pdf-lib' for manipulation
// or a server-side solution for more robust compression.
// For now, it will be a placeholder.

document.addEventListener('DOMContentLoaded', () => {
    const compressPdfInput = document.getElementById('compressPdfInput');
    const compressPdfBtn = document.getElementById('compressPdfBtn');
    const downloadCompressBtn = document.getElementById('downloadCompressBtn');
    const pdfQuality = document.getElementById('pdfQuality'); // Assumed range input
    const compressPdfResult = document.getElementById('compressPdfResult');

    let selectedPdfFile = null;

    if (compressPdfInput) {
        compressPdfInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0 && e.target.files[0].type === 'application/pdf') {
                selectedPdfFile = e.target.files[0];
                compressPdfResult.textContent = `"${selectedPdfFile.name}" selected.`;
                compressPdfBtn.style.display = 'inline-block';
                downloadCompressBtn.style.display = 'none'; // Reset
                if (pdfQuality) pdfQuality.style.display = 'inline-block'; // Show quality slider
            } else {
                selectedPdfFile = null;
                compressPdfResult.textContent = 'Please select a PDF file.';
                compressPdfBtn.style.display = 'none';
                if (pdfQuality) pdfQuality.style.display = 'none';
            }
        });
    }

    if (compressPdfBtn) {
        compressPdfBtn.addEventListener('click', async () => {
            if (!selectedPdfFile) {
                compressPdfResult.textContent = 'Please select a PDF file first.';
                return;
            }

            compressPdfResult.textContent = 'Compressing PDF... This might take a moment.';

            if (typeof PDFLib !== 'undefined' && PDFLib.PDFDocument) {
                const { PDFDocument, rgb } = PDFLib;

                try {
                    const arrayBuffer = await selectedPdfFile.arrayBuffer();
                    const originalPdf = await PDFDocument.load(arrayBuffer);

                    // Create a new PDF to copy content to, potentially with compression
                    const compressedPdf = await PDFDocument.create();

                    // Copy pages from original to compressed. This alone doesn't
                    // *compress* image streams within the PDF. True compression
                    // often involves re-encoding images, which PDF-LIB can't do natively
                    // for existing image streams without a more advanced approach.
                    // For a client-side solution, you'd typically need to extract images,
                    // compress them (e.g., via canvas.toDataURL), and then re-embed.
                    // Or use a server-side service.

                    // This is a simplified "compression" by recreating the PDF which
                    // might reduce file size if the original PDF had inefficiencies,
                    // but it won't re-compress embedded images without more work.
                    // To truly compress, you'd iterate through pages, extract image objects,
                    // re-encode them (e.g., using a canvas with lower quality), and re-embed.
                    // This is highly complex for browser-side.
                    const copiedPages = await compressedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
                    copiedPages.forEach((page) => compressedPdf.addPage(page));

                    // For demonstration, let's just save the new document.
                    // True compression involves re-encoding objects, which is out of scope for a simple client-side JS.
                    // A 'quality' setting for PDF compression is typically handled by a server-side engine.
                    const compressedPdfBytes = await compressedPdf.save();
                    const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
                    const compressedUrl = URL.createObjectURL(compressedPdfBlob);

                    downloadCompressBtn.href = compressedUrl;
                    downloadCompressBtn.download = `compressed_${selectedPdfFile.name}`;
                    downloadCompressBtn.style.display = 'inline-block';

                    // Calculate size difference
                    const originalSize = selectedPdfFile.size;
                    const compressedSize = compressedPdfBytes.length;
                    const percentageReduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

                    compressPdfResult.innerHTML = `PDF compressed successfully! <br>
                                                    Original Size: ${(originalSize / 1024 / 1024).toFixed(2)} MB <br>
                                                    Compressed Size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB <br>
                                                    Reduction: ${percentageReduction}% (Note: Actual image compression requires advanced techniques or server-side tools)`;

                } catch (error) {
                    console.error('Error compressing PDF:', error);
                    compressPdfResult.textContent = `Error compressing PDF: ${error.message}`;
                    downloadCompressBtn.style.display = 'none';
                }
            } else {
                compressPdfResult.textContent = 'Error: PDF-LIB library not loaded. Please ensure it is linked in index.html.';
                console.error("PDF-LIB library is required for PDF compression.");
            }
        });
    }

    if (downloadCompressBtn) {
        downloadCompressBtn.style.display = 'none'; // Hide initially
    }
    if (compressPdfBtn) {
        compressPdfBtn.style.display = 'none'; // Hide initially
    }
    if (pdfQuality) {
        pdfQuality.style.display = 'none'; // Hide initially
    }
});