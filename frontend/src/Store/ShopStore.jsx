import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

// Create and export the ShopStore context
export const ShopStore = createContext(null);

// Custom hook to use the store context
export const useStore = () => useContext(ShopStore);

const ShopStoreProvider = (props) => {
  const [data_products, setData_Product] = useState([]); // All products from backend

  // Initialize guest cart and wishlist if user is not logged in
  const initialGuestCart = localStorage.getItem("auth-token")
    ? {}
    : JSON.parse(localStorage.getItem("guest-cart") || "{}");

  const initialGuestWishlist = localStorage.getItem("auth-token")
    ? []
    : JSON.parse(localStorage.getItem("guest-wishlist") || "[]");

  const [cartItems, setCartItems] = useState(initialGuestCart);
  const [wishlist, setWishlist] = useState(initialGuestWishlist);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true); // Track initial load status

  // Fetch logged-in user's cart from backend
  const fetchCart = () => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("http://localhost:4000/getcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({}),
      })
        .then(res => res.json())
        .then(data => setCartItems(data))
        .catch(err => console.error("Error fetching cart:", err));
    }
  };

  // Fetch wishlist for logged-in user from backend
  const fetchWishlist = () => {
    const email = localStorage.getItem("user-email");
    if (email) {
      fetch("http://localhost:4000/getwishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email }),
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setWishlist(data);
        })
        .catch(err => console.error("Error fetching wishlist:", err));
    }
  };

  // Push full cart object to backend for logged-in users
  const syncCartToBackend = async (cart) => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    await fetch("http://localhost:4000/sync-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ cartData: cart }),
    });
  };

  // Initial fetch for products, and optional guest-to-user sync
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const email = localStorage.getItem("user-email");
    const localCart = localStorage.getItem("guest-cart");
    const localWishlist = localStorage.getItem("guest-wishlist");

    // If guest, restore local cart/wishlist
    if (!token) {
      if (localCart) setCartItems(JSON.parse(localCart));
      if (localWishlist) setWishlist(JSON.parse(localWishlist));
    }

    // Fetch all products
    fetch("http://localhost:4000/allproducts")
      .then(res => res.json())
      .then(data => {
        setData_Product(data);

        // If user just logged in, sync local guest cart/wishlist
        if (token) {
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            Object.entries(parsedCart).forEach(([key, qty]) => {
              for (let i = 0; i < qty; i++) {
                fetch("http://localhost:4000/addtocart", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                  },
                  body: JSON.stringify({ itemId: key }),
                });
              }
            });
            localStorage.removeItem("guest-cart");
          }

          if (localWishlist) {
            const parsedWishlist = JSON.parse(localWishlist);
            parsedWishlist.forEach(item => {
              fetch("http://localhost:4000/addtowishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userEmail: email,
                  itemId: item.id,
                  size: item.size,
                }),
              });
            });
            localStorage.removeItem("guest-wishlist");
          }

          fetchCart();
          fetchWishlist();
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      localStorage.setItem("guest-cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Save wishlist to localStorage for guest users
  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      localStorage.setItem("guest-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Add product to cart
  const addToCart = async (itemId, size) => {
    const key = `${itemId}_${size}`;
    const updatedCart = { ...cartItems, [key]: (cartItems[key] || 0) + 1 };
    setCartItems(updatedCart);

    if (localStorage.getItem("auth-token")) {
      await syncCartToBackend(updatedCart);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemKey) => {
    setCartItems(prev => {
      const newCart = { ...prev, [itemKey]: Math.max((prev[itemKey] || 0) - 1, 0) };
      if (newCart[itemKey] === 0) delete newCart[itemKey];

      // Sync updated cart to backend
      if (localStorage.getItem("auth-token")) {
        fetch("http://localhost:4000/sync-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({ cartData: newCart }),
        });
      }

      return newCart;
    });

    toast.info("Item removed from cart");
  };

  // Add product to wishlist
  const addToWishlist = async (itemId, size) => {
    const alreadyExists = wishlist.some(item => item.id === itemId && item.size === size);
    if (alreadyExists) return toast.info("Already in wishlist");

    const product = data_products.find(p => p.id === itemId);
    if (!product) return;

    const updated = [...wishlist, { ...product, size }];
    setWishlist(updated);
    toast.success("Added to wishlist");

    const email = localStorage.getItem("user-email");
    if (email) {
      await fetch("http://localhost:4000/addtowishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email, itemId, size }),
      });
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (itemId, size) => {
    const updated = wishlist.filter(item => !(item.id === itemId && item.size === size));
    setWishlist(updated);
    toast.info("Removed from wishlist");

    const email = localStorage.getItem("user-email");
    if (email) {
      await fetch("http://localhost:4000/removefromwishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email, itemId, size }),
      });
    }
  };

  // Clear the cart completely
  const clearCart = () => {
    setCartItems({});
    toast.info("Cart cleared");
  };

  // Apply a fixed promo code
  const applyPromoCode = (code) => {
    const formatted = code.trim().toLowerCase();
    if (formatted === "spring20") {
      setPromoCode(code);
      setDiscount(0.2); // 20% discount
      toast.success("Promo code applied! 🎉");
    } else {
      setPromoCode('');
      setDiscount(0);
      toast.error("Invalid promo code.");
    }
  };

  // Calculate total cart value (after discount if applicable)
  const getTotalCartAmount = (applyDiscount = true) => {
    let total = 0;
    for (const key in cartItems) {
      const [itemId] = key.split('_');
      const product = data_products.find(p => p.id === Number(itemId));
      if (product) total += product.new_price * cartItems[key];
    }
    return applyDiscount ? total * (1 - discount) : total;
  };

  // Show loading message while initializing
  if (loading) return <div>Loading store data...</div>;

  // Provide context values to the rest of the app
  return (
    <ShopStore.Provider value={{
      data_products,
      setData_Product,
      cartItems,
      setCartItems,
      wishlist,
      setWishlist,
      addToCart,
      removeFromCart,
      addToWishlist,
      removeFromWishlist,
      clearCart,
      applyPromoCode,
      promoCode,
      discount,
      getTotalCartAmount,
    }}>
      {props.children}
    </ShopStore.Provider>
  );
};

export default ShopStoreProvider;
