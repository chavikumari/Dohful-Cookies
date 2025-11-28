// ====== MARQUEE SECTION ======
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".marq");
  if (!container) return; // if no marquee on this page, skip this block

  const inner = container.querySelector(".marq-inner");
  const base = inner ? inner.querySelector(".marq-item") : null;
  if (!inner || !base) return;

  // Wait for any images/fonts inside base to load (none here, but harmless)
  function waitForImages(el) {
    const imgs = Array.from(el.querySelectorAll("img"));
    return Promise.all(
      imgs.map(
        img =>
          new Promise(res => {
            if (img.complete && img.naturalWidth) res();
            else {
              img.addEventListener("load", res, { once: true });
              img.addEventListener("error", res, { once: true });
            }
          })
      )
    );
  }

  // Build clones so inner width >= 2 * container width
  function buildRepeats() {
    inner.classList.remove("running");

    const baseHTML = base.outerHTML;
    inner.innerHTML = baseHTML; // reset to single base element
    const containerW = container.clientWidth || window.innerWidth;

    let safety = 0;
    while (inner.scrollWidth < containerW * 2 && safety < 80) {
      inner.appendChild(inner.firstElementChild.cloneNode(true));
      safety++;
    }
  }

  // update animation duration to keep speed consistent (px per sec)
  function setAnimationDuration() {
    const pxPerSecond = 140;
    const distance = inner.scrollWidth / 2; // translate -50% of inner width
    const seconds = Math.max(4, distance / pxPerSecond);
    inner.style.animationDuration = `${seconds}s`;
  }

  async function init() {
    await waitForImages(base);
    buildRepeats();
    setAnimationDuration();

    requestAnimationFrame(() => {
      void inner.offsetWidth;
      inner.classList.add("running");
    });
  }

  init();

  // rebuild on resize (debounced) without causing jumps
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      inner.classList.remove("running");
      setTimeout(() => {
        buildRepeats();
        setAnimationDuration();
        void inner.offsetWidth;
        inner.classList.add("running");
      }, 60);
    }, 150);
  });

  // hover pause
  container.addEventListener("mouseenter", () =>
    inner.classList.remove("running")
  );
  container.addEventListener("mouseleave", () =>
    inner.classList.add("running")
  );
});

// ====== COLLECTION CARDS CLICK ======
document.querySelectorAll(".col-card").forEach(card => {
  card.addEventListener("click", () => {
    window.location.href = "#"; // put link here
  });
});

// ====== CAROUSEL SECTION ======
const track = document.querySelector(".carousel-track");
const slides = Array.from(document.querySelectorAll(".slide"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

function updateSlide() {
  if (!track) return;
  const offset = -currentIndex * 100;
  track.style.transform = `translateX(${offset}%)`;
}

if (nextBtn && prevBtn && track && slides.length) {
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
  });
}

// ====== LOCATION FILTER (VISIT US PAGE) ======
document.addEventListener("DOMContentLoaded", () => {
  const locationSelect = document.querySelector(".location-dropdown");
  const cityBlocks = document.querySelectorAll(".city-block");

  if (!locationSelect) return; // this page might not have the dropdown

  function filterLocations() {
    const value = locationSelect.value; // "All" | "Gurugram" | "Delhi" | "Noida"

    cityBlocks.forEach(block => {
      const city = block.dataset.city; // "Gurugram" | "Delhi" | "Noida"

      if (value === "All" || value === city) {
        block.style.display = "block";
      } else {
        block.style.display = "none";
      }
    });
  }

  filterLocations();
  locationSelect.addEventListener("change", filterLocations);
});
