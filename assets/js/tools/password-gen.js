// Tool: Password Generator
function generatePassword() {
  const lengthInput = document.getElementById("passLength");
  const result = document.getElementById("passwordResult");

  if (!lengthInput || !result) return;

  // Validate input
  const length = parseInt(lengthInput.value, 10);
  if (isNaN(length) || length < 4 || length > 128) {
    result.innerText = "Please choose a length between 4 and 128.";
    return;
  }

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  // Ensure password contains at least one of each type for stronger passwords
  const allChars = upper + lower + digits + symbols;

  let passwordChars = [];
  // start with one guaranteed character of each type
  passwordChars.push(upper[Math.floor(Math.random() * upper.length)]);
  passwordChars.push(lower[Math.floor(Math.random() * lower.length)]);
  passwordChars.push(digits[Math.floor(Math.random() * digits.length)]);
  passwordChars.push(symbols[Math.floor(Math.random() * symbols.length)]);

  for (let i = passwordChars.length; i < length; i++) {
    const idx = Math.floor(Math.random() * allChars.length);
    passwordChars.push(allChars[idx]);
  }

  // Shuffle the generated characters
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  const password = passwordChars.join("");
  result.innerText = `🔐 ${password}`;
  result.dataset.password = password;
  return password;
}

function copyPasswordToClipboard() {
  const result = document.getElementById("passwordResult");
  if (!result) return;
  const pw = result.dataset.password;
  if (!pw) {
    result.innerText = "No password to copy. Generate one first.";
    return;
  }

  // Use Clipboard API when available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(pw).then(() => {
      result.innerText = "Copied to clipboard ✅";
      // restore shown password after a moment
      setTimeout(() => (result.innerText = `🔐 ${pw}`), 1200);
    }, () => {
      result.innerText = "Unable to copy to clipboard.";
    });
  } else {
    // fallback
    const textarea = document.createElement('textarea');
    textarea.value = pw;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      result.innerText = "Copied to clipboard ✅";
    } catch (e) {
      result.innerText = "Unable to copy to clipboard.";
    }
    textarea.remove();
    setTimeout(() => (result.innerText = `🔐 ${pw}`), 1200);
  }
}

// Wire up buttons if running in a browser environment
document.addEventListener('DOMContentLoaded', () => {
  const genBtn = document.getElementById('generatePassBtn');
  const copyBtn = document.getElementById('copyPassBtn');
  const lengthInput = document.getElementById('passLength');

  if (genBtn) genBtn.addEventListener('click', generatePassword);
  if (copyBtn) copyBtn.addEventListener('click', copyPasswordToClipboard);

  // allow Enter key inside the number input to generate
  if (lengthInput) {
    lengthInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        generatePassword();
      }
    });
  }
});