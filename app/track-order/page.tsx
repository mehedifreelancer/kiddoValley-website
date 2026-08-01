"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useGlobal } from "../contexts/GlobalContext";
import Button from "../components/shared/Button";
import Modal from "../components/shared/Modal";
import toast from "react-hot-toast";
import { useSearchOrders } from "./useTrackOrder";
import { Order, TimelineStep, trackConsignment } from "./trackOrder.service";
import { phoneSchema } from "./trackOrder.schema";

// Timeline Component
const Timeline = ({ steps }: { steps: TimelineStep[] }) => (
  <div className="relative">
    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-200 dark:bg-stone-700" />
    {steps.map((step, idx) => (
      <div key={idx} className="relative flex items-start gap-4 mb-6 last:mb-0">
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600">
          {step.completed ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <Clock className="w-4 h-4 text-stone-400" />
          )}
        </div>
        <div className="flex-1 pt-1">
          <p
            className={`text-sm font-medium ${
              step.completed
                ? "text-stone-800 dark:text-stone-200"
                : "text-stone-400 dark:text-stone-500"
            }`}
          >
            {step.label}
          </p>
          {step.timestamp && (
            <p className="text-xs text-stone-400 dark:text-stone-500">
              {new Date(step.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

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
  const initialLoadDone = useRef(false);

  // 1. URL parameter বা localStorage থেকে ফোন সেট করুন
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

  // 2. URL প্যারামিটার থাকলে অটো-সার্চ (একবার) – বাটন ক্লিক ছাড়া
  useEffect(() => {
    // শুধুমাত্র প্রথমবার এবং phoneParam থাকলে এবং সার্চ এখনও ট্রিগার না হলে
    if (!initialLoadDone.current && phoneParam) {
      const trimmedPhone = phoneParam.trim();
      const result = phoneSchema.safeParse(trimmedPhone);
      if (result.success) {
        initialLoadDone.current = true;
        // ফোন সেট করতে হবে (উপরের useEffect ইতিমধ্যে সেট করে)
        setSearchTriggered(true);
      } else {
        toast.error(result.error.issues[0]?.message || "সঠিক ফোন নম্বর দিন");
        initialLoadDone.current = true; // ভুল নম্বর দিয়েও আর বারবার চেষ্টা করবে না
      }
    }
  }, [phoneParam]); // phoneParam পরিবর্তন হলে চলবে, কিন্তু initialLoadDone রোধ করবে

  // 3. ফোন পরিবর্তন হলে সার্চ ট্রিগার রিসেট করুন (শুধু ম্যানুয়াল পরিবর্তনে)
  useEffect(() => {
    if (searchTriggered && !phoneParam) {
      // যদি URL প্যারামিটার না থাকে, তাহলে সার্চ রিসেট করুন (ইউজার ইনপুট পরিবর্তন করলে)
      setSearchTriggered(false);
    }
    // যদি URL প্যারামিটার থাকে, তাহলে আমরা রিসেট করব না, কারণ ওটা অটো-সার্চ ছিল
    // কিন্তু ইউজার যদি ইনপুটে পরিবর্তন করে, তাহলে আমরা auto-search ফ্ল্যাগ রিসেট করি
    if (phoneParam && phone !== phoneParam) {
      // ইউজার ইনপুট ম্যানুয়ালি পরিবর্তন করছে, অটো-সার্চ ফ্ল্যাগ রিসেট করি
      initialLoadDone.current = false;
    }
  }, [phone, phoneParam, searchTriggered]);

  // TanStack Query: Search
  const {
    data: orders,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchOrders(phone, searchTriggered);

  // Input handler – only digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, "");
    const sanitized = digitsOnly.slice(0, 14);
    setPhone(sanitized);
    // ইউজার ম্যানুয়ালি পরিবর্তন করলে অটো-সার্চ ফ্ল্যাগ রিসেট করুন
    initialLoadDone.current = false;
  };

  // Search button
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

  // Track – direct API call
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
      <div className="fixed inset-0 bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 backdrop-blur-xl -z-10" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-light text-stone-800 dark:text-stone-200">
            অর্ডার ট্র্যাক করুন
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            আপনার ফোন নম্বর দিয়ে অর্ডার খুঁজুন
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/30 dark:border-white/10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
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
              variant="primary"
              size="md"
              onClick={handleSearch}
              loading={searchLoading}
              disabled={searchLoading}
              className="px-8 py-3 text-sm sm:text-base mt-1 sm:mt-0"
            >
              <Search className="w-5 h-5 mr-2" />
              খুঁজুন
            </Button>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-6 sm:mt-3 text-center">
            আপনার ফোন নম্বরটি স্বয়ংক্রিয়ভাবে সেভ করা হয়েছে
          </p>
        </div>

        {searchTriggered && (
          <div className="mt-8 space-y-4">
            {searchError ? (
              <div className="text-center py-12 text-red-500 dark:text-red-400">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">সার্চ করতে সমস্যা হয়েছে</p>
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
                          অ্যাডমিন অনুমোদনের অপেক্ষায়
                        </span>
                      ) : order.orderStatus === "confirmed" &&
                        order.pathaoConsignmentId ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleTrackClick(order)}
                          loading={
                            trackingLoading && selectedOrder?.id === order.id
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
                <p className="text-lg">কোনো অর্ডার পাওয়া যায়নি</p>
              </div>
            )}
          </div>
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
            <Timeline steps={trackingData.timeline} />
            <div className="mt-6 text-sm text-stone-500 dark:text-stone-400 text-center">
              সর্বশেষ আপডেট: {new Date().toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-stone-500 dark:text-stone-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>ট্র্যাকিং তথ্য পাওয়া যায়নি</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
