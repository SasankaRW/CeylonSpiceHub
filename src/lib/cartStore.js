
// Cart state management
// Helper function to normalize cart items from localStorage
const normalizeCartFromStorage = () => {
  try {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    // Filter out invalid items and normalize IDs
    return storedCart.filter(item => {
      // Basic validation: must have an ID
      const hasId = item._id || item.id;
      // Relaxed price check: allow strings that can be parsed
      const price = parseFloat(item.price);
      const hasPrice = !isNaN(price);

      // Update the item price to be a number if it's a valid string
      if (hasPrice) {
        item.price = price;
      }

      return hasId && hasPrice;
    }).map(item => {
      // Ensure all items have a consistent 'id' field
      if (item._id && !item.id) {
        return { ...item, id: item._id };
      }
      return item;
    });
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

let cart = normalizeCartFromStorage();
let listeners = [];

// Helper function to normalize product ID (handle both _id and id)
const normalizeProductId = (product) => {
  return product._id || product.id;
};

// Helper function to get unique cart item identifier (product ID + variant)
const getCartItemId = (product) => {
  const baseId = normalizeProductId(product);
  // If product has variant info, include it in the ID
  if (product.variantId) {
    return `${baseId}-${product.variantId}`;
  }
  if (product.variantType && product.variantWeight) {
    return `${baseId}-${product.variantType}-${product.variantWeight}`;
  }
  return baseId;
};

// Helper function to normalize cart item for storage
const normalizeCartItem = (product, quantity) => {
  const normalizedProduct = { ...product };
  // Ensure we have a consistent 'id' field
  if (normalizedProduct._id && !normalizedProduct.id) {
    normalizedProduct.id = normalizedProduct._id;
  }
  // Add cart item ID for variant tracking
  normalizedProduct.cartItemId = getCartItemId(normalizedProduct);
  return { ...normalizedProduct, quantity };
};

export const getCart = () => cart;

export const addToCart = (product, quantity = 1) => {
  if (!product) {
    console.error('Cannot add to cart: product is null or undefined');
    return;
  }

  // Validate and normalize product price
  let price = parseFloat(product.price);
  if (isNaN(price)) {
    console.error('Cannot add to cart: product has invalid price', product);
    return;
  }

  // Create a safe copy of the product with normalized price
  const safeProduct = { ...product, price };

  const productId = normalizeProductId(product);
  if (!productId) {
    console.error('Cannot add to cart: product has no valid ID', product);
    return;
  }

  const cartItemId = getCartItemId(product);

  // Find existing item by cart item ID (includes variant info)
  const existingItem = cart.find(item => {
    const itemCartId = item.cartItemId || getCartItemId(item);
    return itemCartId === cartItemId;
  });

  if (existingItem) {
    cart = cart.map(item => {
      const itemCartId = item.cartItemId || getCartItemId(item);
      if (itemCartId === cartItemId) {
        return { ...item, quantity: item.quantity + quantity };
      }
      return item;
    });
  } else {
    // Use safeProduct instead of product
    const normalizedItem = normalizeCartItem(safeProduct, quantity);
    cart = [...cart, normalizedItem];
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  notifyListeners();
};

export const removeFromCart = (productId) => {
  // productId can be either a base product ID or a cartItemId
  cart = cart.filter(item => {
    const itemId = normalizeProductId(item);
    const itemCartId = item.cartItemId || getCartItemId(item);
    return itemId !== productId && itemCartId !== productId;
  });
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyListeners();
};

export const updateQuantity = (productId, quantity) => {
  // productId can be either a base product ID or a cartItemId
  cart = cart.map(item => {
    const itemId = normalizeProductId(item);
    const itemCartId = item.cartItemId || getCartItemId(item);
    if (itemId === productId || itemCartId === productId) {
      return { ...item, quantity: Math.max(0, quantity) };
    }
    return item;
  });

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
