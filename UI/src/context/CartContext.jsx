import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [checkoutSession, setCheckoutSession] = useState(null);
  const [isLocked, setIsLocked] = useState(false); // When QR is generated
  const [sessionId, setSessionId] = useState(localStorage.getItem('cartSessionId') || null);
  const [storeId, setStoreId] = useState('dummystore'); // We can hardcode or get from QR

  const startSession = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      const response = await fetch('https://zippycart-backend.onrender.com/api/session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSessionId(data.session_id);
        localStorage.setItem('cartSessionId', data.session_id);
        setItems([]);
        setIsLocked(false);
        return data.session_id;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Failed to start session", err);
      throw err;
    }
  };

  const addItem = (product) => {
    if (isLocked) return;
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [{ product, quantity: 1 }, ...prevItems];
    });
  };

  const removeItem = (productId) => {
    if (isLocked) return;
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    if (isLocked) return;
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCheckoutSession(null);
    setIsLocked(false);
  };

  const processCheckout = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      const response = await fetch(`https://zippycart-backend.onrender.com/api/${sessionId}/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setCheckoutSession({
          id: data.qr_data,
          total: data.total_amount,
          items: [...items],
          createdAt: new Date().toISOString()
        });
        setIsLocked(true);
        return true;
      } else {
        throw new Error(data.message || 'Checkout failed');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      throw err;
    }
  };

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        processCheckout,
        checkoutSession,
        isLocked,
        setIsLocked,
        sessionId,
        startSession,
        storeId
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
