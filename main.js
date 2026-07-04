function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;'
  };
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match) => (map[match]));
}

document.addEventListener('DOMContentLoaded', () => {

  // --- Мобільне меню (компактний випадний список зліва зверху) ---
  const burgerBtn = document.getElementById('burger-menu');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle('open');
      burgerBtn.classList.toggle('open');
      burgerBtn.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
    });

    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !burgerBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  // --- Рендеринг карток страв ---
  function createCardHTML(item) {
    const badgeHtml = item.available 
      ? '' 
      : '<span class="card-badge unavailable">Немає в наявності</span>';
      
    const btnHtml = item.available
      ? `<button class="btn btn-primary" onclick="addToCart('${item.id}')">У кошик</button>`
      : `<button class="btn btn-primary" disabled>У кошик</button>`;

    return `
      <div class="card" data-category="${item.category}">
        <div class="card-img-wrap">
          <img src="${item.image}" alt="${item.name}" width="600" height="400" loading="lazy"
               class="fade-img"
               onload="this.classList.add('loaded')">
          ${badgeHtml}
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-desc">${item.description} <span style="opacity:.7">— ${item.weight}</span></p>
          <div class="card-footer">
            <span class="card-price">${item.price} грн</span>
            ${btnHtml}
          </div>
        </div>
      </div>
    `;
  }

  const popularGrid = document.getElementById('popular-grid');
  if (popularGrid) {
    const popularItems = window.menuData.filter(i => i.available).slice(0, 6);
    popularGrid.innerHTML = popularItems.map(createCardHTML).join('');
  }

  const menuGrid = document.getElementById('menu-grid');
  if (menuGrid) {
    const renderMenu = (category = 'all') => {
      let filtered = window.menuData;
      if (category !== 'all') {
        filtered = window.menuData.filter(i => i.category === category);
      }
      menuGrid.innerHTML = filtered.map(createCardHTML).join('');
      if (window.initScrollReveal) window.initScrollReveal();
    };

    renderMenu(); 

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.filter);
      });
    });

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Menu",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Основне меню",
          "hasMenuItem": window.menuData.map(item => ({
            "@type": "MenuItem",
            "name": "Затишне Кафе: " + item.name,
            "description": item.description,
            "image": item.image,
            "offers": {
              "@type": "Offer",
              "price": item.price,
              "priceCurrency": "UAH",
              "availability": item.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          }))
        }
      ]
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }

  // --- Логіка Чекауту ---
  const checkoutModal = document.getElementById('checkout-modal');
  const openCheckoutBtn = document.getElementById('cart-checkout-btn');
  const closeCheckoutBtn = document.getElementById('close-modal-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const deliveryToggles = document.querySelectorAll('.toggle-btn[data-type]');
  const addressGroup = document.getElementById('address-group');
  const finalTotal = document.getElementById('checkout-final-total');
  
  // Відновлюємо раніше обраний тип замовлення (доставка/самовивіз) з localStorage
  let currentOrderType = (window.storage ? window.storage.get('cafe_order_type') : null) || 'delivery';

  deliveryToggles.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === currentOrderType);
  });
  if (addressGroup) {
    if (currentOrderType === 'pickup') {
      addressGroup.style.display = 'none';
      document.getElementById('address')?.removeAttribute('required');
    } else {
      addressGroup.style.display = 'block';
      document.getElementById('address')?.setAttribute('required', 'required');
    }
  }

  function updateOrderSummary() {
    const subtotal = getTotal();
    const fee = getDeliveryFee(currentOrderType);
    const discount = getPickupDiscount(currentOrderType);
    const total = subtotal + fee - discount;

    const summaryEl = document.getElementById('order-summary');
    if (summaryEl) {
      let rows = `<div class="summary-row"><span>Товари</span><span>${subtotal} грн</span></div>`;
      if (currentOrderType === 'delivery') {
        rows += `<div class="summary-row"><span>Доставка</span><span>${fee === 0 ? 'Безкоштовно' : fee + ' грн'}</span></div>`;
      } else if (discount > 0) {
        rows += `<div class="summary-row summary-discount"><span>Знижка за самовивіз (10%)</span><span>-${discount} грн</span></div>`;
      }
      summaryEl.innerHTML = rows;
    }

    if (finalTotal) finalTotal.textContent = `${total} грн`;
    return total;
  }

  if (openCheckoutBtn && checkoutModal) {
    openCheckoutBtn.addEventListener('click', () => {
      if (getTotal() === 0) return;
      closeCart();
      checkoutModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      updateOrderSummary();
      showPhoneError('');

      const savedUser = window.storage ? window.storage.get('cafe_user_info') : null;
      if (savedUser) {
        document.getElementById('name').value = savedUser.name || '';
        document.getElementById('phone').value = savedUser.phone || '';
        if (savedUser.address && currentOrderType === 'delivery') {
          document.getElementById('address').value = savedUser.address;
        }
      }

      setTimeout(() => {
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.focus();
      }, 100);
    });
  }

  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  deliveryToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      deliveryToggles.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentOrderType = e.target.dataset.type;
      if (window.storage) window.storage.set('cafe_order_type', currentOrderType);

      const addressInput = document.getElementById('address');
      if (currentOrderType === 'pickup') {
        addressGroup.style.display = 'none';
        addressInput.removeAttribute('required');
        addressInput.value = '';
      } else {
        addressGroup.style.display = 'block';
        addressInput.setAttribute('required', 'required');
        if (!addressInput.value) {
          const savedUser = window.storage ? window.storage.get('cafe_user_info') : null;
          if (savedUser && savedUser.address) addressInput.value = savedUser.address;
        }
      }

      updateOrderSummary();
    });
  });

  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const submitBtn = document.getElementById('submit-order-btn');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (!submitBtn) return;
      if (e.target.value === 'card') {
        submitBtn.textContent = 'Перейти до оплати';
      } else {
        submitBtn.textContent = 'Підтвердити';
      }
    });
  });

  function validatePhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return /^[0-9+\-()\s]+$/.test(phone) && digitsOnly.length >= 9 && digitsOnly.length <= 13;
  }

  function showPhoneError(message) {
    const phoneInput = document.getElementById('phone');
    const phoneGroup = phoneInput.closest('.form-group');
    let phoneError = phoneGroup.querySelector('.form-error');
    if (!phoneError) {
      phoneError = document.createElement('span');
      phoneError.className = 'form-error';
      phoneGroup.appendChild(phoneError);
    }
    phoneError.textContent = message;
    phoneInput.classList.toggle('input-invalid', !!message);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const phone = document.getElementById('phone').value;

      if (!validatePhone(phone)) {
        showPhoneError('Невалідний формат. Приклад: +38 (050) 123-45-67 або 0501234567');
        document.getElementById('phone').focus();
        return;
      }
      showPhoneError('');

      const rawName = document.getElementById('name').value;
      const rawAddress = document.getElementById('address').value;
      const safeName = sanitizeInput(rawName);
      const safeAddress = currentOrderType === 'delivery' ? sanitizeInput(rawAddress) : null;

      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
      const orderPayload = {
        order: {
          type: currentOrderType,
          time: document.getElementById('time').value,
          paymentMethod: paymentMethod,
          itemsSubtotal: getTotal(),
          deliveryFee: getDeliveryFee(currentOrderType),
          discount: getPickupDiscount(currentOrderType),
          totalAmount: getFinalTotal(currentOrderType),
          createdAt: new Date().toISOString()
        },
        customer: {
          name: safeName, 
          phone: phone, 
          address: safeAddress 
        },
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty,
          priceAtPurchase: item.price
        }))
      };

      console.log('🚀 Дані готові до відправки на API:', JSON.stringify(orderPayload, null, 2));

      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Обробка...';
      submitBtn.classList.add('loading');

      setTimeout(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.classList.remove('loading');

        const userInfoToSave = {
          name: safeName,
          phone: phone,
          address: safeAddress
        };
        if (window.storage) {
          window.storage.set('cafe_user_info', userInfoToSave);
        }

        checkoutModal.classList.remove('open');
        checkoutForm.reset();

        const fakeOrderNum = 'FV-' + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('success-order-number').textContent = fakeOrderNum;

        document.getElementById('success-modal').classList.add('open');
        
        cart = [];
        saveCart();
      }, 2000);
    });
  }

  window.closeSuccessModal = function() {
    document.getElementById('success-modal').classList.remove('open');
    document.body.style.overflow = '';
    if (window.location.pathname.indexOf('index.html') === -1 && window.location.pathname !== '/') {
      window.location.href = 'index.html';
    }
  };

  // --- Premium Motion Design: Scroll Reveal & Parallax ---
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', 
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    let delay = 0; 
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('reveal-show');
        delay += 100; 
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  window.initScrollReveal = function() {
    const elementsToReveal = document.querySelectorAll('.card:not(.reveal-hidden), .info-box:not(.reveal-hidden), .section-title:not(.reveal-hidden)');
    elementsToReveal.forEach((el) => {
      el.classList.add('reveal-hidden'); 
      revealObserver.observe(el);        
    });
  };

  window.initScrollReveal();

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY <= heroSection.offsetHeight) {
            heroSection.style.backgroundPositionY = `${scrollY * 0.4}px`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
});