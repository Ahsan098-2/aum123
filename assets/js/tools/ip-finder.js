document.addEventListener('DOMContentLoaded', () => {
    const findIpBtn = document.getElementById('findIpBtn');
    const copyIpBtn = document.getElementById('copyIpBtn');
    const ipResult = document.getElementById('ipResult');

    if (findIpBtn) {
        findIpBtn.addEventListener('click', async () => {
            ipResult.textContent = 'Fetching IP address...';
            try {
                // Using a public API to get client IP. Consider rate limits.
                const response = await fetch('https://api.ipify.org?format=json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                ipResult.textContent = `Your IP Address: ${data.ip}`;
                copyIpBtn.style.display = 'inline-block';
            } catch (error) {
                console.error('Error fetching IP:', error);
                ipResult.textContent = 'Failed to fetch IP address. Please try again.';
            }
        });
    }

    if (copyIpBtn) {
        copyIpBtn.addEventListener('click', () => {
            // Extract just the IP address from the result string
            const ipText = ipResult.textContent.replace('Your IP Address: ', '');
            if (ipText && ipText !== 'Fetching IP address...' && ipText !== 'Failed to fetch IP address. Please try again.') {
                navigator.clipboard.writeText(ipText)
                    .then(() => {
                        ipResult.textContent = 'IP address copied!';
                        setTimeout(() => findIpBtn.click(), 1500); // Re-fetch or show original
                    })
                    .catch(err => {
                        console.error('Failed to copy IP:', err);
                        ipResult.textContent = 'Failed to copy IP.';
                    });
            }
        });
        copyIpBtn.style.display = 'none'; // Hide initially
    }
});