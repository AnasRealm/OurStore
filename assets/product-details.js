(() => {
  const detailsContainer = document.getElementById("productDetails");

  const toStars = (rating) => {
    const full = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) =>
      i < full ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
    ).join("");
  };

  function renderProductDetails(product) {
    const images = product.images || [];
    const mainImage = (product.thumbnail || images[0] || "").replace(
      /^http:/,
      "https:"
    );
    const gallery = images
      .slice(1, 5)
      .map((img) => img.replace(/^http:/, "https:"));

    return `
      <div class="col-lg-6">
        <div class="product-gallery">
          <div class="main-image mb-3">
            <img src="${mainImage}" alt="${
      product.title
    }" class="img-fluid rounded shadow" />
          </div>
          ${
            gallery.length > 0
              ? `
            <div class="gallery-thumbs d-flex gap-2 overflow-auto">
              ${gallery
                .map(
                  (img) =>
                    `<img src="${img}" alt="${product.title}" class="thumb-img rounded" />`
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      </div>
      <div class="col-lg-6">
        <div class="product-info">
          <h1 class="product-title mb-3">${product.title}</h1>
          <div class="product-meta mb-3">
            <span class="badge bg-secondary mb-2">${product.category}</span>
            <div class="rating mb-2">
              ${toStars(product.rating)} <span class="ms-2">${
      product.rating
    }</span>
            </div>
            <div class="price fs-3 fw-bold text-primary">$${Number(
              product.price
            ).toFixed(2)}</div>
            ${
              product.discountPercentage
                ? `<div class="text-muted">Discount: ${product.discountPercentage}%</div>`
                : ""
            }
          </div>
          <p class="product-description mb-4">${product.description}</p>
          <div class="product-stock mb-4">
            <span class="fw-semibold">Stock: ${product.stock}</span>
          </div>
          <div class="d-flex gap-3">
            <button class="btn btn-dark btn-lg d-flex align-items-center gap-2">
              <i class="fas fa-cart-plus"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async function fetchProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) {
      detailsContainer.innerHTML =
        '<div class="col-12 text-center"><p>Product not found.</p></div>';
      return;
    }

    detailsContainer.setAttribute("aria-busy", "true");
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const product = await res.json();
      detailsContainer.innerHTML = renderProductDetails(product);
    } catch (error) {
      detailsContainer.innerHTML =
        '<div class="col-12 text-center"><p>Error loading product details.</p></div>';
    }
    detailsContainer.setAttribute("aria-busy", "false");
  }

  document.addEventListener("DOMContentLoaded", () => {
    fetchProductDetails();
  });
})();
