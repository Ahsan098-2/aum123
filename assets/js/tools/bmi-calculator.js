document.addEventListener('DOMContentLoaded', () => {
    // Check if the BMI tool elements exist on the page (either in main content or modal)
    const bmiWeightInput = document.getElementById('bmiWeight');
    const bmiHeightInput = document.getElementById('bmiHeight');
    const calcBmiBtn = document.getElementById('calcBmiBtn');
    const copyBmiBtn = document.getElementById('copyBmiBtn');
    const bmiResult = document.getElementById('bmiResult');

    if (calcBmiBtn) { // Only proceed if the button for BMI calculator exists
        calcBmiBtn.addEventListener('click', () => {
            const weight = parseFloat(bmiWeightInput.value);
            const height = parseFloat(bmiHeightInput.value) / 100; // Convert cm to meters

            if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                bmiResult.textContent = 'Please enter valid weight and height.';
                bmiResult.style.color = 'var(--accent-color)'; // Use accent for error
                return;
            }

            const bmi = weight / (height * height);
            let category = '';

            if (bmi < 18.5) {
                category = 'Underweight';
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                category = 'Normal weight';
            } else if (bmi >= 25 && bmi <= 29.9) {
                category = 'Overweight';
            } else {
                category = 'Obese';
            }

            bmiResult.textContent = `Your BMI: ${bmi.toFixed(2)} (${category})`;
            bmiResult.style.color = 'var(--primary-color)'; // Use primary for success
        });
    }

    if (copyBmiBtn) { // Only proceed if the copy button for BMI calculator exists
        copyBmiBtn.addEventListener('click', () => {
            if (bmiResult.textContent && bmiResult.textContent.includes('Your BMI')) {
                navigator.clipboard.writeText(bmiResult.textContent)
                    .then(() => {
                        const originalText = copyBmiBtn.textContent;
                        copyBmiBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyBmiBtn.textContent = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy BMI result: ', err);
                        alert('Failed to copy result.');
                    });
            } else {
                alert('Calculate BMI first to copy the result.');
            }
        });
    }
});