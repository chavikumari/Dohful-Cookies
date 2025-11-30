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






  const tabButtons = document.querySelectorAll('.category-tab');
  const sections = document.querySelectorAll('.category-section');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;

      // 1. update active tab
      tabButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // 2. show/hide sections
      sections.forEach((section) => {
        const category = section.dataset.category;

        if (target === 'all' || target === category) {
          section.classList.remove('is-hidden');
        } else {
          section.classList.add('is-hidden');
        }
      });

    });
  });

document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".category-option2");
  const sections = document.querySelectorAll(".category-section");

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 1. active state on pills
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // 2. filter sections
      const filter = btn.dataset.filter; // all / everyday / gifting / sampler / curated

      sections.forEach((section) => {
        const category = section.dataset.category;

        if (filter === "all" || filter === category) {
          section.style.display = "";      // show (let CSS/grid handle it)
        } else {
          section.style.display = "none";  // hide
        }
      });
    });
  });
});



function openProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

function addToCart(event, name, price, pack, img) {
    event.stopPropagation(); // prevents opening product page

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let item = {
        id: Date.now(),
        name,
        price,
        pack,
        img,
        quantity: 1
    };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Item added to cart!");
}

// ====== PRODUCT PAGE SCRIPT ======

function addItemToCart(item) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if same product + same pack already exists
    let exists = cart.find(
        c => c.id === item.id && c.pack === item.pack
    );

    if (exists) {
        exists.quantity += item.quantity;
    } else {
        cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}


//cart drawer function

function openCart() {
    document.getElementById("cartDrawer").classList.add("open");
    loadCart();
}

function closeCart() {
    document.getElementById("cartDrawer").classList.remove("open");
}

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.getElementById("cartItems");
    let subtotal = 0;

    container.innerHTML = "";

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                <div class="cart-left">
                    <img src="${item.img}">
                    <div class="cart-info">
                        <h4>${item.name}</h4>
                        <p>${item.pack}</p>

                        <div class="qty-controls">
                            <button onclick="updateQty(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQty(${index}, 1)">+</button>

                            <span class="remove-btn" onclick="removeItem(${index})">🗑</span>
                        </div>
                    </div>
                </div>

                <div class="cart-right">Rs.${item.price * item.quantity}</div>
            </div>
        `;
    });

    document.getElementById("cartSubtotal").textContent = "Rs." + subtotal;
}

function updateQty(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += change;

    if (cart[index].quantity < 1) cart[index].quantity = 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// UPDATE NAVBAR CART COUNT
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);

    let badge = document.getElementById("cartCount");
    if (badge) badge.textContent = count;
}

updateCartCount(); // auto-load on page open







// Edit these with your own images & links
const cookies = [
  {
    name: "Nutella Lava Cookies",
    image: "images/cookie-1.png",
    link: "#"
  },
  {
    name: "Classic Choco Chunk",
    image: "images/cookie-2.png",
    link: "#"
  },
  {
    name: "Triple Chocolate Brownie",
    image: "images/cookie-3.png",
    link: "#"
  }
  // You can add more flavours here
];

let currIndex = 0;

function updateCarousel() {
  const total = cookies.length;

  const mainImg = document.getElementById("main-cookie-img");
  const leftImg = document.getElementById("left-cookie-img");
  const rightImg = document.getElementById("right-cookie-img");
  const nameEl = document.getElementById("cookie-name");
  const shopBtn = document.getElementById("shop-btn");
  const flavourCount = document.getElementById("flavour-count");

  const prevIndex = (currIndex - 1 + total) % total;
  const nextIndex = (currIndex + 1) % total;

  // Main cookie
  mainImg.src = cookies[currIndex].image;
  mainImg.alt = cookies[currIndex].name;
  nameEl.textContent = cookies[currIndex].name;
  shopBtn.href = cookies[currIndex].link;

  // Side images
  leftImg.src = cookies[prevIndex].image;
  leftImg.alt = cookies[prevIndex].name;

  rightImg.src = cookies[nextIndex].image;
  rightImg.alt = cookies[nextIndex].name;

  // Badge number
  flavourCount.textContent = total;
}

function showNext() {
  currIndex = (currIndex + 1) % cookies.length;
  updateCarousel();
}

function showPrev() {
  currIndex = (currIndex - 1 + cookies.length) % cookies.length;
  updateCarousel();
}

document.addEventListener("DOMContentLoaded", () => {
  // Initial render
  updateCarousel();

  // Arrow clicks
  document.querySelector(".arrow-left").addEventListener("click", showPrev);
  document.querySelector(".arrow-right").addEventListener("click", showNext);
});


// ---- Bestseller Cookie Data ----
const bestsellerCookies = [
  {
    name: "Nutella Lava Cookies",
    image: "images/nutella-lava-cookies.png",
    link: "#"
  },
  {
    name: "Classic Choco Chunk",
    image: "images/choco-chunk.png",
    link: "#"
  },
  {
    name: "Choco Brownie Cookies",
    image: "images/choco-brownie-cookies.png",
    link: "#"
  }
];
