// Cart Management
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.init();
  }

  init() {
    this.updateCartCount();
    this.bindEvents();
  }

  bindEvents() {
    // Handle both desktop and mobile cart icons
    const cartIcons = document.querySelectorAll('#cartIcon, .cart-icon');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');

    cartIcons.forEach(icon => {
      if (icon) {
        icon.addEventListener('click', () => this.openCart());
      }
    });
    
    if (cartClose) {
      cartClose.addEventListener('click', () => this.closeCart());
    }
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => this.closeCart());
    }
  }

  addItem(id, title, price, image) {
    const existingItem = this.cart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ id, title, price, image, quantity: 1 });
    }
    
    this.saveCart();
    this.updateCartCount();
  }

  removeItem(id) {
    this.cart = this.cart.filter(item => item.id !== id);
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
  }

  updateQuantity(id, quantity) {
    const item = this.cart.find(item => item.id === id);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
      }
    }
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  updateCartCount() {
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll('#cartCount, .cart-count');
    
    countElements.forEach(element => {
      if (element) {
        if (count > 0) {
          element.textContent = count;
          element.style.display = 'flex';
        } else {
          element.style.display = 'none';
        }
      }
    });
  }

  openCart() {
    this.renderCart();
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    
    if (overlay && sidebar) {
      overlay.classList.add('show');
      sidebar.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    
    if (overlay && sidebar) {
      overlay.classList.remove('show');
      sidebar.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  renderCart() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartBody) return;

    if (this.cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartFooter) cartFooter.style.display = 'block';

    const cartItems = this.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">
              <i class="fas fa-plus"></i>
            </button>
            <button class="remove-btn" onclick="cartManager.removeItem(${item.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    cartBody.innerHTML = cartItems;
    
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
  }
}

const cartManager = new CartManager();

function addToCart(id, title, price, image) {
  cartManager.addItem(id, title, price, image);
}