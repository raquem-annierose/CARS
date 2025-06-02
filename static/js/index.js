// About Us modal logic
document.addEventListener('DOMContentLoaded', function () {
  const aboutBtn = document.querySelector('.header-about-btn');
  const aboutModal = document.getElementById('about-modal');
  const aboutOverlay = document.getElementById('about-modal-overlay');
  const closeAbout = document.getElementById('close-about-modal');
  if (aboutBtn && aboutModal && aboutOverlay && closeAbout) {
    aboutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      aboutModal.classList.add('show');
      aboutOverlay.classList.add('show');
    });
    closeAbout.addEventListener('click', function () {
      aboutModal.classList.remove('show');
      aboutOverlay.classList.remove('show');
    });
    aboutOverlay.addEventListener('click', function () {
      aboutModal.classList.remove('show');
      aboutOverlay.classList.remove('show');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        aboutModal.classList.remove('show');
        aboutOverlay.classList.remove('show');
      }
    });
  }

  // Modern nav focus/active effect
  const navLinks = document.querySelectorAll('.nav-curve-link');
  navLinks.forEach(link => {
    link.addEventListener('focus', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
    link.addEventListener('blur', function() {
      this.classList.remove('active');
    });
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
