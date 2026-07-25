// components/cart/CartSidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useGlobal } from "@/app/contexts/GlobalContext";
import Button from "../shared/Button";
import CartItem from "../shared/CartItem";

export default function CartSidebar() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    isCartOpen,
    closeCart,
  } = useGlobal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-dark-surface shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#BA68C8]" />
                <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                  আপনার কার্ট ({cartCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors"
              >
                <X size={20} className="text-stone-600 dark:text-stone-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag
                    size={64}
                    className="text-stone-300 dark:text-stone-600 mb-4"
                  />
                  <p className="text-stone-600 dark:text-stone-400 mb-2">
                    আপনার কার্ট খালি
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-500">
                    পণ্য যোগ করতে শপিং চালিয়ে যান
                  </p>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={closeCart}
                    className="mt-4"
                  >
                    শপিং চালিয়ে যান
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CartItem
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                          onItemClick={closeCart}
                          variant="sidebar"
                          showRemove={true}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            <div className="flex justify-between items-center mb-1 p-2">
              <span className="text-stone-600 dark:text-stone-400">মোট:</span>
              <div className="text-right">
                <span className="text-xl font-bold text-[#E57373]">
                  ৳{cartTotal.toFixed(2)}
                </span>
                <p className="text-xs text-stone-400">(+ ডেলিভারি চার্জ)</p>
              </div>
            </div>
            {cart.length > 0 && (
              <div className="flex flex-row gap-1 p-3">
                <Link href="/checkout" onClick={closeCart} className="flex-1">
                  <Button className="w-full" variant="primary" size="md">
                    অর্ডার কনফার্ম করুন
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  {" "}
                  {/* অথবা যে পেজে যেতে চান */}
                  <Button
                    className="w-full"
                    variant="outline"
                    size="md"
                    onClick={closeCart}
                  >
                    শপিং চালিয়ে যান
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
