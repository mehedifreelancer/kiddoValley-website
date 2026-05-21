// app/checkout/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  Truck,
  Wallet,
  Trash2,
} from "lucide-react";
import { useGlobal } from "../contexts/GlobalContext";
import Button from "../components/shared/Button";
import CartItem from "../components/shared/CartItem";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } =
    useGlobal();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const deliveryCharge = 60;
  const grandTotal = cartTotal + deliveryCharge;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { formData, cart, grandTotal });
    alert("অর্ডার কনফার্ম হয়েছে! আপনার ফোন নম্বরে কল দেওয়া হবে।");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center relative">
        {/* Background blur overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 backdrop-blur-xl -z-10" />

        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-2xl p-12 border border-white/30 dark:border-white/10 text-center">
          <ShoppingBag
            size={64}
            className="text-stone-300 dark:text-stone-600 mb-4 mx-auto"
          />
          <h1 className="text-2xl font-light text-stone-800 dark:text-stone-200 mb-2">
            আপনার কার্ট খালি
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            অর্ডার করতে চাইলে প্রথমে পণ্য যোগ করুন
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              শপিং চালিয়ে যান
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Background blur overlay with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 backdrop-blur-xl -z-10" />

      <h1 className="w-full text-bold text-center text-3xl font-light text-stone-800 dark:text-stone-200 mb-4 backdrop-blur-md bg-white/40 dark:bg-black/30 p-4 rounded-2xl border border-white/30 dark:border-white/10 inline-block shadow-md">
        অর্ডার কনফার্মেশন
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Left Side - Cart Summary */}
        <div className="h-full">
          <div className="backdrop-blur-sm bg-white/40 dark:bg-black/30 rounded-2xl shadow-md overflow-hidden border border-white/30 dark:border-white/10 h-full flex flex-col">
            <div className="p-4 border-b border-white/30 dark:border-white/10 bg-white/10 dark:bg-black/40">
              <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#E57373]" />
                আপনার পণ্যসমূহ ({cartCount})
              </h2>
            </div>

            {/* Cart Items List - Scrollable if needed */}
            <div className="divide-y divide-white/20 dark:divide-white/10 flex-1 overflow-y-auto max-h-[500px]">
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
                        variant="checkout"
                        showRemove={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Price Summary - Stays at bottom */}
            <div className="p-4 backdrop-blur-xl bg-white/30 dark:bg-black/40 border-t border-white/30 dark:border-white/10 mt-auto">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-700 dark:text-stone-300">
                    সাবটোটাল:
                  </span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    ৳{cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Truck size={14} /> ডেলিভারি চার্জ:
                  </span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    ৳{deliveryCharge.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-white/30 dark:border-white/10 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-stone-800 dark:text-stone-200">
                      মোট:
                    </span>
                    <span className="text-xl text-[#E57373]">
                      ৳{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Order Form */}
        <div className="h-full">
          <div className="backdrop-blur-sm bg-white/60 dark:bg-black/30 rounded-2xl shadow-md overflow-hidden border border-white/30 dark:border-white/10 h-full flex flex-col">
            <div className="p-4 border-b border-white/30 dark:border-white/10 bg-white/10 dark:bg-black/40">
              <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Wallet size={18} className="text-[#BA68C8]" />
                প্রাপক তথ্য
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-1 flex-1 flex flex-col"
            >
              <div className="space-y-6 flex-1">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
                  >
                    নাম <span className="text-[#E57373]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
                  >
                    মোবাইল নম্বর <span className="text-[#E57373]">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="০১XXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all"
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
                  >
                    সম্পূর্ণ ঠিকানা <span className="text-[#E57373]">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="জেলা, থানা, গ্রাম/শহর, বাড়ি নম্বর, রাস্তার নাম"
                    className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Payment Info - Glassy */}
                <div className="backdrop-blur-md bg-gradient-to-br from-white/30 to-white/10 dark:from-black/40 dark:to-black/20 rounded-xl p-4 border border-white/30 dark:border-white/10 shadow-lg">
                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 mb-2">
                    <Wallet size={18} className="text-[#BA68C8]" />
                    <span className="text-sm font-medium">পেমেন্ট তথ্য</span>
                  </div>
                  <p className="text-sm text-stone-600/90 dark:text-stone-400/90">
                    পণ্য হাতে পেয়ে নগদ অর্থ পরিশোধ করুন
                  </p>
                </div>
              </div>

              {/* Confirm Order Button - Stays at bottom */}
              <div className="mt-auto pt-4">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="mt-4"
                >
                  অর্ডার কনফার্ম করুন
                </Button>

                {/* Back to Cart Link */}
                <div className="text-center mt-4">
                  <Link
                    href="/cart"
                    className="text-sm text-[#BA68C8]/90 hover:text-[#8E4C9E] transition-colors backdrop-blur-sm px-4 py-2 rounded-lg bg-white/10 dark:bg-black/20 inline-block border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30"
                  >
                    ← কার্টে ফিরে যান
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
