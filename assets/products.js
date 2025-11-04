(() => {
  const grid = document.getElementById("productsGrid");
  const pagination = document.getElementById("pagination");
  const categoryBtns = document.querySelectorAll(".category-btn");

  const limit = 24;
  let total = 0;
  let query = "";
  let loading = false;
  let currentPage = 1;
  let totalPages = 1;

  let filters = {
    category: "",
  };

  const toStars = (rating) => {
    const full = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) =>
      i < full ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
    ).join("");
  };

  function productCard(p) {
    const thumb = (p.thumbnail || (p.images && p.images[0]) || "").replace(
      /^http:/,
      "https:"
    );
    return `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="product-card h-100">
          <div class="product-thumb">
            <img src="${thumb}" alt="${p.title}" />
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
      </div>`;
  }

  function buildPageLink(page, label = null, disabled = false, active = false) {
    const li = document.createElement("li");
    li.className = `page-item${disabled ? " disabled" : ""}${
      active ? " active" : ""
    }`;
    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = label ?? String(page);
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (disabled || active) return;
      goToPage(page);
    });
    li.appendChild(a);
    return li;
  }

  function renderPagination() {
    if (!pagination) return;
    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    pagination.appendChild(
      buildPageLink(currentPage - 1, "Prev", currentPage === 1)
    );

    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);

    if (start > 1) {
      pagination.appendChild(buildPageLink(1));
      if (start > 2) {
        const dots = document.createElement("li");
        dots.className = "page-item disabled";
        dots.innerHTML = '<span class="page-link">…</span>';
        pagination.appendChild(dots);
      }
    }

    for (let p = start; p <= end; p++) {
      pagination.appendChild(buildPageLink(p, null, false, p === currentPage));
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        const dots = document.createElement("li");
        dots.className = "page-item disabled";
        dots.innerHTML = '<span class="page-link">…</span>';
        pagination.appendChild(dots);
      }
      pagination.appendChild(buildPageLink(totalPages));
    }

    pagination.appendChild(
      buildPageLink(currentPage + 1, "Next", currentPage === totalPages)
    );
  }

  async function fetchProductsPage() {
    loading = true;
    grid.setAttribute("aria-busy", "true");

    let url = `https://dummyjson.com/products?limit=${limit}&skip=${
      (currentPage - 1) * limit
    }`;

    if (filters.category) {
      url = `https://dummyjson.com/products/category/${
        filters.category
      }?limit=${limit}&skip=${(currentPage - 1) * limit}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    let items = data.products || [];

    total = filters.category ? items.length : data.total ?? items.length;
    totalPages = Math.max(1, Math.ceil(total / limit));

    grid.innerHTML = items.map(productCard).join("");
    renderPagination();

    grid.setAttribute("aria-busy", "false");
    loading = false;
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages || loading) return;
    currentPage = page;
    fetchProductsPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function categoryBtnHandler(e) {
    const category = e.target.dataset.category;
    filters.category = category;
    currentPage = 1;
    categoryBtns.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    fetchProductsPage();
  }

  document.addEventListener("DOMContentLoaded", () => {
    fetchProductsPage();
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", categoryBtnHandler);
    });
  });
})();
