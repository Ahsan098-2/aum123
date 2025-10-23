document.addEventListener('DOMContentLoaded', () => {
    const hashtagPrompt = document.getElementById('hashtagPrompt');
    const generateHashtagBtn = document.getElementById('generateHashtagBtn');
    const copyHashtagBtn = document.getElementById('copyHashtagBtn');
    const hashtagList = document.getElementById('hashtagList'); // Assuming a UL to display
    const hashtagResult = document.getElementById('hashtagResult');

    if (generateHashtagBtn) {
        generateHashtagBtn.addEventListener('click', () => {
            const prompt = hashtagPrompt.value.trim();
            if (!prompt) {
                hashtagResult.textContent = 'Please enter keywords to generate hashtags.';
                return;
            }

            // Simple example: split by space, add #, convert to camelCase or lowercase
            const keywords = prompt.split(/\s*,\s*|\s+/).filter(Boolean); // Split by comma or space
            const generatedHashtags = keywords.map(keyword => {
                // Basic conversion to a hashtag format
                return '#' + keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
            });

            hashtagList.innerHTML = ''; // Clear previous results
            if (generatedHashtags.length > 0) {
                generatedHashtags.forEach(tag => {
                    const li = document.createElement('li');
                    li.textContent = tag;
                    hashtagList.appendChild(li);
                });
                hashtagResult.textContent = `Generated ${generatedHashtags.length} hashtags.`;
                copyHashtagBtn.style.display = 'inline-block'; // Show copy button
            } else {
                hashtagResult.textContent = 'Could not generate hashtags from the provided input.';
                copyHashtagBtn.style.display = 'none';
            }
        });
    }

    if (copyHashtagBtn) {
        copyHashtagBtn.addEventListener('click', () => {
            const hashtagsToCopy = Array.from(hashtagList.children).map(li => li.textContent).join(' ');
            if (hashtagsToCopy) {
                navigator.clipboard.writeText(hashtagsToCopy)
                    .then(() => {
                        hashtagResult.textContent = 'Hashtags copied to clipboard!';
                    })
                    .catch(err => {
                        console.error('Failed to copy hashtags: ', err);
                        hashtagResult.textContent = 'Failed to copy hashtags.';
                    });
            }
        });
        copyHashtagBtn.style.display = 'none'; // Hide initially
    }
});