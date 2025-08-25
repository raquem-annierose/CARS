// admin_dashboard.js
// Modern dashboard interactivity for admin panel

document.addEventListener('DOMContentLoaded', () => {
  
  const menuItems = document.querySelectorAll('.menu-item');
  const panelSections = document.querySelectorAll('.panel-section');
  const headerContainer = document.querySelector('.header-container');
  const profileSectionElement = document.getElementById('profileSection');
  const sidebarElement = document.getElementById('adminSidebar'); 
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const bodyElement = document.body;
  const dashboardDateEl = document.querySelector('.dashboard-date');

   // Set dashboard date to current date
  function setDashboardDate() {
    if (dashboardDateEl) {
      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      dashboardDateEl.textContent = now.toLocaleDateString(undefined, options);
    }
  }
  setDashboardDate();

  function fetchAdminNameDetails() {
    fetch('/api/admin/name-details', { credentials: 'include' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch admin name details');
        }
        return response.json();
      })
      .then(data => {
        const welcomeElement = document.getElementById('adminWelcomeMessage');
        if (welcomeElement && data.first_name) {
          welcomeElement.textContent = `Welcome back, ${data.first_name} ${data.last_name || ''}!`;
        } else if (welcomeElement) {
          welcomeElement.textContent = 'Welcome, Admin!'; // Fallback
        }
      })
      .catch(error => {
        console.error('Error fetching admin name:', error);
        const welcomeElement = document.getElementById('adminWelcomeMessage');
        if (welcomeElement) {
          welcomeElement.textContent = 'Welcome, Admin!'; // Fallback on error
        }
      });
  }


  function setActivePanel(panelIdToActivate) {
    // Determine the actual section ID and menu item href
    let targetHref;
    let sectionIdToShow;

    if (panelIdToActivate === 'dashboard' || !panelIdToActivate) {
      targetHref = '#'; // This is the href for the Dashboard link
      sectionIdToShow = 'dashboard-section';
      panelIdToActivate = 'dashboard'; // Ensure consistent ID for storage
    } else {
      targetHref = `#${panelIdToActivate}`;
      sectionIdToShow = `${panelIdToActivate}-section`;
    }

    menuItems.forEach(item => {
      item.classList.remove('active');
      // Add active class only if it's NOT the logout button AND href matches
      if (!item.classList.contains('logout') && item.getAttribute('href') === targetHref) {
        item.classList.add('active');
      }
      // Special handling for dashboard: if targetHref is '#' and item's href is '#'
      // and it's not a logout button, it should be active.
      // This ensures that if multiple items have href="#", only the non-logout one (Dashboard) gets active.
      if (targetHref === '#' && item.getAttribute('href') === '#' && !item.classList.contains('logout')) {
         item.classList.add('active');
      }
    });

    panelSections.forEach(section => {
      section.style.display = 'none';
    });

    const sectionElement = document.getElementById(sectionIdToShow);
    if (sectionElement) {
      sectionElement.style.display = 'block';
    } else if (panelIdToActivate !== 'dashboard') { // Fallback to dashboard if specific panel not found
      document.getElementById('dashboard-section').style.display = 'block';
      menuItems.forEach(item => {
        if (item.getAttribute('href') === '#') item.classList.add('active');
      });
      localStorage.setItem('lastActiveAdminPanel', 'dashboard');
      return; // Exit early
    }
     // If dashboard was intended and not found (highly unlikely but good to handle)
    else if (!document.getElementById('dashboard-section') && panelIdToActivate === 'dashboard') {
        console.error("Dashboard section not found!");
        // Potentially show the first available panel or an error message
    }


    // Store the active panel ID (e.g., "dashboard", "reservations")
    localStorage.setItem('lastActiveAdminPanel', panelIdToActivate);
  }

  // Sidebar Toggle Logic
  if (sidebarToggleBtn && sidebarElement) {
    // Check localStorage for saved sidebar state
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isSidebarCollapsed) {
      sidebarElement.classList.add('collapsed');
      bodyElement.classList.add('sidebar-collapsed'); // Add class to body
    }

    sidebarToggleBtn.addEventListener('click', () => {
      sidebarElement.classList.toggle('collapsed');
      bodyElement.classList.toggle('sidebar-collapsed'); // Toggle class on body
      // Save state to localStorage
      if (sidebarElement.classList.contains('collapsed')) {
        localStorage.setItem('sidebarCollapsed', 'true');
      } else {
        localStorage.setItem('sidebarCollapsed', 'false');
      }
    });
  }

  // Populate menu icons with first letters (if not already an SVG/icon)
  menuItems.forEach(item => {
    const iconSpan = item.querySelector('.menu-icon');
    const textData = item.dataset.text; // Get text from data-text attribute
    if (iconSpan && textData && iconSpan.children.length === 0) { // Check if icon span is empty
      iconSpan.textContent = textData.charAt(0).toUpperCase();
    }
  });

  // On page load, check localStorage for the last active panel
  const lastActivePanel = localStorage.getItem('lastActiveAdminPanel');
  if (lastActivePanel) {
    setActivePanel(lastActivePanel);
  } else {
    setActivePanel('dashboard'); // Default to dashboard
  }

  fetchAdminNameDetails(); // Call the function to fetch and display the name

  // Sidebar menu click handler
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      const isLogoutButton = this.classList.contains('logout');

      if (!isLogoutButton) {
        e.preventDefault();
        e.stopPropagation(); // Prevent click from bubbling up to document
      } else {
        // Logout logic is handled by its own dedicated listener
        return;
      }
      
      let clickedPanelId;
      const href = this.getAttribute('href');

      if (href === '#') {
        clickedPanelId = 'dashboard';
      } else {
        clickedPanelId = href.replace('#', '');
      }
      setActivePanel(clickedPanelId);
    });
  });

  // Add click listener to all panel sections to stop propagation
  panelSections.forEach(panel => {
    panel.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  // Add click listener to the header container
  if (headerContainer && profileSectionElement) {
    headerContainer.addEventListener('click', function(e) {
      // If the click target is a descendant of headerContainer BUT NOT a descendant of profileSectionElement
      if (!profileSectionElement.contains(e.target)) {
        // This means the click was on the header, but outside the profile interaction area.
        // Stop this click from bubbling up to any document/window "click outside" listeners.
        e.stopPropagation();
        // console.log('Header click outside profile section, propagation stopped.');
      }
      // Clicks inside profileSectionElement (e.g., on the arrow or avatar) will propagate normally
      // and should be handled by profile.js.
    });
  }

  // Add click listener to the sidebar itself 
  if (sidebarElement) { // I-uncomment ang block na ito
    sidebarElement.addEventListener('click', function(e) {
      // If the click target is the sidebar itself, or a child that is NOT a menu-item
      // (menu-item clicks are already handled and stopped by their own listener)
      let target = e.target;
      let isMenuItemOrChild = false;
      while(target && target !== this) { // 'this' refers to sidebarElement
        if (target.classList && target.classList.contains('menu-item')) {
          isMenuItemOrChild = true;
          break;
        }
        target = target.parentNode;
      }
      
      if (!isMenuItemOrChild) {
        // Click was on sidebar's empty space, or non-interactive elements like logo.
        // Stop this click from bubbling up to any document/window "click outside" listeners.
        e.stopPropagation();
        // console.log('Sidebar click outside menu-item, propagation stopped.');
      }
      // Clicks on menu-items themselves will have their propagation stopped by their own listeners.
    });
  }

  // // Add click listener to the main content area // Mananatiling commented out
  // if (mainContentElement) {
  //   mainContentElement.addEventListener('click', function(e) {
  //     let target = e.target;
  //     let isPanelSectionOrChild = false;
  //     while(target && target !== this) {
  //       if (target.classList && target.classList.contains('panel-section')) {
  //         isPanelSectionOrChild = true;
  //         break;
  //       }
  //       target = target.parentNode;
  //     }

  //     if (!isPanelSectionOrChild) {
  //       e.stopPropagation();
  //     }
  //   });
  // }

  // // Add click listener to the admin container itself // Mananatiling commented out
  // if (adminContainerElement && headerContainer && sidebarElement && mainContentElement) {
  //   adminContainerElement.addEventListener('click', function(e) {
  //     if (e.target === adminContainerElement) {
  //       e.stopPropagation();
  //     }
  //   });
  // }


  // Logout handler
  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault(); 
    // e.stopPropagation(); // Optional: if logout click also closes profile prematurely

    if (confirm('Are you sure you want to logout?')) {
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(data => {  // Corrected: added parentheses around data
          if (data.success) {
            localStorage.removeItem('lastActiveAdminPanel'); // Clear stored panel on logout
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
      .then(data => { // Inayos: dinagdagan ng parenthesis ang 'data'
        renderReservationsBarGraph({ // Assuming this should be renderReservationsBarGraph based on the function name below it
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

  if (document.getElementById('dashboardPieChart')) {
    fetchDashboardStats();
  }
  // Ensure these IDs exist before trying to fetch/render
  const reservationsBarChartEl = document.getElementById('reservationsBarChart');
  const reservationsAmenityChartEl = document.getElementById('reservationsAmenityChart');

  if (reservationsBarChartEl && reservationsAmenityChartEl) {
    // It seems 'reservationsBarChart' is not used for rendering in fetchReservationGraphs
    // fetchReservationGraphs calls renderReservationsBarGraph and renderReservationsAmenityChart
    // Let's assume reservationsBarGraph is the correct one for the bar graph.
    // If there's a separate reservationsBarChart, its fetching logic might be missing.
    // For now, this condition might be too broad if reservationsBarChart is never rendered by this function.
  }
  
  // Corrected logic for fetching graphs:
  // Check if the specific canvas elements for the graphs exist before fetching.
  if (document.getElementById('reservationsBarGraph') || document.getElementById('reservationsAmenityChart')) {
      fetchReservationGraphs();
  }
  // The standalone fetchReservationsBarGraph might be redundant if fetchReservationGraphs already covers it.
  // If fetchReservationsBarGraph is for a different bar graph, ensure its canvas ID is checked.
  // else if (document.getElementById('reservationsBarGraph')) { // This was the original separate call
  //   fetchReservationsBarGraph(); // This might be redundant if already called by fetchReservationGraphs
  // }


  if (document.getElementById('latest-events-list')) {
    fetchLatestEvents();
  }
});
