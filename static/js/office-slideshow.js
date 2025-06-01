// office-slideshow.js
// Simple slideshow for office images on the contact page

document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.office-slideshow .slide');
  const prevBtn = document.querySelector('.office-slideshow .prev');
  const nextBtn = document.querySelector('.office-slideshow .next');
  const dots = document.querySelectorAll('.office-slideshow .dot');
  let current = 0;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
    current = idx;
  }

  prevBtn.addEventListener('click', function () {
    let idx = (current - 1 + slides.length) % slides.length;
    showSlide(idx);
  });
  nextBtn.addEventListener('click', function () {
    let idx = (current + 1) % slides.length;
    showSlide(idx);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  // Optional: auto-slide every 7s
  let timer = setInterval(() => {
    let idx = (current + 1) % slides.length;
    showSlide(idx);
  }, 7000);
  // Pause on hover
  document.querySelector('.office-slideshow').addEventListener('mouseenter', () => clearInterval(timer));
  document.querySelector('.office-slideshow').addEventListener('mouseleave', () => {
    timer = setInterval(() => {
      let idx = (current + 1) % slides.length;
      showSlide(idx);
    }, 7000);
  });

  // --- Slide-in animation on scroll for office slideshow ---
  const slideshow = document.querySelector('.office-slideshow');
  if (slideshow) {
    slideshow.classList.add('slide-in');
    function checkSlideIn() {
      const rect = slideshow.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight - 80) {
        slideshow.classList.add('visible');
        window.removeEventListener('scroll', checkSlideIn);
      }
    }
    window.addEventListener('scroll', checkSlideIn);
    checkSlideIn();
  }

  showSlide(0);
});
