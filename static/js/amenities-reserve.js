// amenities-reserve.js
// Ask user if they want to reserve when clicking an amenity, then redirect to login (with Google option)
document.addEventListener('DOMContentLoaded', function () {
  // For all amenities cards and reserve buttons
  document.querySelectorAll('.amenity-card, .reserve-btn').forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      // Trigger the login modal
      const loginBtn = document.querySelector('.btn-login');
      if (loginBtn) loginBtn.click();
    });
  });
});
