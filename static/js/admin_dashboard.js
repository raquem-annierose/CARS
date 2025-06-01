// admin_dashboard.js
// Modern dashboard interactivity for admin panel

document.addEventListener('DOMContentLoaded', () => {
  // Fetch profile info for sidebar
  fetch('/api/login/profile', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data && data.username) {
        profileUsername.textContent = data.username;
        if (data.avatar_url) {
          // Use secure backend route for avatar
          // If avatar_url is not null, get user_id from session or API
          fetch('/api/session', { credentials: 'include' })
            .then(res => res.json())
            .then(sessionData => {
              if (sessionData && sessionData.user_id) {
                profileAvatarImg.src = `/api/profile/avatar/${sessionData.user_id}`;
              } else {
                profileAvatarImg.src = '/static/resources/profile/default-avatar.png';
              }
            });
        } else {
          profileAvatarImg.src = '/static/resources/profile/default-avatar.png';
        }
      }
    });

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

  // PIE CHART DASHBOARD
  function renderDashboardPieChart(data) {
    const ctx = document.getElementById('dashboardPieChart').getContext('2d');
    if (window.dashboardPieChartInstance) {
      window.dashboardPieChartInstance.destroy();
    }
    window.dashboardPieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Reservations Today',
          'Active Residents',
          'Pending Amenity Approvals',
          'Payments Today',
          'Total Admins'
        ],
        datasets: [{
          data: [
            data.reservationsToday,
            data.activeResidents,
            data.pendingAmenities,
            data.paymentsToday,
            data.totalAdmins
          ],
          backgroundColor: [
            '#4F8EF7',
            '#43D9A3',
            '#F7B84F',
            '#F76C5E',
            '#A16AE8'
          ],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        responsive: false,
        maintainAspectRatio: false
      }
    });
  }

  // Fetch dashboard data and render chart and cards
  function fetchDashboardStats() {
    fetch('/api/admin/dashboard-stats', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        // Update card values
        animateValue('reservations-today', 0, data.reservations_today || 0, 1200);
        animateValue('active-residents', 0, data.active_residents || 0, 1200);
        animateValue('pending-amenities', 0, data.pending_amenities || 0, 1200);
        document.getElementById('payments-today').textContent = `${data.payments_today || 0} / ${data.payments_month || 0}`;
        animateValue('total-admins', 0, data.total_admins || 0, 1200);
        // Pie chart
        renderDashboardPieChart({
          reservationsToday: data.reservations_today || 0,
          activeResidents: data.active_residents || 0,
          pendingAmenities: data.pending_amenities || 0,
          paymentsToday: data.payments_today || 0,
          totalAdmins: data.total_admins || 0
        });
      });
  }

  // RESERVATION GRAPHS
  function renderReservationsAmenityChart(data) {
    const ctx = document.getElementById('reservationsAmenityChart').getContext('2d');
    if (window.reservationsAmenityChartInstance) {
      window.reservationsAmenityChartInstance.destroy();
    }
    window.reservationsAmenityChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: [
            '#4F8EF7', '#43D9A3', '#F7B84F', '#F76C5E', '#A16AE8', '#6C7A89', '#FFB347'
          ],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: { display: true, position: 'bottom' }
        },
        cutout: '65%',
        responsive: false,
        maintainAspectRatio: false
      }
    });
  }

  function fetchReservationGraphs() {
    // Example API endpoints, replace with your actual endpoints
    fetch('/api/admin/reservations-week', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        renderReservationsBarChart({
          labels: data.labels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
          values: data.values || [0,0,0,0,0,0,0]
        });
      });
    fetch('/api/admin/reservations-amenity', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        renderReservationsAmenityChart({
          labels: data.labels || ['Pool','Court','Function Room'],
          values: data.values || [0,0,0]
        });
      });
  }

  // RESERVATION BAR GRAPH
  function renderReservationsBarGraph(data) {
    const ctx = document.getElementById('reservationsBarGraph').getContext('2d');
    if (window.reservationsBarGraphInstance) {
      window.reservationsBarGraphInstance.destroy();
    }
    window.reservationsBarGraphInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Reservations',
          data: data.values,
          backgroundColor: '#4F8EF7',
          borderRadius: 8,
          maxBarThickness: 38
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#f0f4fa' } }
        },
        responsive: false,
        maintainAspectRatio: false
      }
    });
  }

  function fetchReservationsBarGraph() {
    fetch('/api/admin/reservations-week', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        renderReservationsBarGraph({
          labels: data.labels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
          values: data.values || [0,0,0,0,0,0,0]
        });
      });
  }

  // LATEST EVENTS
  function fetchLatestEvents() {
    fetch('/api/admin/latest-events', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('latest-events-list');
        if (!list) return;
        list.innerHTML = '';
        if (data && data.length > 0) {
          data.forEach(event => {
            const div = document.createElement('div');
            div.className = 'event-item';
            div.innerHTML = `<strong>${event.title}</strong> <span style="color:#6c7a89;font-size:0.95em;">(${event.date})</span><br><span>${event.description}</span>`;
            list.appendChild(div);
          });
        } else {
          list.innerHTML = '<div class="event-placeholder">No recent events.</div>';
        }
      });
  }

  // PROFILE AVATAR LOGIC
  const profileAvatarImg = document.getElementById('profileAvatarImg');
  const profileUsername = document.getElementById('profileUsername');
  const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
  const profileAvatarInput = document.getElementById('profileAvatarInput');

  // Profile modal logic (file-based avatar)
  const profileEditModal = document.getElementById('profileEditModal');
  const closeProfileModal = document.getElementById('closeProfileModal');
  const profileViewLink = document.querySelector('.profile-view-link');
  const modalProfileAvatarImg = document.getElementById('modalProfileAvatarImg');
  const modalProfileAvatarInput = document.getElementById('modalProfileAvatarInput');
  const modalChangeAvatarBtn = document.getElementById('modalChangeAvatarBtn');
  const modalProfileUsername = document.getElementById('modalProfileUsername');
  const profileEditForm = document.getElementById('profileEditForm');
  const profileModalMsg = document.getElementById('profileModalMsg');

  // --- FIX: Always use backend avatar_url for modal and cropper preview ---
  function openProfileEditModal() {
    fetch('/api/login/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && data.avatar_url) {
          modalProfileAvatarImg.src = data.avatar_url + '?t=' + Date.now();
        } else {
          modalProfileAvatarImg.src = '/static/resources/profile/default-avatar.png';
        }
        if (data && data.username) {
          modalProfileUsername.value = data.username;
        }
        profileModalMsg.style.display = 'none';
        profileEditModal.style.display = 'block';
      });
  }

  if (uploadAvatarBtn && modalProfileAvatarImg && profileEditModal && closeProfileModal && profileEditForm && profileUsername && profileAvatarImg) {
    uploadAvatarBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openProfileEditModal();
    });
    closeProfileModal.addEventListener('click', function() {
      profileEditModal.style.display = 'none';
    });
  }
  if (modalChangeAvatarBtn && modalProfileAvatarInput) {
    modalChangeAvatarBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modalProfileAvatarInput.click();
    });
  }
  // --- FIX: Cropper.js initialization null check ---
  let cropper = null;
  const cropperImage = document.getElementById('cropperImage');
  const cropperContainer = document.getElementById('cropperContainer');
  const cropImageBtn = document.getElementById('cropImageBtn');
  const croppedAvatarData = document.getElementById('croppedAvatarData');
  if (modalProfileAvatarInput && cropperImage && cropperContainer && cropImageBtn && croppedAvatarData) {
    modalProfileAvatarInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          cropperImage.src = e.target.result;
          cropperContainer.style.display = 'block';
          if (cropper) { cropper.destroy(); }
          cropper = new Cropper(cropperImage, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1,
            minContainerWidth: 220,
            minContainerHeight: 220
          });
        };
        reader.readAsDataURL(file);
      }
    });
    cropImageBtn.addEventListener('click', function() {
      if (cropper) {
        const canvas = cropper.getCroppedCanvas({ width: 220, height: 220 });
        const dataUrl = canvas.toDataURL('image/png');
        modalProfileAvatarImg.src = dataUrl;
        croppedAvatarData.value = dataUrl;
        cropper.destroy();
        cropper = null;
        cropperContainer.style.display = 'none';
      }
    });
  }

  // Save profile changes
  profileEditForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', modalProfileUsername.value);
    if (croppedAvatarData.value) {
      formData.append('cropped_avatar', croppedAvatarData.value);
    }
    fetch('/api/login/profile', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        updateSidebarProfile();
        // After update, reload avatar in modal for next open
        fetch('/api/login/profile', { credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            if (data && data.avatar_url) {
              modalProfileAvatarImg.src = data.avatar_url + '?t=' + Date.now();
            }
          });
        profileModalMsg.textContent = 'Profile updated!';
        profileModalMsg.style.display = 'block';
        setTimeout(() => { profileModalMsg.style.display = 'none'; profileEditModal.style.display = 'none'; }, 1500);
      } else {
        profileModalMsg.textContent = data.error || 'Update failed.';
        profileModalMsg.style.display = 'block';
      }
    })
    .catch(() => {
      profileModalMsg.textContent = 'Update failed.';
      profileModalMsg.style.display = 'block';
    });
  });

  // View Profile loads info in main panel
  profileViewLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.panel-section').forEach(section => section.style.display = 'none');
    let profileSection = document.getElementById('profile-view-section');
    if (!profileSection) {
      profileSection = document.createElement('section');
      profileSection.id = 'profile-view-section';
      profileSection.className = 'panel-section';
      profileSection.innerHTML = `
        <h2>Profile Information</h2>
        <div style="display:flex;align-items:center;gap:24px;margin-bottom:24px;">
          <img src="${profileAvatarImg.src}" alt="Profile Avatar" style="width:90px;height:90px;border-radius:50%;object-fit:cover;">
          <div>
            <div style="font-size:1.2rem;font-weight:600;">${profileUsername.textContent}</div>
          </div>
        </div>
        <p style="color:#888;">To edit your profile, click the ✏️ button beside your avatar.</p>
      `;
      document.querySelector('.main-content').appendChild(profileSection);
    } else {
      profileSection.style.display = 'block';
      profileSection.querySelector('img').src = profileAvatarImg.src;
      profileSection.querySelector('div > div').textContent = profileUsername.textContent;
    }
    document.getElementById('main-title').textContent = 'Profile';
    document.getElementById('main-title').style.display = 'block';
  });

  // Update sidebar profile info
  function updateSidebarProfile() {
    fetch('/api/login/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && data.username) {
          profileUsername.textContent = data.username;
          if (data.avatar_url) {
            // Use secure backend route for avatar
            fetch('/api/session', { credentials: 'include' })
              .then(res => res.json())
              .then(sessionData => {
                if (sessionData && sessionData.user_id) {
                  profileAvatarImg.src = `/api/profile/avatar/${sessionData.user_id}?t=${Date.now()}`;
                } else {
                  profileAvatarImg.src = '/static/resources/profile/default-avatar.png';
                }
              });
          } else {
            profileAvatarImg.src = '/static/resources/profile/default-avatar.png';
          }
        }
      });
  }

  // On page load, fetch sidebar profile
  updateSidebarProfile();

  if (document.getElementById('dashboardPieChart')) {
    fetchDashboardStats();
  }
  if (document.getElementById('reservationsBarChart') && document.getElementById('reservationsAmenityChart')) {
    fetchReservationGraphs();
  }
  if (document.getElementById('reservationsBarGraph')) {
    fetchReservationsBarGraph();
  }
  if (document.getElementById('latest-events-list')) {
    fetchLatestEvents();
  }
});
