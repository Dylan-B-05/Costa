// confirmation.js

window.addEventListener("DOMContentLoaded", () => {
  let orderData = JSON.parse(localStorage.getItem("costaOrder") || "{}");

  let orderNumberEl = document.getElementById("order-number");
  let orderDetailsEl = document.getElementById("order-details");
  let paymentMessageEl = document.getElementById("payment-message");

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

    // show tip if any
    if (orderData.tip && orderData.tip > 0) {
      html += `<p><strong>Tip:</strong> €${orderData.tip.toFixed(2)}</p>`;
    }

    let subtotal = orderData.cart.reduce((acc, curr) => acc + curr.totalPrice, 0);
    let grandTotal = subtotal + (orderData.tip || 0);
    html += `<p><strong>Total Paid:</strong> €${grandTotal.toFixed(2)}</p>`;
  } else {
    html += "<p>No order details found.</p>";
  }

  orderDetailsEl.innerHTML = html;

  if (orderData.paymentMethod === "cash") {
    paymentMessageEl.innerText = "You chose to pay by cash. Please visit the counter within 20 minutes.";
  } else {
    paymentMessageEl.innerText = "Your card payment will be processed shortly. Thank you!";
  }
});
