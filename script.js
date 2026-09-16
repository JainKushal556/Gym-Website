/* ============================================================
   XYZ GYM — Interactions & E-Commerce
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. Navbar Scroll State ----------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let currentSection = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- 2. Mobile Navigation ----------
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

  // ---------- 3. Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  // Stagger items inside grids
  const grids = document.querySelectorAll('.pricing-grid, .trainers-grid, .product-grid');
  grids.forEach(grid => {
    const items = grid.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    items.forEach((item, i) => {
      item.style.transitionDelay = `${(i % 4) * 0.1}s`;
    });
  });

  // Stagger why-us items
  const whyUsItems = document.querySelectorAll('.why-us-item.reveal');
  whyUsItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- 4. Store Category Filter ----------
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
          card.style.transitionDelay = `${index * 0.06}s`;
          setTimeout(() => card.classList.add('active'), 30);
        } else {
          card.style.display = 'none';
          card.classList.remove('active');
        }
      });
    });
  });

  // ---------- 5. Cart System ----------
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
    setTimeout(() => toastNotification.classList.remove('active'), 2500);
  };

  const updateCartUI = () => {
    cartBadgeCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cart.length === 0) {
      cartItemsList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.88rem;">Your cart is empty.</p>';
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
            <div style="font-size: 0.75rem; color: var(--text-muted);">Qty: ${item.qty}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="cart-item-price">₹${itemTotal.toLocaleString()}</span>
            <button class="remove-cart-item" data-index="${index}" style="color: #cc4444; font-size: 1rem; cursor: pointer; background: none; border: none;">&times;</button>
          </div>
        </div>
      `;
    }).join('');

    cartTotalPrice.textContent = `₹${total.toLocaleString()}`;

    document.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        cart.splice(idx, 1);
        updateCartUI();
      });
    });
  };

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10);

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      updateCartUI();
      showToast(`Added ${name} to cart`);
    });
  });

  document.querySelectorAll('.buy-now-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10);

      if (!cart.find(item => item.name === name)) {
        cart.push({ name, price, qty: 1 });
      }

      updateCartUI();
      openCart();
    });
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add products before checking out.');
      return;
    }
    alert('Thank you! Redirecting to secure checkout...');
    cart = [];
    updateCartUI();
    closeCart();
  });

  // ---------- 6. Book Visit Form ----------
  const visitForm = document.getElementById('visit-form');
  if (visitForm) {
    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('visit-name').value;
      alert(`Thank you ${name}! Your free visit has been booked. We'll contact you shortly.`);
      visitForm.reset();
    });
  }

});
