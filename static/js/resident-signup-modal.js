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
      // Validate required fields for contact - kept as backend doesn't strictly require them initially
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
      msg.textContent = ''; // Clear previous messages

      if (currentStep === 0) {
        // Step 1: validate username, email, password, confirm password
        const username = signupForm.username.value.trim();
        const email = signupForm.email.value.trim();
        const pw = signupForm.password.value;
        const cpw = signupForm.confirm_password.value;
        
        if (pw !== cpw) {
          msg.textContent = 'Passwords do not match.';
          msg.style.color = '#f87171';
          return;
        }

        // Validate fields via API
        try {
          const validateRes = await fetch('http://localhost:5000/api/validate-signup', { // Corrected API endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password: pw })
          });
          const validateResult = await validateRes.json();

          if (!validateRes.ok) {
            let errorMsg = 'Please check your input.';
            if (validateResult.errors) {
              if (validateResult.errors.username) errorMsg = validateResult.errors.username;
              else if (validateResult.errors.email) errorMsg = validateResult.errors.email;
              else if (validateResult.errors.password) errorMsg = validateResult.errors.password;
              // Use the first error found if multiple, or a general one
              else errorMsg = Object.values(validateResult.errors)[0] || errorMsg;
            }
            msg.textContent = errorMsg;
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
          msg.textContent = 'Server error during validation. Please try again.';
          msg.style.color = '#f87171';
          console.error('Validation fetch error:', err);
          return;
        }
      } else if (currentStep === 1) {
        // Step 2: validate names (first_name, last_name) via API
        const firstName = signupForm.first_name.value.trim();
        const lastName = signupForm.last_name.value.trim();
        // Middle name is optional and typically doesn't have strict format validation here.
        // Unit number and building are for the next step.

        try {
          const validateRes = await fetch('http://localhost:5000/api/validate-signup', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              first_name: firstName, 
              last_name: lastName
              // Do NOT send unit_number or building here
            })
          });
          const validateResult = await validateRes.json();

          if (!validateRes.ok) {
            let errorMsg = 'Please check your input for personal details.';
             if (validateResult.errors) {
              if (validateResult.errors.first_name) errorMsg = validateResult.errors.first_name;
              else if (validateResult.errors.last_name) errorMsg = validateResult.errors.last_name;
              // Do not check for unit_number or building errors here
              else errorMsg = Object.values(validateResult.errors)[0] || errorMsg;
            }
            msg.textContent = errorMsg;
            msg.style.color = '#f87171';
            return;
          }
        } catch (err) {
          msg.textContent = 'Server error during validation. Please try again.';
          msg.style.color = '#f87171';
          console.error('Validation fetch error:', err);
          return;
        }
      }
      // If all validations pass for the current step, proceed
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
