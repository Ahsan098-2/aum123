document.addEventListener('DOMContentLoaded', () => {
    const goldWeightUnit = document.getElementById('goldWeightUnit');
    const checkGoldPriceBtn = document.getElementById('checkGoldPriceBtn');
    const copyGoldPriceBtn = document.getElementById('copyGoldPriceBtn');
    const goldPriceResult = document.getElementById('goldPriceResult');

    if (checkGoldPriceBtn) {
        checkGoldPriceBtn.addEventListener('click', async () => {
            const unit = goldWeightUnit.value;

            goldPriceResult.textContent = `Fetching gold price per ${unit}...`;

            // === Placeholder for a real Gold Price API ===
            // You would replace this with a fetch request to a real API like GoldAPI.io, Kitco, etc.
            // Remember to handle API keys securely and respect rate limits.
            try {
                // Mock data for demonstration (prices in USD)
                const mockGoldPrices = {
                    'gram': 75.50, // per gram USD
                    'ounce': 2348.00, // per troy ounce USD
                    'kilogram': 75500.00 // per kilogram USD
                };
                const price = mockGoldPrices[unit];

                if (price) {
                    goldPriceResult.innerHTML = `
                        <p>Current Gold Price per ${unit}: <strong>$${price.toFixed(2)} USD</strong></p>
                        <small>(Data is mock/placeholder - integrate real API)</small>
                    `;
                    copyGoldPriceBtn.style.display = 'inline-block';
                } else {
                    goldPriceResult.textContent = `Gold price for unit "${unit}" not found. (Mock Data)`;
                    copyGoldPriceBtn.style.display = 'none';
                }

            } catch (error) {
                console.error('Error fetching gold price:', error);
                goldPriceResult.textContent = `Failed to fetch gold price. Error: ${error.message}`;
                copyGoldPriceBtn.style.display = 'none';
            }
        });
    }

    if (copyGoldPriceBtn) {
        copyGoldPriceBtn.addEventListener('click', () => {
            if (goldPriceResult && goldPriceResult.textContent) {
                const textToCopy = goldPriceResult.textContent.replace('(Data is mock/placeholder - integrate real API)', '').trim();
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        goldPriceResult.textContent += '\n(Copied to clipboard!)';
                    })
                    .catch(err => {
                        console.error('Failed to copy gold price:', err);
                        goldPriceResult.textContent = 'Failed to copy price.';
                    });
            }
        });
        copyGoldPriceBtn.style.display = 'none'; // Hide initially
    }
});