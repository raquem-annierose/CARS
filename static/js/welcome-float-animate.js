document.addEventListener('DOMContentLoaded', function () {
  const desc = document.querySelector('.description-holder');
  if (!desc) return;
  desc.classList.add('animate-scroll', 'down');

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const rect = desc.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const isVisible = rect.top < windowHeight && rect.bottom > 0;
    const currentScrollY = window.scrollY;
    const goingDown = currentScrollY > lastScrollY;

    if (isVisible) {
      if (goingDown) {
        desc.classList.add('up');
        desc.classList.remove('down');
      } else {
        desc.classList.remove('up');
        desc.classList.add('down');
      }
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Initial state
  onScroll();
});