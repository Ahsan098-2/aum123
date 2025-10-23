document.addEventListener('DOMContentLoaded', () => {
    const captionPrompt = document.getElementById('captionPrompt');
    const captionStyle = document.getElementById('captionStyle');
    const generateCaptionBtn = document.getElementById('generateCaptionBtn');
    const copyCaptionBtn = document.getElementById('copyCaptionBtn');
    const captionSuggestions = document.getElementById('captionSuggestions');
    const captionResult = document.getElementById('captionResult');

    // Simple caption templates based on style and prompt
    const captionTemplates = {
        inspirational: (prompt) => [
            `Embrace the journey. Every step forward, no matter how small, leads to something great. ✨ #Inspiration #Motivation #LifeGoals ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''}`,
            `Dream big, work hard, stay focused, and surround yourself with good people. Your vibe attracts your tribe! 💫 #PositiveVibes #DreamChaser #Mindset ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''}`,
            `Finding beauty in the everyday moments. It's the little things that make life extraordinary. 💖 #Gratitude #Blessed #DailyInspiration ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''}`
        ],
        humorous: (prompt) => [
            `I'm not saying I'm lazy, but I carefully pick out my clothes to match my next Netflix binge. 😂 #LazyDays #Comedy #Relatable ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''}`,
            `My life is 10% what happens to me and 90% how I react to it (and 100% coffee). ☕ #CoffeeLover #Humor #LifeLessons ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''}`,
            `Came, saw, made it awkward. My specialty. 🤷‍♀️ #AwkwardMoments #JustMe #Funny ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''}`
        ],
        promotional: (prompt) => [
            `🔥 Introducing our BRAND NEW ${prompt || 'product/service'}! Get yours today and elevate your experience. Link in bio! #NewArrival #ShopNow #LimitedTimeOffer`,
            `Don't miss out! Our incredible ${prompt || 'offer'} is flying off the shelves. Tap the link in our bio to grab yours before it's gone! 🚀 #SaleAlert #DealOfTheDay #MustHave`,
            `Transform your world with ${prompt || 'our solution'}. We're dedicated to bringing you the best. Discover the difference! #Innovation #Quality #CustomerLove`
        ],
        question: (prompt) => [
            `What's your favorite thing about ${prompt || 'this season/topic'}? Let us know in the comments below! 👇 #QandA #Community #Engage`,
            `If you could have one superpower related to ${prompt || 'your daily life'}, what would it be? ✨ Tell us! #Superpower #Hypothetical #FunQuestion`,
            `We're curious! How do you handle ${prompt || 'challenges/stress'} in your life? Share your tips! 💬 #AskMeAnything #Advice #Discussion`
        ],
        'short-punchy': (prompt) => [
            `Vibes. ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''} ✨`,
            `Simply the best. 🏆 ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''}`,
            `Making moves. 🚀 ${prompt ? `#${prompt.replace(/\s+/g, '')}` : ''}`
        ],
        informative: (prompt) => [
            `Did you know? ${prompt || 'This fact'} is truly fascinating. Learn more about it! 📚 #FactCheck #Knowledge #Education`,
            `Breaking down the basics of ${prompt || 'this concept'}. Understanding it is key to success. #Learning #Guide #Insights`,
            `Explore the details of ${prompt || 'our process'}. We believe in transparency and empowering you with information. #Details #Explanation #HowItWorks`
        ]
    };

    if (generateCaptionBtn) {
        generateCaptionBtn.addEventListener('click', () => {
            const promptText = captionPrompt.value.trim();
            const selectedStyle = captionStyle.value;

            if (!promptText) {
                captionResult.textContent = 'Please enter a main topic or keywords to generate captions.';
                captionSuggestions.innerHTML = '';
                copyCaptionBtn.style.display = 'none';
                return;
            }

            const suggestions = captionTemplates[selectedStyle] ? captionTemplates[selectedStyle](promptText) : [];

            if (suggestions.length > 0) {
                captionSuggestions.innerHTML = ''; // Clear previous
                suggestions.forEach(caption => {
                    const captionItem = document.createElement('div');
                    captionItem.classList.add('caption-item', 'glass-card-light');
                    captionItem.innerHTML = `<p>${caption}</p><button class="copy-individual-caption-btn btn-secondary">Copy</button>`;
                    captionSuggestions.appendChild(captionItem);
                });
                captionResult.textContent = `Generated ${suggestions.length} captions. Click 'Copy' next to a caption or 'Copy All' below.`;
                copyCaptionBtn.style.display = 'inline-block';
            } else {
                captionSuggestions.innerHTML = '';
                captionResult.textContent = 'No captions could be generated for the selected style. Try different keywords!';
                copyCaptionBtn.style.display = 'none';
            }
        });
    }

    // Event listener for individual copy buttons
    if (captionSuggestions) {
        captionSuggestions.addEventListener('click', (event) => {
            if (event.target.classList.contains('copy-individual-caption-btn')) {
                const captionText = event.target.previousElementSibling.textContent;
                navigator.clipboard.writeText(captionText)
                    .then(() => {
                        captionResult.textContent = `"${captionText.substring(0, 50)}..." copied!`;
                        setTimeout(() => {
                            // Clear status message after a short delay
                            captionResult.textContent = '';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy caption:', err);
                        captionResult.textContent = 'Failed to copy caption.';
                    });
            }
        });
    }

    if (copyCaptionBtn) {
        copyCaptionBtn.addEventListener('click', () => {
            // Get all generated captions and join them for "copy all"
            const allCaptions = Array.from(captionSuggestions.querySelectorAll('.caption-item p'))
                                .map(p => p.textContent)
                                .join('\n\n---\n\n'); // Separator for multiple captions

            if (allCaptions) {
                navigator.clipboard.writeText(allCaptions)
                    .then(() => {
                        captionResult.textContent = 'All generated captions copied to clipboard!';
                    })
                    .catch(err => {
                        console.error('Failed to copy all captions:', err);
                        captionResult.textContent = 'Failed to copy all captions.';
                    });
            } else {
                captionResult.textContent = 'No captions to copy!';
            }
        });
        copyCaptionBtn.style.display = 'none'; // Hide initially
    }
});