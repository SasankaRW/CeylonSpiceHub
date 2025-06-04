
// Cart state management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let listeners = [];

export const getCart = () => cart;

export const addToCart = (product, quantity = 1) => {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    cart = cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    cart = [...cart, { ...product, quantity }];
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyListeners();
};

export const removeFromCart = (productId) => {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyListeners();
};

export const updateQuantity = (productId, quantity) => {
  cart = cart.map(item =>
    item.id === productId
      ? { ...item, quantity: Math.max(0, quantity) }
      : item
  );
  
  cart = cart.filter(item => item.quantity > 0);
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyListeners();
};

export const clearCart = () => {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyListeners();
};

export const getCartTotal = () => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = () => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const subscribeToCart = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(listener => listener(cart));
};
