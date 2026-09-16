/* ============================================================
   XYZ GYM — Interactive Functionality, E-Commerce & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. Navbar Sticky & Active Scroll Link ----------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link indicator
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- 2. Mobile Navigation Drawer ----------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ---------- 3. Smooth Scroll-Reveal Animations ----------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  // Group elements inside grids for staggered transition delays
  const gridContainers = document.querySelectorAll('.pricing-grid, .features-grid, .facilities-grid, .trainers-grid, .results-grid, .testimonials-grid, .product-grid');

  gridContainers.forEach(grid => {
    const items = grid.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    items.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 0.12}s`;
    });
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- 4. Store Category Filter Tabs ----------
  const storeTabs = document.querySelectorAll('.store-tab');
  const productCards = document.querySelectorAll('.product-card');

  storeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      storeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      productCards.forEach((card, index) => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          card.style.transitionDelay = `${index * 0.08}s`;
          setTimeout(() => card.classList.add('active'), 50);
        } else {
          card.style.display = 'none';
          card.classList.remove('active');
        }
      });
    });
  });

  // ---------- 5. E-Commerce Cart System ----------
  let cart = [];

  const cartBadgeCount = document.getElementById('cart-badge-count');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const toastNotification = document.getElementById('toast-notification');
  const checkoutBtn = document.getElementById('checkout-btn');

  const openCart = () => {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  };

  const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  };

  cartToggleBtn.addEventListener('click', openCart);
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  const showToast = (message) => {
    toastNotification.textContent = message;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3000);
  };

  const updateCartUI = () => {
    cartBadgeCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cart.length === 0) {
      cartItemsList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Your cart is currently empty.</p>';
      cartTotalPrice.textContent = '₹0';
      return;
    }

    let total = 0;
    cartItemsList.innerHTML = cart.map((item, index) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      return `
        <div class="cart-item">
          <div>
            <div class="cart-item-title">${item.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">Qty: ${item.qty}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="cart-item-price">₹${itemTotal.toLocaleString()}</span>
            <button class="remove-cart-item" data-index="${index}" style="color: #ff4d4d; font-size: 1rem;">&times;</button>
          </div>
        </div>
      `;
    }).join('');

    cartTotalPrice.textContent = `₹${total.toLocaleString()}`;

    // Attach remove handlers
    document.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        cart.splice(idx, 1);
        updateCartUI();
      });
    });
  };

  // Add to cart button handler
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10);

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      updateCartUI();
      showToast(`Added ${name} to cart!`);
    });
  });

  // Buy Now button handler
  document.querySelectorAll('.buy-now-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10);

      const existingItem = cart.find(item => item.name === name);
      if (!existingItem) {
        cart.push({ name, price, qty: 1 });
      }

      updateCartUI();
      openCart();
    });
  });

  // Checkout button handler
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Please add products before checking out.');
      return;
    }
    alert('Thank you for your order! Redirecting to secure checkout...');
    cart = [];
    updateCartUI();
    closeCart();
  });

  // ---------- 6. Book Visit Form Handling ----------
  const visitForm = document.getElementById('visit-form');
  if (visitForm) {
    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('visit-name').value;
      alert(`Thank you ${name}! Your free visit pass has been booked. Our team will contact you shortly.`);
      visitForm.reset();
    });
  }

});
