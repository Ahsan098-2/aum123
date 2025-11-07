// Event Listeners and Functions
document.addEventListener('DOMContentLoaded', function() {
    // Attach click handler to "Explore Tools" button
    const exploreButton = document.querySelector('.hero-section .btn-primary');
    if (exploreButton) {
        exploreButton.addEventListener('click', function() {
            location.href = '#tools';
        });
    }

    // Real-time search
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchTools();
            }, 300);
        });
    }
});

// Search tools function
function searchTools(event) {
    if (event) {
        event.preventDefault();
    }
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const toolName = card.querySelector('h3').textContent.toLowerCase();
        if (toolName.includes(searchTerm)) {
            card.style.display = '';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });

    // Scroll to tools section if we're not already there
    if (!window.location.hash.includes('tools')) {
        document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
    }
    
    return false;
}