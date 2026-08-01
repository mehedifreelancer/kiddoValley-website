"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Truck, Wallet } from "lucide-react";
import { useGlobal } from "../contexts/GlobalContext";
import Button from "../components/shared/Button";
import CartItem from "../components/shared/CartItem";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { placeOrder } from "./checkout.service";
import { checkBulkStock } from "../services/cart.service";
import { checkoutSchema } from "./checkout.schema";
import { checkStockForAdd, getUnavailableItemsList } from "../lib/stockUtils";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    updateQuantity: globalUpdateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    clearCart,
  } = useGlobal();

  // ✅ localStorage থেকে প্রি-ফিল
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingStock, setCheckingStock] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);

  const deliveryCharge = 60;
  const grandTotal = cartTotal + deliveryCharge;

  // ✅ মাউন্ট হলে localStorage থেকে my-info পড়ুন
  useEffect(() => {
    try {
      const stored = localStorage.getItem("my-info");
      if (stored) {
        const parsed = JSON.parse(stored);
        setFormData({
          name: parsed.name || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ কোয়ান্টিটি আপডেট (একই লজিক)
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    const existingItem = cart.find((item) => item.id === itemId);
    if (!existingItem) return;

    if (newQuantity < existingItem.quantity) {
      globalUpdateQuantity(itemId, newQuantity);
      return;
    }

    const stockId = existingItem.stockId;
    if (!stockId) {
      toast.error("স্টক আইডি পাওয়া যায়নি");
      return;
    }

    setUpdatingQuantity(itemId);
    try {
      const stockInfo = await checkStockForAdd(
        stockId,
        newQuantity - existingItem.quantity,
        cart,
      );
      if (!stockInfo.available) {
        if (stockInfo.currentQty === 0) {
          toast.error(`"${existingItem.name}" - স্টক শেষ!`);
        } else {
          toast.error(
            `"${existingItem.name}" - শুধুমাত্র ${stockInfo.currentQty}টি স্টকে আছে! (আপনি চাচ্ছেন ${newQuantity}টি)`,
          );
        }
        return;
      }
      globalUpdateQuantity(itemId, newQuantity);
      toast.success(`"${existingItem.name}" - কোয়ান্টিটি আপডেট করা হয়েছে`);
    } catch (error: any) {
      toast.error(error.message || "স্টক চেক করতে সমস্যা হয়েছে");
    } finally {
      setUpdatingQuantity(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod ভ্যালিডেশন
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      toast.error(firstError || "দয়া করে ফর্মটি সঠিকভাবে পূর্ণ করুন");
      return;
    }

    const cleanData = result.data;

    if (cart.length === 0) {
      toast.error("আপনার কার্ট খালি");
      return;
    }

    // stockId প্রস্তুত
    const stockItems = cart.map((item) => {
      let stockId = item.stockId;
      if (!stockId && item.variant?.stocks && item.variant.stocks.length > 0) {
        stockId = item.variant.stocks[0]?.id;
        console.warn(
          `⚠️ stockId missing for ${item.name}, using first stock: ${stockId}`,
        );
      }
      return {
        stockId: stockId || 0,
        quantity: item.quantity,
        productName: item.name,
      };
    });

    const hasInvalidStock = stockItems.some((item) => item.stockId === 0);
    if (hasInvalidStock) {
      toast.error(
        "কিছু পণ্যের স্টক আইডি পাওয়া যায়নি। দয়া করে পণ্যগুলো আবার যোগ করুন।",
      );
      console.error("Invalid stockId in items:", stockItems);
      return;
    }

    setCheckingStock(true);
    try {
      const results = await checkBulkStock(
        stockItems.map(({ stockId, quantity }) => ({ stockId, quantity })),
      );

      const unavailable = results.filter((r) => !r.available);
      if (unavailable.length > 0) {
        const itemsList = getUnavailableItemsList(results, cart);
        toast.custom(
          (t) => (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-2xl max-w-md w-full border border-red-200 dark:border-red-800">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-lg text-center">
                ⚠️ দুঃখিত : স্টক স্বল্পতা
              </h4>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                {itemsList.map((msg, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {msg}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  ঠিক আছে
                </button>
              </div>
            </div>
          ),
          { duration: Infinity, position: "top-center" },
        );
        setCheckingStock(false);
        return;
      }

      // ✅ অর্ডার পেলোড
      const payload = {
        customerName: cleanData.name,
        customerPhone: cleanData.phone,
        customerAddress: cleanData.address,
        items: stockItems.map(({ stockId, quantity }) => ({
          stockId,
          quantity,
          unitPrice: cart.find((item) => item.stockId === stockId)?.price || 0,
          totalPrice:
            (cart.find((item) => item.stockId === stockId)?.price || 0) *
            quantity,
        })),
        subtotal: cartTotal,
        discountTotal: 0,
        total: grandTotal,
      };

      console.log("📦 Sending order payload:", payload);

      setLoading(true);
      const response = await placeOrder(payload);
      console.log("✅ Order response:", response);

      // ✅ localStorage-এ my-info সংরক্ষণ
      const customerInfo = {
        name: cleanData.name,
        phone: cleanData.phone,
        address: cleanData.address,
      };
      localStorage.setItem("my-info", JSON.stringify(customerInfo));

      toast.success(response.message || "অর্ডার সফলভাবে জমা হয়েছে!");
      clearCart();
      router.push("/order-confirmation");
    } catch (error: any) {
      console.error("❌ Order error:", error);
      toast.error(
        error.message || "অর্ডার জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
      setCheckingStock(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center relative px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 backdrop-blur-xl -z-10" />

        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-14 max-w-sm sm:max-w-lg w-full border border-white/30 dark:border-white/10 text-center transition-all duration-300">
          <ShoppingBag
            size={56}
            className="sm:size-16 lg:size-20 text-stone-300 dark:text-stone-600 mb-4 sm:mb-6 mx-auto opacity-80"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-stone-800 dark:text-stone-200 mb-2 sm:mb-3">
            আপনার কার্ট খালি
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-stone-600 dark:text-stone-400 mb-6 sm:mb-8">
            অর্ডার করতে চাইলে প্রথমে পণ্য যোগ করুন
          </p>
          <Link href="/" className="inline-block">
            <Button
              variant="primary"
              size="md"
              className="px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base"
            >
              শপিং চালিয়ে যান
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
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
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={removeFromCart}
                        variant="checkout"
                        showRemove={true}
                        disabled={updatingQuantity === item.id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

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
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all"
                  />
                </div>

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
                    placeholder="০১XXXXXXXXX (শুধু সংখ্যা)"
                    className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all"
                  />
                </div>

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
                    rows={4}
                    placeholder="জেলা, থানা, গ্রাম/শহর, বাড়ি নম্বর, রাস্তার নাম"
                    className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all resize-none"
                  />
                </div>

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

              <div className="mt-auto pt-4">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  loading={loading || checkingStock}
                  disabled={loading || checkingStock}
                  className="mt-4"
                >
                  {checkingStock
                    ? "স্টক যাচাই করা হচ্ছে..."
                    : loading
                      ? "অর্ডার জমা হচ্ছে..."
                      : "অর্ডার কনফার্ম করুন"}
                </Button>

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
