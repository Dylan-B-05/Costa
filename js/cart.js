// cart.js

function getCart() {
  let cartData = localStorage.getItem('costaCart');
  if (!cartData) {
    return [];
  }
  return JSON.parse(cartData);
}

function saveCart(cart) {
  localStorage.setItem('costaCart', JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem('costaCart');
}
