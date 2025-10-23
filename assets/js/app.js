// app.js (example of how it might be handled - needs verification from your actual app.js)

document.addEventListener('DOMContentLoaded', () => {
    const toolModalBackdrop = document.getElementById('toolModalBackdrop');
    const toolModalContent = document.getElementById('toolModalContent');
    const closeToolModalBtn = document.getElementById('closeToolModal');
    const mainContent = document.getElementById('mainContent');

    document.querySelectorAll('.open-tool-btn').forEach(button => {
        button.addEventListener('click', function() {
            const toolId = this.dataset.tool; // e.g., 'age', 'password'
            const fullToolDivId = `tool-full-${toolId}`; // e.g., 'tool-full-age'
            const toolContentToLoad = document.getElementById(fullToolDivId);

            if (toolContentToLoad) {
                // Clear previous content
                toolModalContent.innerHTML = ''; 
                
                // IMPORTANT: Move the original element into the modal
                // If you are cloning, you need to make IDs unique or remove them.
                // Moving is generally safer for ID uniqueness.
                toolModalContent.appendChild(toolContentToLoad); 
                
                // Make the original hidden div temporarily visible within the modal
                toolContentToLoad.style.display = 'block'; 

                toolModalBackdrop.classList.add('active');
                mainContent.classList.add('modal-open'); // To prevent main content scrolling
            } else {
                console.error(`Tool content for ${fullToolDivId} not found.`);
            }
        });
    });

    closeToolModalBtn.addEventListener('click', closeModal);
    toolModalBackdrop.addEventListener('click', (e) => {
        if (e.target === toolModalBackdrop) {
            closeModal();
        }
    });

    function closeModal() {
        toolModalBackdrop.classList.remove('active');
        mainContent.classList.remove('modal-open');

        // IMPORTANT: Move the tool content back to its original hidden parent
        // or ensure it's hidden again.
        const currentToolInModal = toolModalContent.querySelector('.tool-full');
        if (currentToolInModal) {
            currentToolInModal.style.display = 'none'; // Hide it
            document.body.appendChild(currentToolInModal); // Move it back to body or its original parent
        }
        toolModalContent.innerHTML = ''; // Clear modal content
    }
});