"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Truck, Wallet, MapPin, Sparkles } from "lucide-react";
import { useGlobal } from "../contexts/GlobalContext";
import Button from "../components/shared/Button";
import CartItem from "../components/shared/CartItem";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  placeOrder,
  calculateDeliveryCharge,
  detectLocationFromAddress,
  LocationType,
} from "./checkout.service";
import { checkBulkStock } from "../services/cart.service";
import { checkoutSchema } from "./checkout.schema";
import { checkStockForAdd, getUnavailableItemsList } from "../lib/stockUtils";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowMode = searchParams.get("mode") === "buynow"; // 🆕

  const {
    cart,
    updateQuantity: globalUpdateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    clearCart,
    buyNowItem, // 🆕
    updateBuyNowQuantity, // 🆕
    clearBuyNowItem, // 🆕
  } = useGlobal();

  // 🆕 effective cart — buy-now mode হলে শুধু ওই একটা item, নাহলে normal cart
  const effectiveCart = isBuyNowMode && buyNowItem ? [buyNowItem] : cart;
  const effectiveCartTotal =
    isBuyNowMode && buyNowItem
      ? buyNowItem.price * buyNowItem.quantity
      : cartTotal;
  const effectiveCartCount =
    isBuyNowMode && buyNowItem ? buyNowItem.quantity : cartCount;

  // ✅ localStorage থেকে প্রি-ফিল
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingStock, setCheckingStock] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);

  // 🆕 Location state: তিনটা option + null (no selection) — LocationType-এর
  // সাথে হুবহু মিলে যায়, তাই আর আলাদা mapping দরকার নেই
  type LocationOption = LocationType;
  const [locationOption, setLocationOption] = useState<LocationOption | null>(
    null,
  );

  // For AI detection status
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<LocationType | null>(
    null,
  );

  // Delivery charge
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [deliveryChargeLoading, setDeliveryChargeLoading] = useState(false);
  const [deliveryDiscountPercent, setDeliveryDiscountPercent] =
    useState<number>(0);

  // ✅ ফাইনাল সাবমিট-টাইম ভ্যালিডেশন চলাকালীন loading state
  const [validatingLocation, setValidatingLocation] = useState(false);

  // ✅ address পরিবর্তন ট্র্যাক করার জন্য — এই ref-এর সাথে তুলনা করে বোঝা হয়
  // address সত্যিই বদলেছে কিনা (radio reset করা উচিত কিনা তার জন্য)
  const prevAddressRef = useRef<string>("");

  // ✅ localStorage থেকে address+location একসাথে restore করার সময় radio
  // reset effect যেন ভুল করে সেটা reset না করে দেয় — সেই একবারের জন্য
  // reset skip করার flag
  const skipNextAddressReset = useRef<boolean>(false);

  // totalWeight from effectiveCart
  const totalWeight = effectiveCart.reduce(
    (sum, item) => sum + (item.weight || 0) * item.quantity,
    0,
  );

  const effectiveLocation = locationOption; // locationOption: inside_dhaka | suburbs | outside_dhaka | null
  const grandTotal = effectiveCartTotal + deliveryCharge;

  // ✅ radio-তে যা লেখা আছে ("সাব ঢাকা"), warning message-এও ঠিক সেই একই
  // শব্দ ব্যবহার করা হয় — আগে এখানে "সাবার্বস" লেখা ছিল যেটা radio-র
  // "সাব ঢাকা"-র সাথে মিলত না, ইউজার বুঝতে পারত না কোনটার কথা বলা হচ্ছে।
  const LOCATION_LABEL: Record<LocationType, string> = {
    inside_dhaka: "ঢাকার ভিতরে",
    suburbs: "সাব ঢাকা",
    outside_dhaka: "ঢাকার বাইরে",
  };

  // ✅ মাউন্ট হলে localStorage থেকে my-info পড়ুন (address + আগের সংরক্ষিত
  // delivery_location, যদি থাকে) — শুধু UX-এর জন্য প্রি-ফিল, কোনো AI API
  // call হয় না এখানে। খেয়াল করুন: এই restore হওয়া delivery_location-কে
  // "verified" ধরে নেওয়া হয় না — প্রতিটা নতুন অর্ডারেই submit করার সময়
  // ঠিকানা আবার real API দিয়ে fresh check হবে (নিচে handleSubmit দেখুন),
  // কারণ পুরনো ঠিকানা মিলে গেলেও ইউজার হয়তো এবার ভুল radio সিলেক্ট করেছে,
  // বা আগের বার ভুলভাবে override করে গিয়েছিল।
  useEffect(() => {
    try {
      const stored = localStorage.getItem("my-info");
      if (stored) {
        const parsed = JSON.parse(stored);
        const restoredAddress = parsed.address || "";

        // ✅ পরের address-effect রান-এ radio যেন ভুল করে reset না হয়ে যায়
        skipNextAddressReset.current = true;

        setFormData({
          name: parsed.name || "",
          phone: parsed.phone || "",
          address: restoredAddress,
        });

        if (
          parsed.delivery_location === "inside_dhaka" ||
          parsed.delivery_location === "suburbs" ||
          parsed.delivery_location === "outside_dhaka"
        ) {
          setLocationOption(parsed.delivery_location);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // 🆕 ইউজার address field-এ হাত দিলে (সত্যিকারের এডিট করলে) radio reset
  // হয়ে যাবে — যাতে ভুল এলাকার উপর ভিত্তি করে delivery charge/অর্ডার না যায়।
  // localStorage থেকে প্রথমবার restore করার সময় এটা ট্রিগার হবে না
  // (skipNextAddressReset flag দিয়ে সেটা এড়ানো হয়েছে)।
  useEffect(() => {
    const currentAddress = formData.address;
    const changed = currentAddress !== prevAddressRef.current;
    prevAddressRef.current = currentAddress;

    if (!changed) return;

    if (skipNextAddressReset.current) {
      skipNextAddressReset.current = false;
      return;
    }

    setLocationOption((prev) => {
      if (prev !== null) {
        return null;
      }
      return prev;
    });
    setDetectedLocation(null);
  }, [formData.address]);

  // 🆕 Recalculate delivery charge whenever location or effectiveCart changes
  useEffect(() => {
    const updateDeliveryCharge = async () => {
      if (!effectiveLocation || effectiveCart.length === 0) {
        setDeliveryCharge(0);
        setDeliveryDiscountPercent(0);
        return;
      }
      setDeliveryChargeLoading(true);
      try {
        const result = await calculateDeliveryCharge({
          location: effectiveLocation,
          weight: totalWeight,
          productPrice: effectiveCartTotal,
          isCod: true,
        });
        setDeliveryCharge(result.totalCharge || 0);
        setDeliveryDiscountPercent(result.discountPercent || 0);
      } catch (error: any) {
        console.error("Failed to calculate delivery charge:", error);
        toast.error(error.message || "ডেলিভারি চার্জ হিসাব করতে সমস্যা হয়েছে");
        setDeliveryCharge(0);
        setDeliveryDiscountPercent(0);
      } finally {
        setDeliveryChargeLoading(false);
      }
    };

    updateDeliveryCharge();
  }, [effectiveLocation, effectiveCart, effectiveCartTotal, totalWeight]);

  // ✅ কমন detect ফাংশন — শুধুমাত্র ম্যানুয়াল "AI Detect" বাটন ক্লিক থেকে
  // ব্যবহৃত হয়, কোনো auto-trigger নেই। কোনো cache/skip নেই — বাটনে ক্লিক
  // করলেই প্রতিবার real API কল হয়ে সরাসরি ফলাফল select হয়ে যায়, যাতে
  // ইউজার "আগেই শনাক্ত করা হয়েছে"-জাতীয় বিভ্রান্তিকর মেসেজ না দেখে।
  const runDetect = async (address: string, silent: boolean = false) => {
    setIsDetecting(true);
    try {
      const detected = await detectLocationFromAddress(address);
      setDetectedLocation(detected);

      // ✅ এখন LocationOption === LocationType, তাই সরাসরি বসানো যায়
      setLocationOption(detected);

      if (!silent) {
        toast.success(`📍 লোকেশন শনাক্ত: ${LOCATION_LABEL[detected]}`);
      }
    } catch (error: any) {
      console.error("AI Detect error:", error);
      if (!silent) {
        toast.error(error.message || "লোকেশন ডিটেক্ট করতে সমস্যা হয়েছে");
      }
      // silent (auto) মোডে ব্যর্থ হলে চুপচাপ থাকুন, ইউজারকে বিরক্ত করবেন না —
      // সে চাইলে ম্যানুয়ালি radio select করতে বা বাটনে ক্লিক করতে পারবে
    } finally {
      setIsDetecting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ কোনো auto-detect নেই — radio ইউজার সরাসরি ম্যানুয়ালি সিলেক্ট করলে
  const handleLocationChange = (option: LocationOption) => {
    setLocationOption(option);
    setDetectedLocation(null);
  };

  // ✅ ম্যানুয়াল বাটন — ক্লিক করলেই প্রতিবার real API কল হয়, কোনো cache/skip নেই
  const handleAIDetect = async () => {
    const address = formData.address.trim();
    if (address.length < 8) {
      toast.error("দয়া করে কমপক্ষে ৮ অক্ষরের একটি সম্পূর্ণ ঠিকানা লিখুন");
      return;
    }
    await runDetect(address, /* silent */ false);
  };

  // ✅ কোয়ান্টিটি আপডেট
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    const existingItem = effectiveCart.find((item) => item.id === itemId);
    if (!existingItem) return;

    // 🆕 buy-now mode হলে buyNowItem-এর quantity আপডেট হয়, নাহলে normal cart
    const applyUpdate = (qty: number) => {
      if (isBuyNowMode) {
        updateBuyNowQuantity(qty);
      } else {
        globalUpdateQuantity(itemId, qty);
      }
    };

    if (newQuantity < existingItem.quantity) {
      applyUpdate(newQuantity);
      return;
    }

    const stockId = existingItem.stockId;
    if (!stockId) {
      toast.error("স্টক আইডি পাওয়া যায়নি");
      return;
    }

    setUpdatingQuantity(itemId);
    try {
      const stockInfo = await checkStockForAdd(
        stockId,
        newQuantity - existingItem.quantity,
        isBuyNowMode ? [] : cart, // 🔧 buy-now mode-এ cart-এর সাথে conflict check করার দরকার নেই
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
      applyUpdate(newQuantity);
      toast.success(`"${existingItem.name}" - কোয়ান্টিটি আপডেট করা হয়েছে`);
    } catch (error: any) {
      toast.error(error.message || "স্টক চেক করতে সমস্যা হয়েছে");
    } finally {
      setUpdatingQuantity(null);
    }
  };

  // 🆕 buy-now mode-এ item remove করলে হোমে ফেরত যাবে — একটাই product থাকে
  const handleRemoveItem = (id: string) => {
    if (isBuyNowMode) {
      clearBuyNowItem();
      router.push("/");
      return;
    }
    removeFromCart(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      toast.error(firstError || "দয়া করে ফর্মটি সঠিকভাবে পূর্ণ করুন");
      return;
    }

    const cleanData = result.data;

    if (effectiveCart.length === 0) {
      toast.error(
        isBuyNowMode ? "কোনো প্রোডাক্ট সিলেক্ট করা নেই" : "আপনার কার্ট খালি",
      );
      return;
    }

    if (!locationOption) {
      toast.error("দয়া করে ডেলিভারি এলাকা নির্বাচন করুন");
      return;
    }

    // ✅ ফাইনাল লেয়ার ভ্যালিডেশন — প্রতিটা অর্ডার confirm করার আগে,
    // localStorage cache বা আগের কোনো verification-এর উপর ভরসা না করে,
    // সবসময় real API দিয়ে address থেকে এলাকা যাচাই করা হয় (প্রতিবার,
    // address আগে থেকেই "চেনা" হোক বা না হোক)। মিলে গেলে তবেই এগোবে।
    //
    // মিসম্যাচ হলে (ইউজার ভুলবশত বা ইচ্ছাকৃতভাবে ভুল radio সিলেক্ট করে
    // থাকলে) অর্ডার আটকে দেওয়া হয় — override করে এগিয়ে যাওয়ার কোনো সুযোগ
    // নেই। ইউজারকে শুধু warning toast দেখিয়ে সঠিক radio-টা বেছে নিতে বলা
    // হয়, যাতে সে সঠিক পথে গাইডেড হয়।
    const trimmedAddress = cleanData.address.trim();

    setValidatingLocation(true);
    let verified: LocationType | null = null;
    try {
      verified = await detectLocationFromAddress(trimmedAddress);
    } catch (error) {
      // ✅ ভ্যালিডেশন API call ব্যর্থ হলে (নেটওয়ার্ক/সার্ভার সমস্যা) পুরো
      // checkout বন্ধ করে দেওয়া ঠিক না — এই ক্ষেত্রে চুপচাপ এগিয়ে যাওয়া হয়
      // (fail-open)। ইচ্ছাকৃতভাবে এমন রাখা হয়েছে যাতে API down থাকলেও
      // ইউজার অর্ডার করতে পারে।
      console.error("Final location validation failed:", error);
    } finally {
      setValidatingLocation(false);
    }

    if (verified && verified !== locationOption) {
      toast(
        `⚠️ আপনার ঠিকানা অনুযায়ী ডেলিভারি এলাকা  "${LOCATION_LABEL[verified]}", কিন্তু আপনি "${LOCATION_LABEL[locationOption]}" নির্বাচন করেছেন। দয়া করে সঠিক এলাকাটি ("${LOCATION_LABEL[verified]}") নির্বাচন করুন।`,
        {
          duration: 7000,
          style: {
            background: "#FEF3C7",
            color: "#92400E",
            border: "1px solid #FCD34D",
          },
        },
      );
      return; // ✅ ব্লক করা হলো — override করে এগোনোর সুযোগ নেই, ইউজারকে
      // সঠিক radio বেছে নিয়ে আবার "অর্ডার কনফার্ম করুন"-এ চাপ দিতে হবে
    }

    const finalLocation = locationOption;

    // stockId প্রস্তুত
    const stockItems = effectiveCart.map((item) => {
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
        "কিছু পণ্যের স্টক আইডি পাওয়া যায়নি। দয়া করে পণ্যগুলো আবার যোগ করুন।",
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
        const itemsList = getUnavailableItemsList(results, effectiveCart);
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

      const payload = {
        customerName: cleanData.name,
        customerPhone: cleanData.phone,
        customerAddress: cleanData.address,
        items: stockItems.map(({ stockId, quantity }) => ({
          stockId,
          quantity,
          unitPrice:
            effectiveCart.find((item) => item.stockId === stockId)?.price || 0,
          totalPrice:
            (effectiveCart.find((item) => item.stockId === stockId)?.price ||
              0) * quantity,
        })),
        subtotal: effectiveCartTotal,
        discountTotal: 0,
        total: grandTotal,
        location: finalLocation,
        deliveryCharge,
        weight: totalWeight,
      };

      console.log("📦 Sending order payload:", payload);

      setLoading(true);
      const response = await placeOrder(payload);
      console.log("✅ Order response:", response);

      const customerInfo = {
        name: cleanData.name,
        phone: cleanData.phone,
        address: cleanData.address,
        delivery_location: finalLocation, // পরের ভিজিটে ফর্ম প্রি-ফিল করার জন্য
        // (submit-এর সময় এটা আবারও real API দিয়ে fresh validate হবে)
      };
      localStorage.setItem("my-info", JSON.stringify(customerInfo));

      toast.success(response.message || "অর্ডার সফলভাবে জমা হয়েছে!");

      // 🔧 buy-now হলে buyNowItem clear, নাহলে normal cart clear
      if (isBuyNowMode) {
        clearBuyNowItem();
      } else {
        clearCart();
      }
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

  if (effectiveCart.length === 0) {
    return (
      <div className="min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center relative px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 backdrop-blur-xl -z-10" />

        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-14 max-w-sm sm:max-w-lg w-full border border-white/30 dark:border-white/10 text-center transition-all duration-300">
          <ShoppingBag
            size={56}
            className="sm:size-16 lg:size-20 text-stone-300 dark:text-stone-600 mb-4 sm:mb-6 mx-auto opacity-80"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-stone-800 dark:text-stone-200 mb-2 sm:mb-3">
            {isBuyNowMode
              ? "কোনো প্রোডাক্ট সিলেক্ট করা নেই"
              : "আপনার কার্ট খালি"}
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
                আপনার পণ্যসমূহ ({effectiveCartCount})
              </h2>
            </div>

            <div className="divide-y divide-white/20 dark:divide-white/10 flex-1 overflow-y-auto max-h-[500px]">
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {effectiveCart.map((item) => (
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
                        onRemove={handleRemoveItem}
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
                    ৳{effectiveCartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Truck size={14} /> ডেলিভারি চার্জ
                    {deliveryDiscountPercent > 0 && (
                      <span className="text-xs text-green-600">
                        ({deliveryDiscountPercent}% ছাড়)
                      </span>
                    )}
                    :
                  </span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {deliveryChargeLoading
                      ? "..."
                      : effectiveLocation
                        ? `৳${deliveryCharge.toFixed(2)}`
                        : "—"}
                  </span>
                </div>
                <div className="border-t border-white/30 dark:border-white/10 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-stone-800 dark:text-stone-200">
                      মোট:
                    </span>
                    <span className="text-xl text-[#E57373]">
                      {effectiveLocation ? `৳${grandTotal.toFixed(2)}` : "—"}
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
                    rows={3}
                    placeholder="জেলা, থানা, গ্রাম/শহর, বাড়ি নম্বর, রাস্তার নাম"
                    className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* 🆕 Location Radios + AI Detect Button (লেবেল বরাবর) */}
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      <MapPin size={16} className="inline mr-1" />
                      ডেলিভারি এলাকা <span className="text-[#E57373]">*</span>
                    </label>

                    {/* ✅ AI Detect বাটন — লেবেলের সাথে একই লাইনে, ডানপাশে।
                        radio select করলেও disable হয় না, শুধু detect
                        চলাকালীন disable থাকে। ইউজার চাইলে যেকোনো সময়
                        re-check করতে পারবে। কোনো auto-trigger নেই — শুধু
                        ক্লিকেই detect হয়। */}
                    <button
                      type="button"
                      onClick={handleAIDetect}
                      disabled={isDetecting}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                        isDetecting
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-default"
                          : "bg-gradient-to-r from-[#E57373] to-[#BA68C8] text-white hover:shadow-md hover:scale-105 cursor-pointer"
                      }`}
                    >
                      <Sparkles size={14} />
                      {isDetecting
                        ? "ডিটেক্ট হচ্ছে..."
                        : "AI দিয়ে ডিটেক্ট করুন"}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300 cursor-pointer">
                      <input
                        type="radio"
                        name="location"
                        value="inside_dhaka"
                        checked={locationOption === "inside_dhaka"}
                        onChange={() => handleLocationChange("inside_dhaka")}
                        className="accent-[#BA68C8] cursor-pointer"
                      />
                      ঢাকার ভিতরে
                    </label>
                    <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300 cursor-pointer">
                      <input
                        type="radio"
                        name="location"
                        value="suburbs"
                        checked={locationOption === "suburbs"}
                        onChange={() => handleLocationChange("suburbs")}
                        className="accent-[#BA68C8] cursor-pointer"
                      />
                      সাব ঢাকা
                    </label>
                    <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300 cursor-pointer">
                      <input
                        type="radio"
                        name="location"
                        value="outside_dhaka"
                        checked={locationOption === "outside_dhaka"}
                        onChange={() => handleLocationChange("outside_dhaka")}
                        className="accent-[#BA68C8] cursor-pointer"
                      />
                      ঢাকার বাইরে
                    </label>
                  </div>

                  {/* Status message for AI detection */}
                  {isDetecting && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <span className="animate-spin h-3 w-3 border-2 border-stone-400 border-t-transparent rounded-full"></span>
                      এলাকা শনাক্ত করা হচ্ছে...
                    </p>
                  )}
                  {!isDetecting && locationOption && detectedLocation && (
                    <p className="mt-1 text-xs text-green-600">
                      ✓ শনাক্ত: {LOCATION_LABEL[detectedLocation]} (AI)
                    </p>
                  )}
                  {!isDetecting && locationOption && !detectedLocation && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      ✓ আপনি ম্যানুয়ালি সিলেক্ট করেছেন
                    </p>
                  )}
                  {!isDetecting && !locationOption && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      AI Detect বাটনে ক্লিক করুন অথবা ম্যানুয়ালি এলাকা নির্বাচন
                      করুন
                    </p>
                  )}
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
                  loading={loading || checkingStock || validatingLocation}
                  disabled={loading || checkingStock || validatingLocation}
                  className="mt-4"
                >
                  {validatingLocation
                    ? "এলাকা যাচাই করা হচ্ছে..."
                    : checkingStock
                      ? "স্টক যাচাই করা হচ্ছে..."
                      : loading
                        ? "অর্ডার জমা হচ্ছে..."
                        : "অর্ডার কনফার্ম করুন"}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    href={isBuyNowMode ? "/" : "/cart"}
                    className="text-sm text-[#BA68C8]/90 hover:text-[#8E4C9E] transition-colors backdrop-blur-sm px-4 py-2 rounded-lg bg-white/10 dark:bg-black/20 inline-block border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30"
                  >
                    {isBuyNowMode ? "← শপিং চালিয়ে যান" : "← কার্টে ফিরে যান"}
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

// 🆕 useSearchParams() Next.js App Router-এ Suspense boundary ছাড়া কাজ করে
// না (build-time error দেয়) — তাই মূল কম্পোনেন্টকে Suspense দিয়ে wrap
// করা হলো
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-stone-500 dark:text-stone-400">লোড হচ্ছে...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
