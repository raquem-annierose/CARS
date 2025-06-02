// location-cursor.js
// Scroll to info section when the location cursor is clicked

document.addEventListener('DOMContentLoaded', function () {
  var cursor = document.getElementById('location-cursor');
  if (cursor) {
    cursor.addEventListener('click', function () {
      var infoSection = document.getElementById('info-section');
      if (infoSection) {
        infoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});
