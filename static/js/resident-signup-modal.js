// signup-modal.js
// Handles showing/hiding the signup modal and form submission

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('signup-modal');
  const openBtns = document.querySelectorAll('.btn-signup');
  const closeBtn = document.getElementById('close-signup-modal');
  const overlay = document.getElementById('signup-modal-overlay');

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

  // Handle signup form submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const messageBox = document.getElementById('signupMessage');
      // Only submit if on last step
      if (currentStep !== steps.length - 1) return;
      // Validate required fields
      const contact = this.contact_number.value.trim();
      const country = this.country_code.value;
      if (!contact) {
        messageBox.textContent = 'Contact number is required.';
        messageBox.style.color = '#f87171';
        return;
      }
      if (!country) {
        messageBox.textContent = 'Please select a country.';
        messageBox.style.color = '#f87171';
        return;
      }
      const formData = {
        username: this.username.value,
        email: this.email.value,
        password: this.password.value,
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        middle_name: this.middle_name.value,
        unit_number: this.unit_number.value,
        building: this.building.value,
        contact_number: contact,
        country_code: country
      };
      try {
        const response = await fetch('http://localhost:5000/api/register/resident', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (result.success) {
          messageBox.textContent = 'Account created successfully! You may now log in.';
          messageBox.style.color = '#4ade80';
        } else {
          messageBox.textContent = result.error || 'Sign up failed.';
          messageBox.style.color = '#f87171';
        }
      } catch (error) {
        messageBox.textContent = 'Server error. Please try again later.';
        messageBox.style.color = '#f87171';
        console.error('Fetch error:', error);
      }
    });
  }

  // Multi-step signup logic
  const steps = Array.from(document.querySelectorAll('.signup-step'));
  let currentStep = 0;

  // Stepper update
  function updateStepper() {
    document.querySelectorAll('.signup-stepper-dot').forEach((dot, i) => {
      if (i === currentStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  // Call on step change
  function showStep(idx) {
    steps.forEach((step, i) => {
      step.style.display = i === idx ? '' : 'none';
    });
    currentStep = idx;
    updateStepper();
  }

  // Initial stepper state
  updateStepper();

  // Next/Back button handlers
  document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', async function () {
      const msg = document.getElementById('signupMessage');
      msg.textContent = '';
      if (currentStep === 0) {
        // Step 1: validate username, email, password, confirm password
        const username = signupForm.username.value.trim();
        const email = signupForm.email.value.trim();
        const pw = signupForm.password.value;
        const cpw = signupForm.confirm_password.value;
        let error = '';
        if (username.length !== 8) {
          error = 'Username must be exactly 8 characters.';
        } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
          error = 'Username must be alphanumeric.';
        } else if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
          error = 'Invalid email format.';
        } else if (pw.length < 8 || !/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) {
          error = 'Password must be at least 8 characters and include letters and numbers.';
        } else if (pw !== cpw) {
          error = 'Passwords do not match.';
        }
        if (error) {
          msg.textContent = error;
          msg.style.color = '#f87171';
          return;
        }
        // Check username/email existence via API
        try {
          const res = await fetch('http://localhost:5000/api/register/validate-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password: pw })
          });
          const result = await res.json();
          if (!res.ok) {
            if (result.errors && result.errors.username) {
              msg.textContent = result.errors.username;
              msg.style.color = '#f87171';
              return;
            }
            if (result.errors && result.errors.email) {
              msg.textContent = result.errors.email;
              msg.style.color = '#f87171';
              return;
            }
            msg.textContent = 'Please check your input.';
            msg.style.color = '#f87171';
            return;
          }
          // Check if username/email already exists
          const existsRes = await fetch('http://localhost:5000/api/register/check-exists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
          });
          const existsResult = await existsRes.json();
          if (existsResult.username_exists) {
            msg.textContent = 'Username already exists.';
            msg.style.color = '#f87171';
            return;
          }
          if (existsResult.email_exists) {
            msg.textContent = 'Email already exists.';
            msg.style.color = '#f87171';
            return;
          }
        } catch (err) {
          msg.textContent = 'Server error. Please try again.';
          msg.style.color = '#f87171';
          return;
        }
      }
      // Step 2: validate names, unit, building
      if (currentStep === 1) {
        const firstName = signupForm.first_name.value.trim();
        const lastName = signupForm.last_name.value.trim();
        const unit = signupForm.unit_number.value.trim();
        const building = signupForm.building.value.trim();
        if (!firstName.match(/^[a-zA-Z\s]+$/)) {
          msg.textContent = 'First name must contain only letters and spaces.';
          msg.style.color = '#f87171';
          return;
        }
        if (!lastName.match(/^[a-zA-Z\s]+$/)) {
          msg.textContent = 'Last name must contain only letters and spaces.';
          msg.style.color = '#f87171';
          return;
        }
        if (!unit) {
          msg.textContent = 'Unit number is required.';
          msg.style.color = '#f87171';
          return;
        }
        if (!building) {
          msg.textContent = 'Building is required.';
          msg.style.color = '#f87171';
          return;
        }
      }
      if (currentStep < steps.length - 1) showStep(currentStep + 1);
    });
  });
  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', function () {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  // Reset to step 1 on open/close
  openBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      showStep(0);
      document.getElementById('signupMessage').textContent = '';
    });
  });
  closeBtn.addEventListener('click', function () {
    showStep(0);
    document.getElementById('signupMessage').textContent = '';
  });
  overlay.addEventListener('click', function () {
    showStep(0);
    document.getElementById('signupMessage').textContent = '';
  });

  // Password view toggle (modern SVG icon)
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const svg = btn.querySelector('.eye-icon');
      if (input && svg) {
        if (input.type === 'password') {
          input.type = 'text';
          // Change to closed eye (hide pupil)
          svg.querySelector('.eye-pupil').setAttribute('fill', '#b0b8c5');
          svg.querySelector('.eye-pupil').setAttribute('stroke', '#b0b8c5');
        } else {
          input.type = 'password';
          // Change to open eye (show pupil)
          svg.querySelector('.eye-pupil').setAttribute('fill', 'none');
          svg.querySelector('.eye-pupil').setAttribute('stroke', 'currentColor');
        }
      }
    });
  });

  // Phone input: initialize intl-tel-input if available
  if (window.intlTelInput) {
    const phoneInput = document.querySelector('.phone-input');
    if (phoneInput) {
      window.intlTelInput(phoneInput, {
        initialCountry: 'ph',
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js'
      });
    }
  }
});
