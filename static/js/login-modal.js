// login-modal.js
// Handles showing/hiding the login modal and form submission

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('login-modal');
  const openBtns = document.querySelectorAll('.btn-login');
  const closeBtn = document.getElementById('close-login-modal');
  const overlay = document.getElementById('login-modal-overlay');

  openBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      modal.classList.add('show');
      overlay.classList.add('show');
    });
  });

  closeBtn.addEventListener('click', function () {
    modal.classList.remove('show');
    overlay.classList.remove('show');
  });

  overlay.addEventListener('click', function () {
    modal.classList.remove('show');
    overlay.classList.remove('show');
  });

  // Optional: ESC key closes modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      modal.classList.remove('show');
      overlay.classList.remove('show');
    }
  });

  // Handle login form submission (same as login.html)
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const messageDiv = document.getElementById('loginMessage');
      const formData = {
        username_or_email: this.username_or_email.value,
        password: this.password.value
      };
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (result.success) {
          messageDiv.textContent = 'Login successful! Redirecting...';
          messageDiv.style.color = '#4ade80';
          if (result.role === 'admin') {
            window.location.href = 'admin_dashboard';
          } else if (result.role === 'resident') {
            window.location.href = 'resident_dashboard';
          }
        } else {
          messageDiv.textContent = result.error || 'Login failed.';
          messageDiv.style.color = '#f87171';
        }
      } catch (error) {
        messageDiv.textContent = 'Server error. Please try again later.';
        messageDiv.style.color = '#f87171';
        console.error('Fetch error:', error);
      }
    });
  }

  // Hide login modal if opening signup modal
  document.querySelectorAll('.btn-signup').forEach(btn => {
    btn.addEventListener('click', function () {
      modal.classList.remove('show');
      overlay.classList.remove('show');
      // Also hide login overlay if present
      const signupModal = document.getElementById('signup-modal');
      const signupOverlay = document.getElementById('signup-modal-overlay');
      if (signupModal && signupOverlay) {
        signupModal.classList.add('show');
        signupOverlay.classList.add('show');
      }
    });
  });
  // Hide signup modal if opening login modal from signup
  document.querySelectorAll('.btn-login').forEach(btn => {
    btn.addEventListener('click', function () {
      const signupModal = document.getElementById('signup-modal');
      const signupOverlay = document.getElementById('signup-modal-overlay');
      if (signupModal && signupOverlay) {
        signupModal.classList.remove('show');
        signupOverlay.classList.remove('show');
      }
      modal.classList.add('show');
      overlay.classList.add('show');
    });
  });
});
