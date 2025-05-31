// amenities-animate.js
// Animate amenities cards on scroll into view

document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.amenity-card');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-amenity');
      } else {
        entry.target.classList.remove('show-amenity');
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    card.classList.add('hide-amenity');
    observer.observe(card);
  });
});
