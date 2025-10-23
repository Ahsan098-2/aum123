document.addEventListener('DOMContentLoaded', () => {
    const stockSymbol = document.getElementById('stockSymbol');
    const checkStockPriceBtn = document.getElementById('checkStockPriceBtn');
    const copyStockPriceBtn = document.getElementById('copyStockPriceBtn');
    const stockPriceResult = document.getElementById('stockPriceResult');

    if (checkStockPriceBtn) {
        checkStockPriceBtn.addEventListener('click', async () => {
            const symbol = stockSymbol.value.trim().toUpperCase();
            if (!symbol) {
                stockPriceResult.textContent = 'Please enter a stock symbol (e.g., AAPL, MSFT).';
                return;
            }

            stockPriceResult.textContent = `Fetching price for ${symbol}...`;

            // === Placeholder for a real Stock Market API ===
            // You would replace this with a fetch request to a real API like Alpha Vantage, Finnhub, Twelve Data etc.
            // Remember to handle API keys securely and respect rate limits.
            try {
                // Example using a placeholder API (this won't work in production as-is)
                // You need to replace 'YOUR_API_KEY' and the API endpoint
                // const response = await fetch(`https://api.example.com/stock?symbol=${symbol}&apikey=YOUR_API_KEY`);
                // if (!response.ok) {
                //     throw new Error(`API error! Status: ${response.status}`);
                // }
                // const data = await response.json();
                // const price = data.price; // Adjust based on actual API response structure
                // const companyName = data.companyName; // Adjust based on actual API response structure

                // Mock data for demonstration
                const mockPrices = {
                    'AAPL': 175.25, 'MSFT': 380.10, 'GOOG': 150.70, 'AMZN': 180.50, 'TSLA': 195.30
                };
                const price = mockPrices[symbol];

                if (price) {
                    stockPriceResult.innerHTML = `
                        <p>Symbol: <strong>${symbol}</strong></p>
                        <p>Current Price: <strong>$${price.toFixed(2)}</strong></p>
                        <small> (Data is mock/placeholder - integrate real API)</small>
                    `;
                    copyStockPriceBtn.style.display = 'inline-block';
                } else {
                    stockPriceResult.textContent = `Stock symbol "${symbol}" not found or no data available. (Mock Data)`;
                    copyStockPriceBtn.style.display = 'none';
                }

            } catch (error) {
                console.error('Error fetching stock price:', error);
                stockPriceResult.textContent = `Failed to fetch price for ${symbol}. Error: ${error.message}`;
                copyStockPriceBtn.style.display = 'none';
            }
        });
    }

    if (copyStockPriceBtn) {
        copyStockPriceBtn.addEventListener('click', () => {
            if (stockPriceResult && stockPriceResult.textContent) {
                navigator.clipboard.writeText(stockPriceResult.textContent.replace('(Data is mock/placeholder - integrate real API)', ''))
                    .then(() => {
                        stockPriceResult.textContent += '\n(Copied to clipboard!)';
                    })
                    .catch(err => {
                        console.error('Failed to copy stock price:', err);
                        stockPriceResult.textContent = 'Failed to copy price.';
                    });
            }
        });
        copyStockPriceBtn.style.display = 'none'; // Hide initially
    }
});