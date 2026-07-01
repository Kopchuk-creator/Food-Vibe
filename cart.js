// --- Утиліта для безпечної роботи з localStorage ---
window.storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Помилка читання ${key} з localStorage. Очищення...`, e);
      localStorage.removeItem(key);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Помилка запису ${key} у localStorage:`, e);
    }
  }
};

let cart = window.storage.get('cafe_cart', []);

function saveCart() {
  window.storage.set('cafe_cart', cart);
  updateCartCount();
  renderCart();
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300); 
  }, 3000);
}

function addToCart(id) {
  const item = window.menuData.find(i => i.id === id);
  if (!item || !item.available) return;

  const existingItem = cart.find(i => i.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: 1
    });
  }
  
  saveCart();
  showToast(`✅ <strong>${item.name}</strong> додано в кошик`);

  // --- Анімація іконки кошика при додаванні ---
  const cartToggleBtn = document.querySelector('.cart-toggle');
  if (cartToggleBtn) {
    cartToggleBtn.classList.remove('cart-bounce');
    void cartToggleBtn.offsetWidth; // Reflow
    cartToggleBtn.classList.add('cart-bounce');
  }
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    const parsedDelta = parseInt(delta, 10) || 0;
    item.qty = (parseInt(item.qty, 10) || 0) + parsedDelta;
    
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
    }
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function getTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCount() {
  return cart.reduce((count, item) => count + item.qty, 0);
}

// --- Розрахунок доставки/знижки (узгоджено з умовами на сторінці "Доставка") ---
const DELIVERY_FEE = 50;
const FREE_DELIVERY_THRESHOLD = 400;
const PICKUP_DISCOUNT_RATE = 0.10;

function getDeliveryFee(orderType) {
  if (orderType !== 'delivery') return 0;
  const subtotal = getTotal();
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

function getPickupDiscount(orderType) {
  if (orderType !== 'pickup') return 0;
  return Math.round(getTotal() * PICKUP_DISCOUNT_RATE);
}

function getFinalTotal(orderType) {
  return getTotal() + getDeliveryFee(orderType) - getPickupDiscount(orderType);
}

function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const count = getCount();
  countElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function updateFreeDeliveryProgress(total) {
  const threshold = 400;
  const progressText = document.getElementById('delivery-progress-text');
  const progressFill = document.getElementById('delivery-progress-fill');
  
  if (!progressText || !progressFill) return;

  if (total >= threshold) {
    progressText.innerHTML = '🎉 <strong>Ура!</strong> У вас безкоштовна доставка!';
    progressFill.style.width = '100%';
    progressFill.classList.add('success');
  } else {
    const remaining = threshold - total;
    progressText.innerHTML = `Додайте товарів ще на <strong>${remaining} грн</strong> для безкоштовної доставки!`;
    const percent = (total / threshold) * 100;
    progressFill.style.width = `${percent}%`;
    progressFill.classList.remove('success');
  }
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items-list');
  const cartTotalElement = document.getElementById('cart-total-price');
  
  if (!cartItemsContainer || !cartTotalElement) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty-msg">Ваш кошик порожній 🛒</div>';
    cartTotalElement.textContent = '0 грн';
    document.getElementById('cart-checkout-btn').disabled = true;
    updateFreeDeliveryProgress(0); 
    return;
  }

  document.getElementById('cart-checkout-btn').disabled = false;
  let html = '';
  
  cart.forEach(item => {
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${item.price} грн</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Видалити</button>
          </div>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = html;
  const currentTotal = getTotal();
  cartTotalElement.textContent = `${currentTotal} грн`;
  
  updateFreeDeliveryProgress(currentTotal);
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden'; 
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();
  
  document.getElementById('close-cart-btn')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'cart-overlay') closeCart();
  });
});