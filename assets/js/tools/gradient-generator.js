document.addEventListener('DOMContentLoaded', () => {
    const color1Input = document.getElementById('gradientColor1');
    const color2Input = document.getElementById('gradientColor2');
    const gradientDirection = document.getElementById('gradientDirection');
    const generateGradientBtn = document.getElementById('generateGradientBtn');
    const copyGradientBtn = document.getElementById('copyGradientBtn');
    const gradientPreview = document.getElementById('gradientPreview'); // Assuming a div for preview
    const gradientResult = document.getElementById('gradientResult');

    function updateGradient() {
        const color1 = color1Input.value;
        const color2 = color2Input.value;
        const direction = gradientDirection.value;

        const cssGradient = `linear-gradient(${direction}, ${color1}, ${color2})`;

        if (gradientPreview) {
            gradientPreview.style.background = cssGradient;
        }
        if (gradientResult) {
            gradientResult.textContent = cssGradient;
        }
        if (copyGradientBtn) {
            copyGradientBtn.style.display = 'inline-block';
        }
    }

    if (generateGradientBtn) {
        generateGradientBtn.addEventListener('click', updateGradient);
    }

    // Update gradient live as colors/direction change
    if (color1Input) color1Input.addEventListener('input', updateGradient);
    if (color2Input) color2Input.addEventListener('input', updateGradient);
    if (gradientDirection) gradientDirection.addEventListener('change', updateGradient);

    if (copyGradientBtn) {
        copyGradientBtn.addEventListener('click', () => {
            if (gradientResult && gradientResult.textContent) {
                navigator.clipboard.writeText(gradientResult.textContent)
                    .then(() => {
                        gradientResult.textContent = 'Copied to clipboard!';
                        setTimeout(() => updateGradient(), 1500); // Revert text after a delay
                    })
                    .catch(err => {
                        console.error('Failed to copy gradient CSS:', err);
                        gradientResult.textContent = 'Failed to copy CSS.';
                    });
            }
        });
        copyGradientBtn.style.display = 'none'; // Hide initially
    }

    // Initial gradient display
    updateGradient();
});