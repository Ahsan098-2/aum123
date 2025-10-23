// This tool would require a library like 'pdf-lib' (Node.js/browser) or similar
// For now, it will be a placeholder.
// You would need to add: <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>
// or similar to your index.html head.

document.addEventListener('DOMContentLoaded', () => {
    const mergePdfInput = document.getElementById('mergePdfInput');
    const mergePdfBtn = document.getElementById('mergePdfBtn');
    const downloadMergedPdfBtn = document.getElementById('downloadMergedPdfBtn');
    const mergePdfResult = document.getElementById('mergePdfResult');

    let selectedPdfs = [];

    if (mergePdfInput) {
        mergePdfInput.addEventListener('change', (e) => {
            selectedPdfs = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
            if (selectedPdfs.length > 1) { // Need at least 2 PDFs to merge
                mergePdfResult.textContent = `${selectedPdfs.length} PDF files selected for merging.`;
                mergePdfBtn.style.display = 'inline-block';
                downloadMergedPdfBtn.style.display = 'none';
            } else {
                mergePdfResult.textContent = 'Please select at least two PDF files.';
                mergePdfBtn.style.display = 'none';
            }
        });
    }

    if (mergePdfBtn) {
        mergePdfBtn.addEventListener('click', async () => {
            if (selectedPdfs.length < 2) {
                mergePdfResult.textContent = 'Please select at least two PDF files to merge.';
                return;
            }

            mergePdfResult.textContent = 'Merging PDFs... This might take a moment.';

            if (typeof PDFLib !== 'undefined' && PDFLib.PDFDocument) {
                const { PDFDocument } = PDFLib;
                const mergedPdf = await PDFDocument.create();

                try {
                    for (const file of selectedPdfs) {
                        const arrayBuffer = await file.arrayBuffer();
                        const pdf = await PDFDocument.load(arrayBuffer);
                        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                        copiedPages.forEach((page) => mergedPdf.addPage(page));
                    }

                    const mergedPdfBytes = await mergedPdf.save();
                    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);

                    downloadMergedPdfBtn.href = url;
                    downloadMergedPdfBtn.download = 'merged_document.pdf';
                    downloadMergedPdfBtn.style.display = 'inline-block';
                    mergePdfResult.textContent = 'PDFs merged successfully!';

                } catch (error) {
                    console.error('Error merging PDFs:', error);
                    mergePdfResult.textContent = `Error merging PDFs: ${error.message}`;
                    downloadMergedPdfBtn.style.display = 'none';
                }
            } else {
                mergePdfResult.textContent = 'Error: PDF-LIB library not loaded. Please ensure it is linked in index.html.';
                console.error("PDF-LIB library is required for PDF merging.");
            }
        });
    }

    if (downloadMergedPdfBtn) {
        downloadMergedPdfBtn.style.display = 'none'; // Hide initially
    }
    if (mergePdfBtn) {
        mergePdfBtn.style.display = 'none'; // Hide initially
    }
});