// resident_dashboard.js
// Dashboard interactivity for resident panel

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('residentSidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const mainContent = document.querySelector('.main-content');
    const profileSection = document.getElementById('profileSection');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    const profileDropdownArrow = document.getElementById('profileDropdownArrow');

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

    // Sidebar toggle functionality
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (mainContent) {
                mainContent.classList.toggle('sidebar-collapsed'); // For adjusting margin if sidebar collapses
            }
            // Adjust icon based on collapsed state if needed
            // For example, change to a "close" icon when expanded and "menu" when collapsed
        });
    }

    // Profile dropdown functionality
    if (profileSection && profileDropdownMenu && profileDropdownArrow) {
        profileSection.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent click from immediately closing due to document listener
            const isOpen = profileDropdownMenu.style.display === 'block';
            profileDropdownMenu.style.display = isOpen ? 'none' : 'block';
            profileDropdownArrow.classList.toggle('open', !isOpen);
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', function (event) {
            if (profileDropdownMenu.style.display === 'block') {
                if (!profileSection.contains(event.target)) {
                    profileDropdownMenu.style.display = 'none';
                    profileDropdownArrow.classList.remove('open');
                }
            }
        });
    }

    // Panel switching logic
    const menuItems = document.querySelectorAll('.sidebar .menu-item[data-panel], #profileMenuProfile[data-panel]');
    const contentPanels = document.querySelectorAll('.main-content .content-panel');
    const defaultPanelIdBase = 'resident-dashboard'; // Default panel to show (base ID)

    console.log('Resident Dashboard Script Loaded. Initializing panel logic.');
    console.log('Menu items found:', menuItems.length, menuItems);
    console.log('Content panels found:', contentPanels.length, contentPanels);

    function showPanel(panelIdBase) {
        console.log(`Attempting to show panel for base ID: '${panelIdBase}'`);
        if (!panelIdBase) {
            panelIdBase = defaultPanelIdBase;
            console.log(`Panel ID base was empty or invalid, using default: '${panelIdBase}'`);
        }
        const panelToShowId = panelIdBase + '-panel';
        console.log(`Target panel ID: '${panelToShowId}'`);

        let panelFound = false;
        if (contentPanels.length === 0) {
            console.warn('No content panels found with class "content-panel" inside ".main-content". Ensure your HTML is correct.');
        }

        contentPanels.forEach(panel => {
            if (panel.id === panelToShowId) {
                console.log(`Showing panel: '${panel.id}'`);
                panel.style.display = 'block';
                panelFound = true;
            } else {
                // console.log(`Hiding panel: '${panel.id}'`); // Can be verbose, uncomment if needed
                panel.style.display = 'none';
            }
        });

        if (!panelFound && contentPanels.length > 0) {
            console.warn(`Panel with ID '${panelToShowId}' not found in contentPanels list. Attempting to show default panel.`);
            const defaultPanelElement = document.getElementById(defaultPanelIdBase + '-panel');
            if (defaultPanelElement) {
                console.log(`Showing default panel directly as fallback: '${defaultPanelElement.id}'`);
                defaultPanelElement.style.display = 'block';
                // Ensure all other panels are hidden if default is shown due to this specific error
                contentPanels.forEach(panel => {
                    if (panel.id !== defaultPanelElement.id) {
                        panel.style.display = 'none';
                    }
                });
            } else {
                console.error(`Fallback default panel '${defaultPanelIdBase + '-panel'}' also not found. No panel will be shown.`);
            }
        } else if (!panelFound && contentPanels.length === 0) {
            console.error(`No panels to show. Panel '${panelToShowId}' was requested.`);
        }


        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.panel === panelIdBase) {
                item.classList.add('active');
            }
        });

        // Update URL hash if it's different from the current panelIdBase
        // and if panelIdBase is not the default one being shown due to an invalid initial hash
        if (window.location.hash !== '#' + panelIdBase) {
            history.replaceState(null, '', '#' + panelIdBase);
            console.log(`URL hash updated to: '#${panelIdBase}'`);
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const panelIdBase = this.dataset.panel;
            console.log(`Menu item clicked. Data-panel: '${panelIdBase}'`);
            showPanel(panelIdBase);

            // If the click is from the profile dropdown menu, close the dropdown
            if (this.id === 'profileMenuProfile' && profileDropdownMenu) {
                profileDropdownMenu.style.display = 'none';
                if (profileDropdownArrow) profileDropdownArrow.classList.remove('open');
            }
        });
    });

    // Handle initial page load and hash changes
    function handleHashChange() {
        let hash = window.location.hash.substring(1); // Remove #
        console.log(`Hash changed or initial load. Current hash: '${hash}'`);
        
        const targetMenuItem = document.querySelector(`.menu-item[data-panel="${hash}"]`);
        
        if (hash && targetMenuItem) {
            console.log(`Valid hash ('${hash}') found and corresponds to a menu item. Showing panel for: '${hash}'`);
            showPanel(hash);
        } else {
            if (hash && !targetMenuItem) {
                console.log(`Hash ('${hash}') found, but no corresponding menu item with data-panel="${hash}". Showing default panel.`);
            } else { // No hash
                console.log('No hash in URL, showing default panel.');
            }
            showPanel(defaultPanelIdBase);
        }
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial call to set panel based on current hash or default

    // Logout functionality
    const logoutLinks = document.querySelectorAll('#profileMenuLogout, #logoutBtnBottom');
    logoutLinks.forEach(logoutLink => {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Perform logout operation, e.g., redirect to logout URL
            // This assumes you have a /logout route defined in your backend
            window.location.href = '/logout'; 
        });
    });
});
