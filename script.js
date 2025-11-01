// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const navHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Form submission handler
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Dziękujemy za wiadomość! Skontaktujemy się z Państwem wkrótce.");
    contactForm.reset();
  });
}

// Add active state to navigation on scroll
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;
  const navHeight = document.querySelector(".navbar").offsetHeight;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - navHeight - 100;
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
  } else {
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  }
});

// Init GLightbox (gallery for #realizacje)
if (typeof GLightbox !== "undefined") {
  const lightbox = GLightbox({
    selector: ".glightbox",
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    plyr: { css: "https://cdn.plyr.io/3.6.8/plyr.css" }, // optional if videos used
  });
}

// Render realizacje gallery from manifest and init baguetteBox
(async function buildRealizacjeGallery() {
  const galleryContainer = document.getElementById("realizacje-gallery");
  if (!galleryContainer) return;

  try {
    const res = await fetch("projects/gallery.json", { cache: "no-store" });
    if (!res.ok) throw new Error("projects/gallery.json not found");
    const data = await res.json();
    if (!Array.isArray(data.projects)) throw new Error("invalid manifest");

    data.projects.forEach((p, idx) => {
      const group = document.createElement("div");
      group.className = "gallery-group";

      (p.images || []).forEach((imgPath, i) => {
        const a = document.createElement("a");
        a.href = imgPath;
        a.setAttribute("data-caption", p.title);

        if (i === 0) {
          a.className = "portfolio-item";
          const img = document.createElement("img");
          img.src = p.thumb || imgPath;
          img.alt = p.title;
          img.loading = "lazy";
          a.appendChild(img);

          const overlay = document.createElement("div");
          overlay.className = "portfolio-overlay";
          overlay.innerHTML = `<h3>${p.title}</h3>`;
          a.appendChild(overlay);
        } else {
          // keep anchors discoverable by baguetteBox but visually hidden (not display:none)
          a.className = "inert-link";
        }

        group.appendChild(a);
      });

      galleryContainer.appendChild(group);
    });

    // initialize baguetteBox: each .gallery-group is its own gallery
    baguetteBox.run(".gallery-group", {
      captions: true,
      buttons: "auto",
      async: false,
    });
    console.log("Realizacje gallery initialized");
  } catch (err) {
    console.warn("Realizacje gallery build error:", err);
  }
})();
