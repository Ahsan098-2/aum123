document.addEventListener('DOMContentLoaded', () => {
    const textToConvert = document.getElementById('textToConvert');
    const convertCaseBtn = document.getElementById('convertCaseBtn');
    const caseType = document.getElementById('caseType');
    const copyCaseBtn = document.getElementById('copyCaseBtn');
    const convertedTextResult = document.getElementById('convertedTextResult');

    if (convertCaseBtn) {
        convertCaseBtn.addEventListener('click', () => {
            const text = textToConvert.value;
            const type = caseType.value;
            let result = '';

            switch (type) {
                case 'uppercase':
                    result = text.toUpperCase();
                    break;
                case 'lowercase':
                    result = text.toLowerCase();
                    break;
                case 'capitalize': // Title Case
                    result = text.toLowerCase().split(' ').map(word => {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    }).join(' ');
                    break;
                case 'sentencecase': // Capitalize first letter of each sentence
                    result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
                    break;
                case 'camelcase':
                    result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
                        return index === 0 ? word.toLowerCase() : word.toUpperCase();
                    }).replace(/\s+/g, '');
                    break;
                case 'pascalcase':
                    result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word) {
                        return word.toUpperCase();
                    }).replace(/\s+/g, '');
                    break;
                case 'kebabcase':
                    result = text.toLowerCase().replace(/\s+/g, '-');
                    break;
                case 'snakecase':
                    result = text.toLowerCase().replace(/\s+/g, '_');
                    break;
                default:
                    result = text;
            }

            convertedTextResult.textContent = result;
            copyCaseBtn.style.display = 'inline-block';
        });
    }

    if (copyCaseBtn) {
        copyCaseBtn.addEventListener('click', () => {
            if (convertedTextResult && convertedTextResult.textContent) {
                navigator.clipboard.writeText(convertedTextResult.textContent)
                    .then(() => {
                        convertedTextResult.textContent += ' (Copied!)';
                        setTimeout(() => convertCaseBtn.click(), 1500); // Re-process to reset text
                    })
                    .catch(err => {
                        console.error('Failed to copy text:', err);
                        convertedTextResult.textContent = 'Failed to copy.';
                    });
            }
        });
        copyCaseBtn.style.display = 'none'; // Hide initially
    }
});