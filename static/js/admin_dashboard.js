// admin_dashboard.js
// Modern dashboard interactivity for admin panel

document.addEventListener('DOMContentLoaded', () => {
  // Fetch session info
  fetch('/api/session', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.logged_in) {
        document.getElementById('loggedInUser').textContent = `Logged in as: ${data.username}`;
      } else {
        document.getElementById('loggedInUser').textContent = 'Not logged in';
      }
    });

  // Sidebar menu click handler for dynamic title and section display
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
      if (this.classList.contains('logout')) return; // skip logout
      e.preventDefault();
      document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      let title = this.textContent.trim();
      document.getElementById('main-title').textContent = title;
      document.getElementById('main-title').style.display = (title === 'Dashboard') ? 'none' : 'block';

      // Hide all sections and show the selected one
      document.querySelectorAll('.panel-section').forEach(section => {
        section.style.display = 'none';
      });
      let sectionId = this.getAttribute('href');
      if (sectionId && sectionId !== '#' && sectionId !== null) {
        sectionId = sectionId.replace('#', '') + '-section';
        let section = document.getElementById(sectionId);
        if (section) section.style.display = 'block';
      } else {
        document.getElementById('dashboard-section').style.display = 'block';
      }
    });
  });

  // Logout handler
  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/';
          }
        });
    }
  });

  // Example: Animate dashboard card values (for demo)
  function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  }

  // Demo values (replace with real API calls)
  animateValue('reservations-today', 0, 12, 1200);
  animateValue('active-residents', 0, 87, 1200);
  animateValue('pending-amenities', 0, 3, 1200);
  document.getElementById('payments-today').textContent = '₱2,500 / ₱45,000';
  animateValue('total-admins', 0, 5, 1200);
});
