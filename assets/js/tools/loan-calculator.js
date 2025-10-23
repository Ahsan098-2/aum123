document.addEventListener('DOMContentLoaded', () => {
    const loanAmount = document.getElementById('loanAmount');
    const loanInterest = document.getElementById('loanInterest');
    const loanTenure = document.getElementById('loanTenure');
    const calculateLoanBtn = document.getElementById('calculateLoanBtn');
    const copyLoanBtn = document.getElementById('copyLoanBtn');
    const loanResult = document.getElementById('loanResult');

    if (calculateLoanBtn) {
        calculateLoanBtn.addEventListener('click', () => {
            const principal = parseFloat(loanAmount.value);
            const annualInterestRate = parseFloat(loanInterest.value);
            const loanTermMonths = parseInt(loanTenure.value);

            if (isNaN(principal) || isNaN(annualInterestRate) || isNaN(loanTermMonths) ||
                principal <= 0 || annualInterestRate < 0 || loanTermMonths <= 0) {
                loanResult.textContent = 'Please enter valid numbers for all fields.';
                return;
            }

            const monthlyInterestRate = (annualInterestRate / 100) / 12;

            let monthlyPayment = 0;
            if (monthlyInterestRate === 0) {
                monthlyPayment = principal / loanTermMonths;
            } else {
                monthlyPayment = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
                               (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
            }

            const totalPayment = monthlyPayment * loanTermMonths;
            const totalInterest = totalPayment - principal;

            loanResult.innerHTML = `
                <p>Monthly Payment: <strong>$${monthlyPayment.toFixed(2)}</strong></p>
                <p>Total Payment: <strong>$${totalPayment.toFixed(2)}</strong></p>
                <p>Total Interest: <strong>$${totalInterest.toFixed(2)}</strong></p>
            `;
            copyLoanBtn.style.display = 'inline-block';
        });
    }

    if (copyLoanBtn) {
        copyLoanBtn.addEventListener('click', () => {
            if (loanResult && loanResult.textContent) {
                navigator.clipboard.writeText(loanResult.textContent)
                    .then(() => {
                        loanResult.textContent += '\n(Copied to clipboard!)';
                    })
                    .catch(err => {
                        console.error('Failed to copy loan details:', err);
                        loanResult.textContent = 'Failed to copy details.';
                    });
            }
        });
        copyLoanBtn.style.display = 'none'; // Hide initially
    }
});