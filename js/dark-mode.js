// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Check saved preference or system preference
function initDarkMode() {
  const savedMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedMode === 'true' || (!savedMode && prefersDark)) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}

// Enable Dark Mode
function enableDarkMode() {
  htmlElement.setAttribute('data-theme', 'dark');
  if (darkModeToggle) {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
  }
  localStorage.setItem('darkMode', 'true');
}

// Disable Dark Mode
function disableDarkMode() {
  htmlElement.removeAttribute('data-theme');
  if (darkModeToggle) {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
  localStorage.setItem('darkMode', 'false');
}

// Toggle Dark Mode
function toggleDarkMode() {
  const isDark = htmlElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

// Add event listener
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', toggleDarkMode);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDarkMode);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('darkMode')) {
    if (e.matches) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }
});
