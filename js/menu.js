// menu.js

let currentItem = {
  name: "",
  description: "",
  basePrice: 0,
  hasMultipleSizes: false,
  sizePrices: {}
};

const modal = document.getElementById("customizationModal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPriceEl = document.getElementById("cart-total-price");

let extraShotsCount = 0;

// Food => direct add
function addFoodToCart(item) {
  let quantity = 1; // or allow user-chosen quantity
  let totalPrice = item.price * quantity;

  let cartItem = {
    name: item.name,
    description: item.description,
    size: "N/A",
    extras: [],
    espressoShots: 0,
    notes: "",
    quantity: quantity,
    unitPrice: item.price,
    totalPrice: totalPrice
  };

  let cart = getCart();
  cart.push(cartItem);
  saveCart(cart);
  renderCart();
}

// Drinks => open modal
function openModal(name, desc, basePrice) {
  // Reset extras & shots
  extraShotsCount = 0;
  document.getElementById("shotCount").innerText = extraShotsCount;
  document.getElementById("modal-item-notes").value = "";
  document.getElementById("modal-item-quantity").value = 1;

  // Uncheck optional extras
  document.querySelectorAll('input[name="extra"]').forEach((cb) => {
    cb.checked = false;
  });

  // Single base price for now (if you want multiple sizes, adapt code)
  currentItem.hasMultipleSizes = false;
  currentItem.sizePrices = {};
  currentItem.name = name;
  currentItem.description = desc;
  currentItem.basePrice = basePrice;

  // Update modal fields
  document.getElementById("modal-item-name").innerText = name;
  document.getElementById("modal-item-desc").innerText = desc;
  document.getElementById("modal-item-calories").innerText = 0;

  // Hide size radios
  document.getElementById("size-section").style.display = "none";

  // Show the modal
  updateModalPrice();
  modal.style.display = "block";
}

// Close modal
function closeModal() {
  modal.style.display = "none";
}

// Shots +/-
document.getElementById("incrementShots").addEventListener("click", () => {
  extraShotsCount++;
  document.getElementById("shotCount").innerText = extraShotsCount;
  updateModalPrice();
});
document.getElementById("decrementShots").addEventListener("click", () => {
  if (extraShotsCount > 0) {
    extraShotsCount--;
    document.getElementById("shotCount").innerText = extraShotsCount;
    updateModalPrice();
  }
});

// Recalc modal price
function updateModalPrice() {
  let quantity = parseInt(document.getElementById("modal-item-quantity").value, 10);
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  }

  // Extras
  let extrasTotal = 0;
  document.querySelectorAll('input[name="extra"]').forEach((cb) => {
    if (cb.checked) {
      extrasTotal += parseFloat(cb.dataset.price);
    }
  });

  // Shots
  let shotsTotal = extraShotsCount * 0.5;

  // Single base price
  let basePrice = currentItem.basePrice;
  let singleItemPrice = basePrice + extrasTotal + shotsTotal;
  let finalPrice = singleItemPrice * quantity;

  document.getElementById("modal-item-price").innerText = "€" + finalPrice.toFixed(2);
}

// React on changes
document.addEventListener("change", (e) => {
  if (
    e.target.matches('input[name="extra"]') ||
    e.target.matches('#modal-item-quantity')
  ) {
    updateModalPrice();
  }
});

// Add the drink from modal
function addToCart() {
  let quantity = parseInt(document.getElementById("modal-item-quantity").value, 10);
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  }

  // Gather extras
  let selectedExtras = [];
  let extrasTotal = 0;
  document.querySelectorAll('input[name="extra"]').forEach((cb) => {
    if (cb.checked) {
      selectedExtras.push(cb.value);
      extrasTotal += parseFloat(cb.dataset.price);
    }
  });

  // Shots
  let shotsSubtotal = extraShotsCount * 0.5;

  let unitPrice = currentItem.basePrice + extrasTotal + shotsSubtotal;
  let totalPrice = unitPrice * quantity;

  let notes = document.getElementById("modal-item-notes").value;

  let cartItem = {
    name: currentItem.name,
    description: currentItem.description,
    size: "N/A",
    extras: selectedExtras,
    espressoShots: extraShotsCount,
    notes: notes,
    quantity: quantity,
    unitPrice: unitPrice,
    totalPrice: totalPrice
  };

  let cart = getCart();
  cart.push(cartItem);
  saveCart(cart);

  closeModal();
  renderCart();
}

// Render the cart in the sticky cart
function renderCart() {
  let cart = getCart();
  cartItemsContainer.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");
    itemEl.innerHTML = `
      <strong>${item.name}</strong> 
      (<em>${item.size}</em>) x ${item.quantity}
      <br>€${item.totalPrice.toFixed(2)}
      <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      <hr />
    `;
    cartItemsContainer.appendChild(itemEl);
    total += item.totalPrice;
  });
  cartTotalPriceEl.innerText = "€" + total.toFixed(2);
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function goToCheckout() {
  window.location.href = "checkout.html";
}

// On page load
window.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
