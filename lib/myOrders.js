// Tracks which order ids this browser created, so "/mis-pedidos" can show a
// history without any real customer account. Call only from client code.

const STORAGE_KEY = "hambry_my_orders";

export function addMyOrder(orderId) {
  const ids = getMyOrderIds();
  if (!ids.includes(orderId)) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([orderId, ...ids]));
  }
}

export function getMyOrderIds() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
