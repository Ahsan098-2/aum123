document.addEventListener('DOMContentLoaded', () => {
    const fuelLocation = document.getElementById('fuelLocation');
    const checkFuelPriceBtn = document.getElementById('checkFuelPriceBtn');
    const copyFuelPriceBtn = document.getElementById('copyFuelPriceBtn');
    const fuelPriceResult = document.getElementById('fuelPriceResult');

    if (checkFuelPriceBtn) {
        checkFuelPriceBtn.addEventListener('click', async () => {
            const location = fuelLocation.value.trim();
            if (!location) {
                fuelPriceResult.textContent = 'Please enter a location (e.g., city, zip code).';
                return;
            }

            fuelPriceResult.textContent = `Fetching fuel prices for ${location}...`;

            // === Placeholder for a real Fuel Price API ===
            // This is complex as fuel price APIs often require specific location data (lat/lng or postal codes)
            // and often come with commercial licensing.
            // You would replace this with a fetch request to a real API like GasBuddy (often commercial),
            // or country-specific government data APIs if available.
            // Remember to handle API keys securely and respect rate limits.
            try {
                // Mock data for demonstration
                const mockPrices = {
                    'New York': { unleaded: 3.89, diesel: 4.25 },
                    'Los Angeles': { unleaded: 4.99, diesel: 5.30 },
                    'Houston': { unleaded: 3.10, diesel: 3.55 },
                    'Toronto': { unleaded: 1.65, diesel: 1.80, currency: 'CAD/Litre' } // Example with CAD
                };
                let prices = null;
                // Simple case-insensitive match for demo
                for (const key in mockPrices) {
                    if (key.toLowerCase().includes(location.toLowerCase())) {
                        prices = mockPrices[key];
                        break;
                    }
                }


                if (prices) {
                    const currency = prices.currency || 'USD/Gallon';
                    fuelPriceResult.innerHTML = `
                        <p>Fuel Prices for <strong>${location}</strong>:</p>
                        <p>Unleaded: <strong>${prices.unleaded.toFixed(2)} ${currency}</strong></p>
                        <p>Diesel: <strong>${prices.diesel.toFixed(2)} ${currency}</strong></p>
                        <small>(Data is mock/placeholder - integrate real API)</small>
                    `;
                    copyFuelPriceBtn.style.display = 'inline-block';
                } else {
                    fuelPriceResult.textContent = `Fuel prices for "${location}" not found or no data available. (Mock Data)`;
                    copyFuelPriceBtn.style.display = 'none';
                }

            } catch (error) {
                console.error('Error fetching fuel price:', error);
                fuelPriceResult.textContent = `Failed to fetch fuel prices for ${location}. Error: ${error.message}`;
                copyFuelPriceBtn.style.display = 'none';
            }
        });
    }

    if (copyFuelPriceBtn) {
        copyFuelPriceBtn.addEventListener('click', () => {
            if (fuelPriceResult && fuelPriceResult.textContent) {
                const textToCopy = fuelPriceResult.textContent.replace('(Data is mock/placeholder - integrate real API)', '').trim();
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        fuelPriceResult.textContent += '\n(Copied to clipboard!)';
                    })
                    .catch(err => {
                        console.error('Failed to copy fuel price:', err);
                        fuelPriceResult.textContent = 'Failed to copy price.';
                    });
            }
        });
        copyFuelPriceBtn.style.display = 'none'; // Hide initially
    }
});