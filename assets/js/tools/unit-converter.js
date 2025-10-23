document.addEventListener('DOMContentLoaded', () => {
    const convertValue = document.getElementById('convertValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertUnitBtn = document.getElementById('convertUnitBtn');
    const copyUnitBtn = document.getElementById('copyUnitBtn');
    const unitResult = document.getElementById('unitResult');

    // Define conversion rates (simple example for length)
    const conversionRates = {
        'meter': {
            'meter': 1, 'kilometer': 0.001, 'centimeter': 100, 'millimeter': 1000,
            'mile': 0.000621371, 'yard': 1.09361, 'foot': 3.28084, 'inch': 39.3701
        },
        'kilometer': { /* ... and so on for all units */ },
        // ... extend for other unit categories and their conversions
    };

    function performConversion() {
        const value = parseFloat(convertValue.value);
        const from = fromUnit.value;
        const to = toUnit.value;

        if (isNaN(value)) {
            unitResult.textContent = 'Please enter a valid number.';
            return;
        }

        if (from === to) {
            unitResult.textContent = `${value} ${from} is ${value} ${to}`;
            copyUnitBtn.style.display = 'inline-block';
            return;
        }

        if (conversionRates[from] && conversionRates[from][to]) {
            const converted = value * conversionRates[from][to];
            unitResult.textContent = `${value} ${from} is ${converted.toFixed(4)} ${to}`;
            copyUnitBtn.style.display = 'inline-block';
        } else {
            unitResult.textContent = 'Conversion not supported for selected units or categories (expand conversionRates).';
            copyUnitBtn.style.display = 'none';
        }
    }


    if (convertUnitBtn) {
        convertUnitBtn.addEventListener('click', performConversion);
    }
    // Also convert on input change for dynamic updates
    if (convertValue) convertValue.addEventListener('input', performConversion);
    if (fromUnit) fromUnit.addEventListener('change', performConversion);
    if (toUnit) toUnit.addEventListener('change', performConversion);


    if (copyUnitBtn) {
        copyUnitBtn.addEventListener('click', () => {
            if (unitResult && unitResult.textContent) {
                navigator.clipboard.writeText(unitResult.textContent)
                    .then(() => {
                        unitResult.textContent += ' (Copied!)';
                        setTimeout(performConversion, 1500); // Revert text after a delay
                    })
                    .catch(err => {
                        console.error('Failed to copy conversion result:', err);
                        unitResult.textContent = 'Failed to copy.';
                    });
            }
        });
        copyUnitBtn.style.display = 'none'; // Hide initially
    }

    // Initial conversion on load if values are present
    if (convertValue.value && fromUnit.value && toUnit.value) {
        performConversion();
    }
});