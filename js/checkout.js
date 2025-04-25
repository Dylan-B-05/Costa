// checkout.js

const checkoutItemsContainer = document.getElementById("checkout-items");
const checkoutSubtotalEl     = document.getElementById("checkout-subtotal");
const checkoutDiscountEl     = document.getElementById("checkout-discount");
const checkoutTotalEl        = document.getElementById("checkout-total");
const tipInput               = document.getElementById("tipInput");

const DISCOUNT_RATE = 0.05;   // 5 %

function renderCheckout() {
  const cart = getCart();
  let subtotal = 0;
  checkoutItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    subtotal += item.totalPrice;
    let itemEl = document.createElement("div");
    itemEl.classList.add("checkout-item");
    itemEl.innerHTML = `
      <p><strong>${item.name}</strong> (${item.size}) x ${item.quantity}</p>
      <p>Extras: ${item.extras.join(", ") || "None"}</p>
      <p>Extra Shots: ${item.espressoShots || 0}</p>
      <p>Notes: ${item.notes || "N/A"}</p>
      <p>Item Total: €${item.totalPrice.toFixed(2)}</p>
      <hr/>
    `;
    checkoutItemsContainer.appendChild(itemEl);
  });

  const discount = subtotal * DISCOUNT_RATE;
  const tip      = parseFloat(tipInput.value) || 0;
  const total    = subtotal - discount + tip;

  checkoutSubtotalEl.innerText = "€" + subtotal.toFixed(2);
  checkoutDiscountEl.innerText = "-€" + discount.toFixed(2);
  checkoutTotalEl.innerText    = "€" + total.toFixed(2);
}

tipInput.addEventListener("input", renderCheckout);

function placeOrder() {
  const cart          = getCart();
  const subtotal      = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const discount      = subtotal * DISCOUNT_RATE;
  const tip           = parseFloat(tipInput.value) || 0;
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const orderNumber   = "CST" + Math.floor(100000 + Math.random() * 900000);

  const orderData = {
    orderNumber,
    cart,
    subtotal,
    discount,
    tip,
    paymentMethod
  };

  localStorage.setItem("costaOrder", JSON.stringify(orderData));
  clearCart();
  window.location.href = "confirmation.html";
}

window.addEventListener("DOMContentLoaded", renderCheckout);
