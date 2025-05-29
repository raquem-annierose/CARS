console.log("Script loaded!");

const images = [
  'static/resources/banner/1.jpg',
  'static/resources/banner/2.jpg',
  'static/resources/banner/3.jpg'
];

let currentIndex = 0;

function rotateImage() {
  console.log("Rotating image...");
  const imageElement = document.getElementById('rotating-image');
  if (imageElement) {
    currentIndex = (currentIndex + 1) % images.length;
    imageElement.src = images[currentIndex];
  }
}

setInterval(rotateImage, 3000);
