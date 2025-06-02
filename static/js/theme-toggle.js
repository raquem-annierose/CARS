// theme-toggle.js
// Simple dark/light mode toggle for CARS

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggle-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.classList.toggle('dark', mode === 'dark');
    document.body.classList.toggle('light', mode === 'light');
    localStorage.setItem('theme', mode);
    toggleBtn.textContent = mode === 'dark' ? '☀️' : '🌙';
    // Also update signup modal for dark/light mode
    const signupModal = document.getElementById('signup-modal');
    if (signupModal) {
      signupModal.classList.toggle('dark', mode === 'dark');
      signupModal.classList.toggle('light', mode === 'light');
    }
    // Also update login modal for dark/light mode
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
      loginModal.classList.toggle('dark', mode === 'dark');
      loginModal.classList.toggle('light', mode === 'light');
    }
  }

  // Initial theme
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  toggleBtn.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
});
