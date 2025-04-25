// checkout.js

const checkoutItemsContainer = document.getElementById("checkout-items");
const checkoutSubtotalEl = document.getElementById("checkout-subtotal");
const checkoutTotalEl = document.getElementById("checkout-total");
const tipInput = document.getElementById("tipInput");

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
  checkoutSubtotalEl.innerText = "€" + subtotal.toFixed(2);

  let tip = parseFloat(tipInput.value) || 0;
  checkoutTotalEl.innerText = "€" + (subtotal + tip).toFixed(2);
}

tipInput.addEventListener("input", () => {
  renderCheckout();
});

function placeOrder() {
  let paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  let orderNumber = "CST" + Math.floor(100000 + Math.random() * 900000);

  let orderData = {
    orderNumber: orderNumber,
    cart: getCart(),
    tip: parseFloat(tipInput.value) || 0,
    paymentMethod: paymentMethod
  };
  localStorage.setItem("costaOrder", JSON.stringify(orderData));

  clearCart();
  window.location.href = "confirmation.html";
}

window.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
});
