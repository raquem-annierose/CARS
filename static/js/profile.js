// PROFILE AVATAR LOGIC
  const profileAvatarImg = document.getElementById('profileAvatarImg');
  const profileUsername = document.getElementById('profileUsername');
  const profileSection = document.querySelector('.profile-section');

  // Fetch and display profile username only in header
  function showHeaderProfileUsername() {
    fetch('/api/profile/username', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const profileUsername = document.getElementById('profileUsername');
        if (data && data.username) {
          profileUsername.textContent = data.username;
        } else {
          profileUsername.textContent = '';
        }
      });
  }

  document.addEventListener('DOMContentLoaded', function() {
    showHeaderProfileUsername();

    const profileSection = document.getElementById('profileSection');
    const dropdownArrow = document.getElementById('profileDropdownArrow');
    const dropdownMenu = document.getElementById('profileDropdownMenu');

    if (profileSection) {
      // Show username by default with a slight delay for a nice effect
      setTimeout(function() {
        profileSection.classList.add('show-username');
        profileSection.setAttribute('title', 'Click to hide username');
      }, 200); // 400ms delay for smoothness
      // Username toggle: clicking avatar or username toggles username only
      function toggleUsername() {
        profileSection.classList.toggle('show-username');
        // Only update tooltip if not hovering arrow
        if (!profileSection.classList.contains('show-dropdown')) {
          if (profileSection.classList.contains('show-username')) {
            profileSection.setAttribute('title', 'Click to hide username');
          } else {
            profileSection.setAttribute('title', 'Click to show username');
          }
        }
      }
      profileAvatarImg.addEventListener('click', function(e) {
        toggleUsername();
      });
      profileUsername.addEventListener('click', function(e) {
        toggleUsername();
      });
      // Tooltip for dropdown arrow
      dropdownArrow.setAttribute('title', 'Click to show/hide dropdown menu');
      // Hide username when clicking outside
      document.addEventListener('click', function(e) {
        if (!profileSection.contains(e.target)) {
          profileSection.classList.remove('show-username');
          profileSection.setAttribute('title', 'Click to show username');
        }
      });
      // Dropdown toggle: clicking arrow toggles dropdown only
      dropdownArrow.addEventListener('click', function(e) {
        e.stopPropagation();
        profileSection.classList.toggle('show-dropdown');
        // No need to update profileSection title here
      });
      // Hide dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!profileSection.contains(e.target)) {
          profileSection.classList.remove('show-dropdown');
        }
      });
    }

    // Dropdown menu actions
    document.getElementById('profileMenuProfile').onclick = function(e) {
      e.preventDefault();
      // Open profile modal or section
      document.getElementById('profileEditModal').style.display = 'block';
      profileSection.classList.remove('show-dropdown');
      profileSection.classList.remove('show-username');
      dropdownMenu.style.display = 'none';
    };
    document.getElementById('profileMenuSettings').onclick = function(e) {
      e.preventDefault();
      // Show settings section
      document.getElementById('settings-section').style.display = 'block';
      profileSection.classList.remove('show-dropdown');
      profileSection.classList.remove('show-username');
      dropdownMenu.style.display = 'none';
    };
    document.getElementById('profileMenuLogout').onclick = function(e) {
      e.preventDefault();
      // Trigger logout (simulate click on sidebar logout)
      document.getElementById('logoutBtn').click();
      profileSection.classList.remove('show-dropdown');
      profileSection.classList.remove('show-username');
      dropdownMenu.style.display = 'none';
    };
  });