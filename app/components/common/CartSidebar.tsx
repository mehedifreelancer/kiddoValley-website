// components/cart/CartSidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useGlobal } from "@/app/contexts/GlobalContext";
import Button from "../shared/Button";

export default function CartSidebar() {
  // Use single useGlobal hook to get everything
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
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-3 p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-dark-elevated transition-colors"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.id}`}
                        onClick={closeCart}
                        className="relative w-20 h-20 rounded-md overflow-hidden bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10 flex-shrink-0"
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag size={24} className="text-stone-400" />
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex flex-col justify-between w-full ">
                        <div className="flex justify-between">

                        <Link
                          href={`/products/${item.id}`}
                          onClick={closeCart}
                          className="block"
                        >
                          <h3 className="font-medium text-stone-800 dark:text-stone-200 line-clamp-1 hover:text-[#E57373] transition-colors">
                            {item.name}
                          </h3>

                        </Link>
                        <button
                        onClick={() => removeFromCart(item.id)}
                        className=" p-1 hover:bg-stone-200 dark:hover:bg-dark-elevated rounded-full transition-colors self-start"
                      >
                        <Trash2
                          size={16}
                          className="text-red-400 dark:text-stone-400 "
                        />
                      </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-[#E57373]">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </span>

                          <div className="flex items-center border border-stone-200 dark:border-dark-border rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors rounded-l-md"
                            >
                              <Minus
                                size={14}
                                className="text-stone-600 dark:text-stone-400"
                              />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-stone-700 dark:text-stone-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors rounded-r-md"
                            >
                              <Plus
                                size={14}
                                className="text-stone-600 dark:text-stone-400"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {cart.length > 0 && (
              <div className="p-2 border-t border-stone-200 dark:border-dark-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-stone-600 dark:text-stone-400">
                    মোট:
                  </span>
                  <span className="text-xl font-bold text-[#E57373]">
                    ৳{cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/checkout" onClick={closeCart}>
                    <Button variant="primary" size="lg" fullWidth>
                      অর্ডার কনফার্ম করুন
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={closeCart}
                  >
                    শপিং চালিয়ে যান
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
