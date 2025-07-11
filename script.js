document.addEventListener("DOMContentLoaded", () => {
  // 🔁 Fade word rotator
  document.querySelectorAll(".fade-words-wrapper").forEach((wrapper) => {
    const words = wrapper.querySelectorAll(".word");
    let index = 0;
    setInterval(() => {
      words[index].classList.remove("active");
      index = (index + 1) % words.length;
      words[index].classList.add("active");
    }, 2500);
  });

  // ➡️ Project slider
  const slides = document.querySelectorAll("#page-project .slide");
  let currentSlide = 0;

  function updateSlide(direction) {
    slides[currentSlide].classList.remove("active");
    currentSlide =
      direction === "next"
        ? Math.min(currentSlide + 1, slides.length - 1)
        : Math.max(currentSlide - 1, 0);
    slides[currentSlide].classList.add("active");
    updateButtonVisibility();
  }

  function updateButtonVisibility() {
    slides.forEach((slide, index) => {
      slide
        .querySelector(".back-slide-btn")
        ?.style.setProperty("display", index === 0 ? "none" : "inline-flex");
      slide
        .querySelector(".next-slide-btn")
        ?.style.setProperty(
          "display",
          index === slides.length - 1 ? "none" : "inline-flex"
        );
    });
  }

  document
    .querySelectorAll(".next-slide-btn")
    .forEach((btn) => btn.addEventListener("click", () => updateSlide("next")));
  document
    .querySelectorAll(".back-slide-btn")
    .forEach((btn) => btn.addEventListener("click", () => updateSlide("back")));
  updateButtonVisibility();

  // 📞 Contact interactivity
  const phoneButton = document.getElementById("phone-button");
  const phoneNumber = document.getElementById("phone-number");
  const emailButton = document.getElementById("email-button");
  const emailAddress = document.getElementById("email-address");

  phoneButton?.addEventListener("click", () =>
    phoneNumber?.classList.add("fade-in")
  );
  emailButton?.addEventListener("click", () =>
    emailAddress?.classList.add("fade-in")
  );

  // ✨ Star canvas
  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");

  // Resize the canvas to fit the full screen
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas); // Adjust canvas size on window resize

  const stars = [];

  // Create stars at random positions across the entire canvas (full-screen density)
  function createStar() {
    return {
      x: Math.random() * canvas.width, // Random x position across the canvas width
      y: Math.random() * canvas.height, // Random y position anywhere within the canvas height (full canvas)
      radius: Math.random() * 1.5 + 0.5, // Random radius between 0.5 and 2
      speed: Math.random() * 1.5 + 0.5, // Random falling speed between 0.5 and 2
      opacity: Math.random() * 0.6 + 0.4, // Random opacity between 0.4 and 1
      drift: Math.random() * 0.3 - 0.15, // Slight horizontal drift (random movement left/right)
    };
  }

  // Function to draw the stars and animate them with added randomness
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas each frame

    // Ensure we have enough stars across the entire canvas (no gaps)
    const totalStars = 200; // Number of stars in the field, adjust for screen size

    // Fill the canvas with stars
    while (stars.length < totalStars) stars.push(createStar()); // Add stars if there aren't enough

    stars.forEach((star, i) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();

      // Update star position (falling effect)
      star.y += star.speed; // Stars fall down
      star.x += star.drift; // Stars drift horizontally for randomness

      // Twinkling effect with more randomness
      star.opacity += (Math.random() - 0.5) * 0.05; // Add slight random opacity change
      star.opacity = Math.max(0.2, Math.min(star.opacity, 1)); // Ensure opacity stays within range

      // Recycle stars when they move out of view
      if (star.y > canvas.height) {
        stars[i] = createStar(); // Recycle star back to the top when it falls out of view
      }

      // If stars move out of bounds horizontally, reset their position
      if (star.x < 0 || star.x > canvas.width) {
        stars[i].x = Math.random() * canvas.width; // Reset horizontal position when out of bounds
      }
    });

    // Request the next frame to keep the animation going
    requestAnimationFrame(drawStars);
  }

  // Start drawing the stars immediately when the script loads
  drawStars(); // Start the stars animation as soon as the page loads

  // 👁️ IntersectionObserver effects
  const observerOptions = { threshold: 0.5 };
  const unifiedObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const body = document.body;
      if (entry.target.id === "page4") {
        body.classList.toggle("contact-active", entry.isIntersecting);
      } else if (
        entry.target.id === "page2" ||
        entry.target.id === "page-project"
      ) {
        body.classList.toggle("white-background", entry.isIntersecting);
      }
    });
  }, observerOptions);

  ["page2", "page-project", "page4"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) unifiedObserver.observe(section);
  });

  const aboutText = document.querySelector("#page2 .about-text");
  if (aboutText) {
    const glowObserver = new IntersectionObserver(
      ([entry]) => {
        aboutText.classList.toggle("glow", entry.isIntersecting);
      },
      { threshold: 0.6 }
    );
    glowObserver.observe(aboutText);
  }
});

// 🍔 Mobile Navigation
const hamburger = document.querySelector(".hamburger-menu");
const slideNav = document.querySelector(".slide-nav");

hamburger?.addEventListener("click", () => {
  slideNav.classList.toggle("open");
});

// Close nav when clicking a link
document.querySelectorAll(".slide-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    slideNav.classList.remove("open");
  });
});

// Optional: Close menu on outside tap (mobile UX)
document.addEventListener("click", (e) => {
  if (
    slideNav.classList.contains("open") &&
    !slideNav.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    slideNav.classList.remove("open");
  }
});

// Optional: Close on swipe left
let touchStartX = 0;

window.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

window.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (diff > 70 && slideNav.classList.contains("open")) {
    slideNav.classList.remove("open");
  }
});

// ✨ Firefly canvas
const fireflyCanvas = document.getElementById("firefly-canvas");
if (fireflyCanvas) {
  const fCtx = fireflyCanvas.getContext("2d");

  function resizeFireflyCanvas() {
    fireflyCanvas.width = window.innerWidth;
    fireflyCanvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeFireflyCanvas);
  resizeFireflyCanvas();

  class Firefly {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * fireflyCanvas.width;
      this.y = Math.random() * fireflyCanvas.height;
      this.radius = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += (Math.random() - 0.5) * 0.05;
      if (this.opacity < 0.2 || this.opacity > 1) {
        this.opacity = Math.random();
      }
      if (
        this.x < 0 ||
        this.x > fireflyCanvas.width ||
        this.y < 0 ||
        this.y > fireflyCanvas.height
      ) {
        this.reset();
      }
    }

    draw() {
      fCtx.beginPath();
      fCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      fCtx.fillStyle = `rgba(30, 144, 255, ${this.opacity})`;
      fCtx.shadowColor = "rgba(30, 144, 255, 0.5)";
      fCtx.shadowBlur = 10;
      fCtx.fill();
    }
  }

  const fireflies = [];
  const numFireflies = 50;

  for (let i = 0; i < numFireflies; i++) {
    fireflies.push(new Firefly());
  }

  function animateFireflies() {
    fCtx.clearRect(0, 0, fireflyCanvas.width, fireflyCanvas.height);
    fireflies.forEach((firefly) => {
      firefly.update();
      firefly.draw();
    });
    requestAnimationFrame(animateFireflies);
  }

  animateFireflies();
}

// 👁️ Fade-in image on scroll
const fadeInElements = document.querySelectorAll('.fade-in-on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.3
});

fadeInElements.forEach(el => observer.observe(el));
