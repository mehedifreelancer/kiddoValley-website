"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Circle,
  Loader2,
  Home,
  PartyPopper,
  MapPin,
  Box,
} from "lucide-react";
import { useGlobal } from "../contexts/GlobalContext";
import Button from "../components/shared/Button";
import Modal from "../components/shared/Modal";
import toast from "react-hot-toast";
import { useSearchOrders } from "./useTrackOrder";
import { Order, TimelineStep, trackConsignment } from "./trackOrder.service";
import { phoneSchema } from "./trackOrder.schema";
import OrderCardSkeleton from "../components/skeleton/OrderCardSkeleton";

// ===== Enhanced Timeline Component (অপরিবর্তিত) =====
const EnhancedTimeline = ({ steps }: { steps: TimelineStep[] }) => {
  const completedCount = steps.filter((s) => s.completed).length;
  const total = steps.length;
  const progress = total > 0 ? (completedCount / total) * 100 : 0;
  const isDelivered = steps.every((s) => s.completed);
  const containerRef = useRef<HTMLDivElement>(null);

  const getStepIcon = (label: string, completed: boolean) => {
    const iconProps = {
      className: `w-5 h-5 ${completed ? "text-white" : "text-stone-400 dark:text-stone-500"}`,
    };
    switch (label.toLowerCase()) {
      case "confirm":
        return completed ? (
          <CheckCircle {...iconProps} />
        ) : (
          <Circle {...iconProps} />
        );
      case "picked-up":
        return <Package {...iconProps} />;
      case "in transit":
        return <Truck {...iconProps} />;
      case "out for delivery":
        return <Home {...iconProps} />;
      case "delivered":
        return completed ? (
          <PartyPopper {...iconProps} />
        ) : (
          <MapPin {...iconProps} />
        );
      default:
        return <Clock {...iconProps} />;
    }
  };

  const getStepColor = (label: string, completed: boolean) => {
    if (completed) return "bg-emerald-500 border-emerald-500";
    switch (label.toLowerCase()) {
      case "confirm":
        return "border-stone-300 dark:border-stone-600";
      case "picked-up":
        return "border-blue-400 dark:border-blue-600";
      case "in transit":
        return "border-amber-400 dark:border-amber-600";
      case "out for delivery":
        return "border-purple-400 dark:border-purple-600";
      case "delivered":
        return "border-yellow-400 dark:border-yellow-600";
      default:
        return "border-stone-300 dark:border-stone-600";
    }
  };

  const getStepBackground = (label: string, completed: boolean) => {
    if (completed) return "bg-emerald-500";
    switch (label.toLowerCase()) {
      case "picked-up":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "in transit":
        return "bg-amber-100 dark:bg-amber-900/30";
      case "out for delivery":
        return "bg-purple-100 dark:bg-purple-900/30";
      case "delivered":
        return "bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "bg-stone-100 dark:bg-stone-800";
    }
  };

  return (
    <div>
      {/* Animated Progress Bar with Custom Truck */}
      <div className="mb-6 relative" ref={containerRef}>
        <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
          <span>অগ্রগতি</span>
          <span className="flex items-center gap-1">
            {isDelivered && (
              <span className="text-emerald-500">✅ পৌঁছেছে</span>
            )}
            {!isDelivered && `${Math.round(progress)}%`}
          </span>
        </div>
        <div className="relative w-full h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-visible mt-3">
          <motion.div
            className="h-full bg-gradient-to-r from-[#E57373] to-[#BA68C8] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -ml-2.5 text-2xl"
            initial={{ left: "0%" }}
            animate={{ left: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <img
              src="/icon/truck.svg"
              alt="Truck"
              className="w-5 h-5 object-contain drop-shadow-md"
            />
          </motion.div>
        </div>
        {/* Delivery complete message */}
        {isDelivered && (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400"
          >
            🎉 পণ্য পৌঁছেছে! ধন্যবাদ
          </motion.div>
        )}
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-stone-200 dark:bg-stone-700" />
        {steps.map((step, idx) => {
          const isActive =
            step.completed &&
            (idx === steps.length - 1 || !steps[idx + 1]?.completed);
          const isCompleted = step.completed;
          const isLast = idx === steps.length - 1;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="relative flex items-start gap-4 mb-6 last:mb-0"
            >
              <div className="relative z-10">
                <motion.div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2
                    ${getStepColor(step.label, isCompleted)}
                    ${getStepBackground(step.label, isCompleted)}
                    ${isCompleted ? "border-0" : ""}
                  `}
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.1, 1],
                          transition: { repeat: Infinity, duration: 1.5 },
                        }
                      : {}
                  }
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                  ) : (
                    getStepIcon(step.label, false)
                  )}
                </motion.div>
                {!isLast && !isCompleted && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-stone-300 dark:bg-stone-600" />
                )}
              </div>

              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted
                        ? "text-stone-800 dark:text-stone-200"
                        : "text-stone-400 dark:text-stone-500"
                    }`}
                  >
                    {step.label}
                    {isActive && step.label.toLowerCase() !== "delivered" && (
                      <span className="ml-2 text-xs text-amber-500 animate-pulse">
                        ● চলমান
                      </span>
                    )}
                  </p>
                </div>
                {step.timestamp && (
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                    {new Date(step.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ===== Main Component =====
export default function TrackOrderPage() {
  const { webSettings } = useGlobal();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone");

  const [phone, setPhone] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingData, setTrackingData] = useState<{
    timeline: TimelineStep[];
    order: Order;
  } | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoSearchDone = useRef(false);

  // ১. ফোন সেট করা (URL বা localStorage)
  useEffect(() => {
    if (phoneParam) {
      setPhone(phoneParam);
    } else {
      const stored = localStorage.getItem("my-info");
      if (stored) {
        try {
          const { phone: savedPhone } = JSON.parse(stored);
          if (savedPhone) setPhone(savedPhone);
        } catch {}
      }
    }
  }, [phoneParam]);

  // ২. অটো-সার্চ (URL প্যারামিটার থাকলে) – `searchTriggered` রিসেট হবে না
  useEffect(() => {
    if (phoneParam && !autoSearchDone.current) {
      const trimmed = phoneParam.trim();
      const result = phoneSchema.safeParse(trimmed);
      if (result.success) {
        autoSearchDone.current = true;
        setPhone(trimmed);
        setSearchTriggered(true);
      } else {
        toast.error(result.error.issues[0]?.message || "সঠিক ফোন নম্বর দিন");
      }
    }
  }, [phoneParam]);

  // ৩. ম্যানুয়াল ইনপুটে `searchTriggered` রিসেট (যাতে বাটন ক্লিক ছাড়া API না কল হয়)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, "");
    const sanitized = digitsOnly.slice(0, 14);
    setPhone(sanitized);
    autoSearchDone.current = false;
    setSearchTriggered(false);
  };

  // ৪. সার্চ কুয়েরি (TanStack Query)
  const {
    data: orders,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchOrders(phone, searchTriggered);

  // ৫. সার্চ বাটন ক্লিক
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };
  const handleSearch = () => {
    const trimmedPhone = phone.trim();
    const result = phoneSchema.safeParse(trimmedPhone);
    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || "সঠিক ফোন নম্বর দিন";
      toast.error(errorMsg);
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    setSearchTriggered(true);
  };

  // ৬. ট্র্যাক বাটন (সরাসরি API কল)
  const handleTrackClick = async (order: Order) => {
    if (!order.pathaoConsignmentId || order.pathaoConsignmentId.trim() === "") {
      toast.error("এই অর্ডারের জন্য কনসাইনমেন্ট আইডি নেই");
      return;
    }

    setSelectedOrder(order);
    setTrackingModalOpen(true);
    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingData(null);

    try {
      const result = await trackConsignment(phone, order.pathaoConsignmentId);
      setTrackingData({
        timeline: result.timeline,
        order: result.order,
      });
    } catch (error: any) {
      console.error("Track error:", error);
      setTrackingError(error.message || "ট্র্যাকিং তথ্য লোড করতে ব্যর্থ");
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 backdrop-blur-xl -z-10" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-light text-stone-800 dark:text-stone-200">
            অর্ডার ট্র্যাক করুন
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            আপনার ফোন নম্বর দিয়ে অর্ডার খুঁজুন
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/30 dark:border-white/10"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="০১XXXXXXXXX"
                maxLength={14}
                className="w-full px-4 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-stone-800 dark:text-stone-200 placeholder-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#BA68C8]/50 focus:border-transparent transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={searchLoading}
              disabled={searchLoading}
              className="px-8 py-3 text-sm sm:text-base mt-1 sm:mt-0"
            >
              <Search className="w-5 h-5 mr-2" />
              খুঁজুন
            </Button>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-6 sm:mt-3 text-center">
            আপনার ফোন নম্বরটি স্বয়ংক্রিয়ভাবে সেভ করা হয়েছে
          </p>
        </form>

        {/* Results */}
        {/* Results */}
        {searchTriggered && (
          <>
            {searchLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-[#BA68C8]" />
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {searchError ? (
                  <div className="text-center py-12 text-red-500 dark:text-red-400">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">সার্চ করতে সমস্যা হয়েছে</p>
                  </div>
                ) : orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg p-5 sm:p-6 border border-white/30 dark:border-white/10 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <p className="text-sm text-stone-500 dark:text-stone-400">
                            Invoice #{order.invoiceNo}
                          </p>
                          <p className="text-lg font-medium text-stone-800 dark:text-stone-200">
                            {order.customerName}
                          </p>
                          <p className="text-sm text-stone-600 dark:text-stone-300">
                            ৳{order.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full ${
                              order.orderStatus === "new"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                : order.orderStatus === "confirmed"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {order.orderStatus === "new"
                              ? "অপেক্ষমান"
                              : order.orderStatus === "confirmed"
                                ? "নিশ্চিত"
                                : "বাতিল"}
                          </span>
                          {order.orderStatus === "new" ? (
                            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              অ্যাডমিন অনুমোদনের অপেক্ষায়
                            </span>
                          ) : order.orderStatus === "confirmed" &&
                            order.pathaoConsignmentId ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleTrackClick(order)}
                              loading={
                                trackingLoading &&
                                selectedOrder?.id === order.id
                              }
                              className="w-full sm:w-auto"
                            >
                              <Truck className="w-4 h-4 mr-1" />
                              ট্র্যাক করুন
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-stone-500 dark:text-stone-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">কোনো অর্ডার পাওয়া যায়নি</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={trackingModalOpen}
        onClose={() => {
          setTrackingModalOpen(false);
          setSelectedOrder(null);
          setTrackingData(null);
          setTrackingError(null);
        }}
        title={
          selectedOrder
            ? `অর্ডার ট্র্যাকিং – ${selectedOrder.invoiceNo}`
            : "ট্র্যাকিং"
        }
        size="lg"
        disableScrollLock
      >
        {trackingLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#BA68C8]" />
          </div>
        ) : trackingError ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{trackingError}</p>
          </div>
        ) : trackingData?.timeline && trackingData.timeline.length > 0 ? (
          <div className="p-4">
            <EnhancedTimeline steps={trackingData.timeline} />
            <div className="mt-6 text-sm text-stone-500 dark:text-stone-400 text-center border-t border-stone-200 dark:border-stone-700 pt-4">
              সর্বশেষ আপডেট: {new Date().toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500 dark:text-stone-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>ট্র্যাকিং তথ্য পাওয়া যায়নি</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
