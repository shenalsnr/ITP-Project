// lib/cart.js (or wherever you manage cart logic)

export function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem("cart");
}
