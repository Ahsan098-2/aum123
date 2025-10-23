document.addEventListener('DOMContentLoaded', () => {
    const textToCount = document.getElementById('textToCount');
    const countWordsBtn = document.getElementById('countWordsBtn');
    const copyWordCountBtn = document.getElementById('copyWordCountBtn');
    const wordCountResult = document.getElementById('wordCountResult');

    function updateWordCount() {
        const text = textToCount.value;

        // Count words: split by whitespace, filter out empty strings
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;

        // Count characters (including spaces)
        const charCount = text.length;

        // Count characters (excluding spaces)
        const charNoSpaceCount = text.replace(/\s/g, '').length;

        // Count sentences (basic heuristic)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceCount = sentences.length;

        // Count paragraphs (basic heuristic)
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const paragraphCount = paragraphs.length;


        wordCountResult.innerHTML = `
            <p>Words: <strong>${wordCount}</strong></p>
            <p>Characters (with spaces): <strong>${charCount}</strong></p>
            <p>Characters (no spaces): <strong>${charNoSpaceCount}</strong></p>
            <p>Sentences: <strong>${sentenceCount}</strong></p>
            <p>Paragraphs: <strong>${paragraphCount}</strong></p>
        `;
        copyWordCountBtn.style.display = 'inline-block';
    }

    if (countWordsBtn) {
        countWordsBtn.addEventListener('click', updateWordCount);
    }
    // Optionally update live as user types
    if (textToCount) {
        textToCount.addEventListener('input', updateWordCount);
    }

    if (copyWordCountBtn) {
        copyWordCountBtn.addEventListener('click', () => {
            if (wordCountResult && wordCountResult.textContent) {
                navigator.clipboard.writeText(wordCountResult.textContent)
                    .then(() => {
                        wordCountResult.textContent += '\n(Copied to clipboard!)';
                    })
                    .catch(err => {
                        console.error('Failed to copy word count:', err);
                        wordCountResult.textContent = 'Failed to copy.';
                    });
            }
        });
        copyWordCountBtn.style.display = 'none'; // Hide initially
    }
    // Initial update if there's any pre-filled text
    if (textToCount && textToCount.value) {
        updateWordCount();
    }
});