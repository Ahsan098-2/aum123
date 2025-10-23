document.addEventListener('DOMContentLoaded', () => {
    const cryptoName = document.getElementById('cryptoName');
    const checkCryptoPriceBtn = document.getElementById('checkCryptoPriceBtn');
    const copyCryptoPriceBtn = document.getElementById('copyCryptoPriceBtn');
    const cryptoPriceResult = document.getElementById('cryptoPriceResult');

    if (checkCryptoPriceBtn) {
        checkCryptoPriceBtn.addEventListener('click', async () => {
            const coin = cryptoName.value.trim().toLowerCase();
            if (!coin) {
                cryptoPriceResult.textContent = 'Please enter a cryptocurrency name (e.g., Bitcoin, Ethereum).';
                return;
            }

            cryptoPriceResult.textContent = `Fetching price for ${coin}...`;

            // === Placeholder for a real Cryptocurrency API ===
            // You would replace this with a fetch request to a real API like CoinGecko, CoinMarketCap, Binance API, etc.
            // Remember to handle API keys securely and respect rate limits.
            try {
                // Example using CoinGecko API (public, usually no API key needed for simple price)
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
                if (!response.ok) {
                    throw new Error(`API error! Status: ${response.status}`);
                }
                const data = await response.json();

                if (data && data[coin] && data[coin].usd) {
                    const price = data[coin].usd;
                    cryptoPriceResult.innerHTML = `
                        <p>${coin.charAt(0).toUpperCase() + coin.slice(1)} Price: <strong>$${price.toFixed(2)} USD</strong></p>
                        <small>(Data from CoinGecko)</small>
                    `;
                    copyCryptoPriceBtn.style.display = 'inline-block';
                } else {
                    cryptoPriceResult.textContent = `Cryptocurrency "${coin}" not found or no data available.`;
                    copyCryptoPriceBtn.style.display = 'none';
                }

            } catch (error) {
                console.error('Error fetching crypto price:', error);
                cryptoPriceResult.textContent = `Failed to fetch price for ${coin}. Error: ${error.message}`;
                copyCryptoPriceBtn.style.display = 'none';
            }
        });
    }

    if (copyCryptoPriceBtn) {
        copyCryptoPriceBtn.addEventListener('click', () => {
            if (cryptoPriceResult && cryptoPriceResult.textContent) {
                // Remove the "Data from CoinGecko" part for copying
                const textToCopy = cryptoPriceResult.textContent.replace('(Data from CoinGecko)', '').trim();
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        cryptoPriceResult.textContent += '\n(Copied to clipboard!)';
                    })
                    .catch(err => {
                        console.error('Failed to copy crypto price:', err);
                        cryptoPriceResult.textContent = 'Failed to copy price.';
                    });
            }
        });
        copyCryptoPriceBtn.style.display = 'none'; // Hide initially
    }
});