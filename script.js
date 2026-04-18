const knapp = document.getElementById("knapp");

if (knapp) {
  knapp.addEventListener("click", function () {
    const aboutSection = document.getElementById("about");

    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

const track = document.querySelector(".carousel-track");
const slides = Array.from(document.querySelectorAll(".carousel-slide"));

let currentIndex = 0;
let autoSlide;

/* Hvor mange bilder som skal vises */
function getSlidesPerView() {
  return window.innerWidth <= 768 ? 1 : 3;
}

/* Avstand mellom bildene */
function getGap() {
  return window.innerWidth <= 768 ? 0 : 20;
}

/* Oppdaterer karusellen */
function updateCarousel() {
  if (!track || slides.length === 0) return;

  const slidesPerView = getSlidesPerView();
  const gap = getGap();
  const slideWidth = slides[0].offsetWidth + gap;

  slides.forEach((slide) => {
    slide.classList.remove("center", "side");
  });

  if (slidesPerView === 1) {
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    slides[currentIndex].classList.add("center");
    return;
  }

  // Pass på at currentIndex ikke går for langt
  if (currentIndex > slides.length - slidesPerView) {
    currentIndex = 0;
  }

  const leftIndex = currentIndex;
  const centerIndex = currentIndex + 1;
  const rightIndex = currentIndex + 2;

  if (slides[leftIndex]) slides[leftIndex].classList.add("side");
  if (slides[centerIndex]) slides[centerIndex].classList.add("center");
  if (slides[rightIndex]) slides[rightIndex].classList.add("side");

  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

/* Neste steg i karusellen */
function nextSlide() {
  if (slides.length === 0) return;

  const slidesPerView = getSlidesPerView();

  if (slidesPerView === 1) {
    currentIndex = (currentIndex + 1) % slides.length;
  } else {
    currentIndex++;

    if (currentIndex > slides.length - 3) {
      currentIndex = 0;
    }
  }

  updateCarousel();
}

/* Start auto-rotasjon */
function startCarousel() {
  stopCarousel();
  autoSlide = setInterval(nextSlide, 4000);
}

/* Stopp auto-rotasjon */
function stopCarousel() {
  if (autoSlide) {
    clearInterval(autoSlide);
  }
}

/* Pause ved hover */
if (track) {
  track.addEventListener("mouseenter", stopCarousel);
  track.addEventListener("mouseleave", startCarousel);
}

/* Oppdater ved resize */
window.addEventListener("resize", function () {
  updateCarousel();
});

/* Start */
updateCarousel();
startCarousel();

const toTopBtn = document.getElementById("toTopBtn");

// vis knapp når man scroller ned
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    toTopBtn.style.display = "flex";
  } else {
    toTopBtn.style.display = "none";
  }
});

// scroll til toppen når man klikker
toTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});