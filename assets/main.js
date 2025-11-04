// Toggle search input
const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");
if (searchIcon && searchInput) {
  searchIcon.addEventListener("click", () => {
    const hidden = searchInput.hasAttribute("hidden");
    if (hidden) {
      searchInput.removeAttribute("hidden");
      searchInput.focus();
    } else {
      searchInput.setAttribute("hidden", "");
    }
  });
}

// Simple cart overlay behavior (panel not included fully here)
const cartIcon = document.getElementById("cartIcon");
const cartOverlay = document.getElementById("cartOverlay");

function showOverlay() {
  if (!cartOverlay) return;
  cartOverlay.classList.add("show");
  cartOverlay.removeAttribute("hidden");
}
function hideOverlay() {
  if (!cartOverlay) return;
  cartOverlay.classList.remove("show");
  cartOverlay.setAttribute("hidden", "");
}

if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    showOverlay();
    // open cart panel logic can be added here
  });
}
if (cartOverlay) {
  cartOverlay.addEventListener("click", hideOverlay);
  // close with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideOverlay();
  });
}

// Ensure directional icons logical in LTR (keeps UI consistent)
document.querySelectorAll(".fa-arrow-left, .fa-arrow-right").forEach((i) => {
  if (i.classList.contains("fa-arrow-left")) {
    i.classList.remove("fa-arrow-left");
    i.classList.add("fa-arrow-right");
  }
});

// ================== BEST SELLING (DummyJSON) ==================
async function loadBestSelling() {
  const grid = document.getElementById("bestSellingGrid");
  if (!grid) return;

  try {
    // Use DummyJSON: top by rating as a proxy for best selling
    // Docs: https://dummyjson.com/docs/products
    const res = await fetch(
      "https://dummyjson.com/products?limit=4&sortBy=rating&order=desc"
    );
    const data = await res.json();
    const items = data && data.products ? data.products : [];

    const toStars = (rating) => {
      const full = Math.round(rating);
      return Array.from({ length: 5 }, (_, i) =>
        i < full ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
      ).join("");
    };

    grid.innerHTML = items
      .map(
        (p) => `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="product-card h-100">
          <div class="product-thumb">
            <img src="${(
              p.thumbnail ||
              (p.images && p.images[0]) ||
              ""
            ).replace(/^http:/, "https:")}" alt="${p.title}" />
            <span class="badge-float">${p.category || "Popular"}</span>
            <a href="product-details.html?id=${
              p.id
            }" class="eye-btn" title="View Details">
              <i class="fas fa-eye"></i>
            </a>
          </div>
          <div class="product-body">
            <div class="product-title text-truncate" title="${p.title}">${
          p.title
        }</div>
            <div class="product-meta">
              <span class="price">$${Number(p.price).toFixed(2)}</span>
              <span class="rating" aria-label="Rating ${p.rating}">${toStars(
          p.rating
        )}</span>
            </div>
            <div class="d-grid mt-3">
              <button class="btn btn-dark btn-sm d-inline-flex align-items-center justify-content-center gap-2" type="button">
                <i class="fas fa-cart-plus"></i>
                <span>Add to cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    grid.setAttribute("aria-busy", "false");
  } catch (e) {
    grid.innerHTML = `<div class="col-12"><div class="alert alert-warning">Failed to load products.</div></div>`;
    grid.setAttribute("aria-busy", "false");
  }
}

document.addEventListener("DOMContentLoaded", loadBestSelling);

// Footer year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("yearCopy");
  if (y) y.textContent = new Date().getFullYear();
});
