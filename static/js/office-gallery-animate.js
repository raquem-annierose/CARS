// office-gallery-animate.js
// Animate office gallery cards on scroll (slide up)
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.office-gallery-card.animate-on-scroll');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-gallery');
        entry.target.classList.remove('hide-gallery');
      } else {
        entry.target.classList.remove('show-gallery');
        entry.target.classList.add('hide-gallery');
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    card.classList.add('hide-gallery');
    observer.observe(card);
  });
});
