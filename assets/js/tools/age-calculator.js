// Tool: Age Calculator (refactored)
function calculateAge() {
  const birthDateInput = document.getElementById("birthDate");
  const resultEl = document.getElementById("ageResult");
  if (!birthDateInput || !resultEl) return;

  const birthValue = birthDateInput.value;
  if (!birthValue) {
    resultEl.textContent = "⚠️ Please select your date of birth.";
    delete resultEl.dataset.age;
    return null;
  }

  const birthDate = new Date(birthValue);
  if (isNaN(birthDate.getTime())) {
    resultEl.textContent = "⚠️ Invalid date.";
    delete resultEl.dataset.age;
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const message = `🎉 Your age is ${age} years.`;
  resultEl.textContent = message;
  resultEl.dataset.age = age;
  return age;
}

function copyAgeToClipboard() {
  const resultEl = document.getElementById('ageResult');
  if (!resultEl) return;
  const age = resultEl.dataset.age;
  if (!age && age !== 0) {
    resultEl.textContent = 'No age to copy. Calculate first.';
    return;
  }

  const text = `Age: ${age} years`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      resultEl.textContent = 'Copied to clipboard ✅';
      setTimeout(() => (resultEl.textContent = `🎉 Your age is ${age} years.`), 1200);
    }).catch(() => {
      resultEl.textContent = 'Unable to copy to clipboard.';
    });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      resultEl.textContent = 'Copied to clipboard ✅';
    } catch (e) {
      resultEl.textContent = 'Unable to copy to clipboard.';
    }
    textarea.remove();
    setTimeout(() => (resultEl.textContent = `🎉 Your age is ${age} years.`), 1200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calculateAgeBtn');
  const copyBtn = document.getElementById('copyAgeBtn');
  const birthInput = document.getElementById('birthDate');

  if (calcBtn) calcBtn.addEventListener('click', calculateAge);
  if (copyBtn) copyBtn.addEventListener('click', copyAgeToClipboard);
  if (birthInput) {
    birthInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculateAge();
      }
    });
  }
});
