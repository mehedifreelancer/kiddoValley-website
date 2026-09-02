"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ---- Types ----
export interface CartItem {
  id: string;
  name: string;
  price: number; // discounted/final price — billing এর জন্য এটাই ব্যবহার হবে
  originalPrice?: number; // 🆕 discount না থাকলে undefined, থাকলে original MRP
  discountPercent?: number; // 🆕 UI badge এর জন্য
  quantity: number;
  stockId: number;
  weight: number;
  imageUrl?: string;
  sku?: string;
  variant?: any;
  author?: string;
}

export interface WebSettings {
  logoUrl: string | null;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    website: string;
  };
  footerText: string;
}

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

  buyNowItem: CartItem | null;
  startBuyNow: (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => void;
  updateBuyNowQuantity: (quantity: number) => void;
  clearBuyNowItem: () => void;

  // Cart Sidebar
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Mobile Menu
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;

  // ✅ Web Settings
  webSettings: WebSettings | null;
  setWebSettings: (settings: WebSettings) => void;
}

// ---- Context ----
export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within GlobalProvider");
  }
  return context;
}

// ---- Provider Props ----
interface GlobalProviderProps {
  children: ReactNode;
  initialSettings?: WebSettings | null; // ✅ layout থেকে আসবে
}

export function GlobalProvider({
  children,
  initialSettings = null,
}: GlobalProviderProps) {
  // Theme
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buyNowItem, setBuyNowItemState] = useState<CartItem | null>(null);

  // ✅ Web Settings
  const [webSettings, setWebSettings] = useState<WebSettings | null>(
    initialSettings,
  );

  // Load from localStorage on mount
  useEffect(() => {
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
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        console.error("Failed to parse cart");
      }
    }
    const savedBuyNow = sessionStorage.getItem("buyNowItem");
    if (savedBuyNow) {
      try {
        setBuyNowItemState(JSON.parse(savedBuyNow));
      } catch {
        console.error("Failed to parse buyNowItem");
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Theme effect
  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // ---- Cart functions ----
  const addToCart = (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => {
    console.log("🔍 addToCart called with item:", item);
    console.log("🔍 item.weight:", item.weight); // ডিবাগ: দেখুন weight আসছে কিনা
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const qty = item.quantity || 1;
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + qty,
                weight: item.weight ?? i.weight,
              }
            : i,
        );
      }
      return [
        ...prev,
        {
          ...item,
          quantity: qty,
          imageUrl: item.imageUrl || "",
          weight: item.weight ?? 0, // ✅ ডিফল্ট ০
        },
      ];
    });
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

  const clearCart = () => setCart([]);
  // 🆕 Buy Now functions
  const startBuyNow = (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => {
    const newItem: CartItem = {
      ...item,
      quantity: item.quantity || 1,
      imageUrl: item.imageUrl || "",
      weight: item.weight ?? 0,
    };
    setBuyNowItemState(newItem);
    sessionStorage.setItem("buyNowItem", JSON.stringify(newItem));
  };

  const updateBuyNowQuantity = (quantity: number) => {
    setBuyNowItemState((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, quantity };
      sessionStorage.setItem("buyNowItem", JSON.stringify(updated));
      return updated;
    });
  };

  const clearBuyNowItem = () => {
    setBuyNowItemState(null);
    sessionStorage.removeItem("buyNowItem");
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sidebar toggles
  const openCart = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    setIsCartOpen(true);
  };
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => {
    if (!isCartOpen && isMenuOpen) setIsMenuOpen(false);
    setIsCartOpen((prev) => !prev);
  };

  const openMenu = () => {
    if (isCartOpen) setIsCartOpen(false);
    setIsMenuOpen(true);
  };
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => {
    if (!isMenuOpen && isCartOpen) setIsCartOpen(false);
    setIsMenuOpen((prev) => !prev);
  };

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
        buyNowItem,
        startBuyNow,
        updateBuyNowQuantity,
        clearBuyNowItem,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        isMenuOpen,
        openMenu,
        closeMenu,
        toggleMenu,
        webSettings,
        setWebSettings,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
