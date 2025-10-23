// This tool would require a library like 'pdf-lib'
// For now, it will be a placeholder.

document.addEventListener('DOMContentLoaded', () => {
    const splitPdfInput = document.getElementById('splitPdfInput');
    const splitPdfPageNumber = document.getElementById('splitPdfPageNumber');
    const splitPdfBtn = document.getElementById('splitPdfBtn');
    const downloadSplitPdfBtn = document.getElementById('downloadSplitPdfBtn'); // This might need to be dynamic for multiple downloads
    const splitPdfResult = document.getElementById('splitPdfResult');

    let selectedPdfFile = null;

    if (splitPdfInput) {
        splitPdfInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0 && e.target.files[0].type === 'application/pdf') {
                selectedPdfFile = e.target.files[0];
                splitPdfResult.textContent = `"${selectedPdfFile.name}" selected. Enter page number to split.`;
                splitPdfBtn.style.display = 'inline-block';
                downloadSplitPdfBtn.style.display = 'none'; // Reset
                splitPdfPageNumber.style.display = 'inline-block';
            } else {
                selectedPdfFile = null;
                splitPdfResult.textContent = 'Please select a PDF file.';
                splitPdfBtn.style.display = 'none';
                splitPdfPageNumber.style.display = 'none';
            }
        });
    }

    if (splitPdfBtn) {
        splitPdfBtn.addEventListener('click', async () => {
            if (!selectedPdfFile) {
                splitPdfResult.textContent = 'Please select a PDF file first.';
                return;
            }

            const pageNumberToSplit = parseInt(splitPdfPageNumber.value);
            if (isNaN(pageNumberToSplit) || pageNumberToSplit < 1) {
                splitPdfResult.textContent = 'Please enter a valid page number to split at.';
                return;
            }

            splitPdfResult.textContent = 'Splitting PDF...';

            if (typeof PDFLib !== 'undefined' && PDFLib.PDFDocument) {
                const { PDFDocument } = PDFLib;

                try {
                    const arrayBuffer = await selectedPdfFile.arrayBuffer();
                    const originalPdf = await PDFDocument.load(arrayBuffer);
                    const totalPages = originalPdf.getPageCount();

                    if (pageNumberToSplit > totalPages) {
                        splitPdfResult.textContent = `Page number ${pageNumberToSplit} is out of bounds. This PDF has ${totalPages} pages.`;
                        return;
                    }

                    // Create first PDF (pages 1 to pageNumberToSplit)
                    const firstPdf = await PDFDocument.create();
                    const firstPages = await firstPdf.copyPages(originalPdf, Array.from({ length: pageNumberToSplit }).map((_, i) => i));
                    firstPages.forEach((page) => firstPdf.addPage(page));
                    const firstPdfBytes = await firstPdf.save();
                    const firstPdfBlob = new Blob([firstPdfBytes], { type: 'application/pdf' });
                    const firstPdfUrl = URL.createObjectURL(firstPdfBlob);

                    // Create second PDF (pages pageNumberToSplit + 1 to end)
                    const secondPdf = await PDFDocument.create();
                    const secondPages = await secondPdf.copyPages(originalPdf, Array.from({ length: totalPages - pageNumberToSplit }).map((_, i) => i + pageNumberToSplit));
                    secondPages.forEach((page) => secondPdf.addPage(page));
                    const secondPdfBytes = await secondPdf.save();
                    const secondPdfBlob = new Blob([secondPdfBytes], { type: 'application/pdf' });
                    const secondPdfUrl = URL.createObjectURL(secondPdfBlob);

                    // Provide download links for both
                    splitPdfResult.innerHTML = `
                        PDF split successfully!
                        <a href="${firstPdfUrl}" download="${selectedPdfFile.name.replace('.pdf', '')}_part1.pdf" class="btn-primary" style="margin-top: 10px; display: block;">Download Part 1</a>
                        <a href="${secondPdfUrl}" download="${selectedPdfFile.name.replace('.pdf', '')}_part2.pdf" class="btn-secondary" style="margin-top: 5px; display: block;">Download Part 2</a>
                    `;
                    // Hide the generic download button as we're providing specific ones
                    downloadSplitPdfBtn.style.display = 'none';

                } catch (error) {
                    console.error('Error splitting PDF:', error);
                    splitPdfResult.textContent = `Error splitting PDF: ${error.message}`;
                    downloadSplitPdfBtn.style.display = 'none';
                }
            } else {
                splitPdfResult.textContent = 'Error: PDF-LIB library not loaded. Please ensure it is linked in index.html.';
                console.error("PDF-LIB library is required for PDF splitting.");
            }
        });
    }

    if (downloadSplitPdfBtn) {
        downloadSplitPdfBtn.style.display = 'none'; // Hide initially
    }
    if (splitPdfBtn) {
        splitPdfBtn.style.display = 'none'; // Hide initially
    }
    if (splitPdfPageNumber) {
        splitPdfPageNumber.style.display = 'none'; // Hide initially
    }
});