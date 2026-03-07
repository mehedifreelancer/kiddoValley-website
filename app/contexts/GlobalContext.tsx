// contexts/GlobalContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Cart Item Interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  author?: string;
}

// Context type with everything
interface GlobalContextType {
  // Theme
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Cart Sidebar
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// Create context
export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

// Custom hook
export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within GlobalProvider");
  }
  return context;
}

// Provider
export function GlobalProvider({ children }: { children: ReactNode }) {
  // Theme state
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem("themeMode") as
      | "light"
      | "dark"
      | null;
    if (savedTheme) {
      setThemeMode(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Update document when theme changes
  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // Cart functions
  const addToCart = (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      const quantityToAdd = item.quantity || 1;

      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantityToAdd } : i,
        );
      } else {
        return [
          ...prev,
          {
            ...item,
            quantity: quantityToAdd,
            imageUrl: item.imageUrl || "",
          },
        ];
      }
    });

    // Open cart sidebar when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart calculations
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart sidebar functions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <GlobalContext.Provider
      value={{
        themeMode,
        setThemeMode,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
