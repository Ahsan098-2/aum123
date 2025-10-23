document.addEventListener('DOMContentLoaded', () => {
    const emojiSearchInput = document.getElementById('emojiSearchInput');
    const searchEmojiBtn = document.getElementById('searchEmojiBtn');
    const emojiListContainer = document.getElementById('emojiListContainer'); // Assuming a div to show emojis
    const emojiResult = document.getElementById('emojiResult');

    // Simple mock emoji data for demonstration
    const allEmojis = [
        { char: '😀', name: 'grinning face' },
        { char: '😂', name: 'face with tears of joy' },
        { char: '🥰', name: 'smiling face with hearts' },
        { char: '😎', name: 'smiling face with sunglasses' },
        { char: '👍', name: 'thumbs up' },
        { char: '👋', name: 'waving hand' },
        { char: '🚀', name: 'rocket' },
        { char: '💡', name: 'light bulb' },
        { char: '💻', name: 'laptop' },
        { char: '🔥', name: 'fire' },
        { char: '✨', name: 'sparkles' },
        { char: '🎉', name: 'party popper' },
        { char: '❤️', name: 'red heart' },
        { char: '🌟', name: 'glowing star' },
        { char: '🥳', name: 'partying face' },
        { char: '🤔', name: 'thinking face' },
        { char: '🤯', name: 'exploding head' },
        { char: '🤩', name: 'star-struck' },
        { char: '🙏', name: 'folded hands' },
        { char: '💯', name: 'hundred points' }
    ];

    function displayEmojis(emojis) {
        if (!emojiListContainer) return;
        emojiListContainer.innerHTML = ''; // Clear previous results
        if (emojis.length === 0) {
            emojiListContainer.textContent = 'No emojis found.';
            return;
        }

        emojis.forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.classList.add('emoji-item');
            emojiSpan.textContent = emoji.char;
            emojiSpan.title = emoji.name; // Show name on hover
            emojiSpan.style.cursor = 'pointer';
            emojiSpan.style.fontSize = '2em';
            emojiSpan.style.margin = '5px';
            emojiSpan.style.padding = '5px';
            emojiSpan.style.borderRadius = '5px';
            emojiSpan.style.backgroundColor = 'rgba(255,255,255,0.1)';
            emojiSpan.style.border = '1px solid rgba(255,255,255,0.2)';
            emojiSpan.style.display = 'inline-block';

            // Click to copy
            emojiSpan.addEventListener('click', () => {
                navigator.clipboard.writeText(emoji.char)
                    .then(() => {
                        emojiResult.textContent = `Copied "${emoji.char}" - ${emoji.name}!`;
                    })
                    .catch(err => {
                        console.error('Failed to copy emoji:', err);
                        emojiResult.textContent = 'Failed to copy emoji.';
                    });
            });
            emojiListContainer.appendChild(emojiSpan);
        });
        emojiResult.textContent = `Displaying ${emojis.length} emojis. Click to copy!`;
    }

    if (searchEmojiBtn) {
        searchEmojiBtn.addEventListener('click', () => {
            const searchTerm = emojiSearchInput.value.toLowerCase().trim();
            const filteredEmojis = allEmojis.filter(emoji =>
                emoji.name.includes(searchTerm) || emoji.char.includes(searchTerm)
            );
            displayEmojis(filteredEmojis);
        });
    }

    // Display all emojis initially
    displayEmojis(allEmojis);
});