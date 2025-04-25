// confirmation.js

window.addEventListener("DOMContentLoaded", () => {
  const orderData = JSON.parse(localStorage.getItem("costaOrder") || "{}");

  const orderNumberEl  = document.getElementById("order-number");
  const orderDetailsEl = document.getElementById("order-details");
  const paymentMsgEl   = document.getElementById("payment-message");

  orderNumberEl.innerText = orderData.orderNumber || "N/A";

  let html = "";
  if (orderData.cart) {
    orderData.cart.forEach((item) => {
      html += `
        <div class="confirmation-item">
          <p><strong>${item.name}</strong> (${item.size}) x ${item.quantity}</p>
          <p>Extras: ${item.extras.join(", ") || "None"}</p>
          <p>Extra Shots: ${item.espressoShots || 0}</p>
          <p>Notes: ${item.notes || "N/A"}</p>
          <p>Item Total: €${item.totalPrice.toFixed(2)}</p>
          <hr/>
        </div>
      `;
    });

    /* Totals */
    const subtotal = orderData.subtotal ?? orderData.cart.reduce((a, c) => a + c.totalPrice, 0);
    const discount = orderData.discount ?? subtotal * 0.05;
    const tip      = orderData.tip      ?? 0;
    const grand    = subtotal - discount + tip;

    html += `<p><strong>Subtotal:</strong> €${subtotal.toFixed(2)}</p>`;
    html += `<p><strong>Discount (5 %):</strong> -€${discount.toFixed(2)}</p>`;
    if (tip > 0) {
      html += `<p><strong>Tip:</strong> €${tip.toFixed(2)}</p>`;
    }
    html += `<p><strong>Total Paid:</strong> €${grand.toFixed(2)}</p>`;
  } else {
    html += "<p>No order details found.</p>";
  }

  orderDetailsEl.innerHTML = html;

  /* Payment note */
  if (orderData.paymentMethod === "cash") {
    paymentMsgEl.innerText =
      "You chose to pay by cash. Please visit the counter within 20 minutes.";
  } else {
    paymentMsgEl.innerText =
      "Your card payment will be processed shortly. Thank you!";
  }
});
