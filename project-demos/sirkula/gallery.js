// Gallery Data - Images with descriptions
const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=1200&q=80",
    title: "Blandet avfall i feil container",
    description: "Plast, papir og glass i samme beholder. Dette gjør gjenvinning umulig. Husk å sortere riktig!"
  },
  {
    url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=1200&q=80",
    title: "Skittent plast som ikke kan resirkuleres",
    description: "Fettet og skittent plast kan ikke resirkuleres. Vask alltid plast før du kaster det!"
  },
  {
    url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=80",
    title: "Papir blandet med fuktig avfall",
    description: "Fugtig eller fettet papir kan ikke resirkuleres. Hold papir rent og tørt!"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    title: "Elektronikk i restavfall",
    description: "Elektronikk hører ikke hjemme i restavfall! Lever det til spesialpunkt for sikker gjenvinning."
  },
  {
    url: "https://images.unsplash.com/photo-1574279606135-c233ad48323c?w=1200&q=80",
    title: "Batterier i feil beholder",
    description: "Batterier er farlig avfall! Lever dem alltid til butikk eller gjenvinningsstasjon, aldri i restavfall."
  },
  {
    url: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1200&q=80",
    title: "Glass i feil container",
    description: "Glass skal sorteres etter farge. Blandet glass kan gjøre gjenvinning vanskeligere."
  },
  {
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
    title: "Matavfall blandet med annet avfall",
    description: "Matavfall bør komposteres separat. Blandet med annet avfall kan det ikke komposteres effektivt."
  },
  {
    url: "https://images.unsplash.com/photo-1585092274659-7ad586e98b35?w=1200&q=80",
    title: "Tekstiler i restavfall",
    description: "Klær og tekstiler kan gjenbrukes eller resirkuleres. Ikke kast dem i restavfall!"
  }
];

let currentIndex = 0;

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('nav');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
}

function initGallery() {
  const mainImage = document.getElementById('mainImage');
  const imageTitle = document.getElementById('imageTitle');
  const imageDescription = document.getElementById('imageDescription');
  const thumbnailsContainer = document.getElementById('thumbnails');
  const currentIndexSpan = document.getElementById('currentIndex');
  const totalImagesSpan = document.getElementById('totalImages');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Set total images
  totalImagesSpan.textContent = galleryImages.length;

  // Create thumbnails
  galleryImages.forEach((image, index) => {
    const thumbnail = document.createElement('div');
    thumbnail.className = 'gallery-thumbnail';
    if (index === 0) thumbnail.classList.add('active');
    thumbnail.innerHTML = `<img src="${image.url}" alt="${image.title}" loading="lazy">`;
    thumbnail.addEventListener('click', () => {
      currentIndex = index;
      updateGallery();
    });
    thumbnailsContainer.appendChild(thumbnail);
  });

  // Navigation buttons
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGallery();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateGallery();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateGallery();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateGallery();
    }
  });

  // Update gallery display
  function updateGallery() {
    const image = galleryImages[currentIndex];
    mainImage.src = image.url;
    mainImage.alt = image.title;
    imageTitle.textContent = image.title;
    imageDescription.textContent = image.description;
    currentIndexSpan.textContent = currentIndex + 1;

    // Update thumbnails
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumb, index) => {
      if (index === currentIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });

    // Smooth scroll to main image
    mainImage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Initialize
  updateGallery();
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

console.log('🖼️ Gallery loaded!');

