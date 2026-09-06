"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  ShoppingBag,
  Truck,
  BookOpen,
  TruckElectric,
} from "lucide-react";
import { useGlobal } from "../contexts/GlobalContext";

export default function OrderConfirmationPage() {
  const { webSettings } = useGlobal();
  const [customerInfo, setCustomerInfo] = useState<{
    name: string;
    phone: string;
    address: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("my-info");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCustomerInfo(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const thumbsVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const logoUrl = webSettings?.logoUrl;

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-12">
      {/* ব্যাকগ্রাউন্ড */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[800px] h-[800px] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle at center, #D51B26 0%, #8859F8 20%, #1C08A9 40%, #36A43D 60%, #8859F8 70%, transparent 85%)`,
              opacity: 0.2,
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full blur-2xl"
            style={{
              background: `radial-gradient(circle at center, #D51B26 0%, #8859F8 30%, #1C08A9 50%, transparent 80%)`,
              opacity: 0.15,
            }}
          />
          <div
            className="absolute w-[1100px] h-[1100px] rounded-full blur-[100px]"
            style={{
              background: `radial-gradient(circle at center, #36A43D 0%, #1C08A9 20%, #8859F8 40%, #D51B26 60%, transparent 80%)`,
              opacity: 0.1,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-50/30 to-cream-200/30 dark:via-dark-bg/30 dark:to-dark-surface/30 pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg w-full backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl px-2 pb-5 md:p-10 text-center"
      >
        {/* লোগো – কনটেক্সট থেকে */}
        <div className="flex justify-center ">
          {logoUrl ? (
            <div className="relative w-[150px] h-[130px] ">
              <Image
                src={logoUrl}
                alt="Kiddo Valley Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-md bg-gradient-to-br from-logo-red via-logo-purple to-logo-blue group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base md:text-lg font-light tracking-tight">
                  <span className="text-stone-800 dark:text-stone-200">
                    Kiddo
                  </span>
                  <span className="font-semibold text-logo-red">Valley</span>
                </span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-500 hidden xs:block">
                  Children's Bookstore
                </span>
              </div>
            </div>
          )}
        </div>

        <motion.div
          variants={thumbsVariants}
          initial="initial"
          animate="animate"
          className="flex justify-center mb-2  md:mb-4 mt-[-25px] md:mt-[0px]"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E57373]/20 to-[#BA68C8]/20 flex items-center justify-center">
            <ThumbsUp
              size={56}
              className="text-[#E57373] dark:text-[#BA68C8]"
            />
          </div>
        </motion.div>

        <h1 className="text-lg md:text-3xl  font-bold text-stone-800 dark:text-stone-100 mb-0 md:mb-4">
          ধন্যবাদ!
        </h1>
        <p className="text-sm md:text-lg text-stone-700 dark:text-stone-300 mb-4 md:mb-6">
          আপনার অর্ডারটি সফলভাবে কনফার্ম হয়েছে।
        </p>

        {customerInfo && (
          <div className="bg-white/20 dark:bg-black/20 rounded-md p-2 md:p-4 mb-4 md:mb-6 border border-white/20 dark:border-white/5">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              <span className="font-semibold">{customerInfo.name}</span> – আপনার
              ফোন নম্বর{" "}
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {customerInfo.phone}
              </span>{" "}
              দিয়ে অর্ডার ট্র্যাক করুন
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              📦 {customerInfo.address}
            </p>
          </div>
        )}

        <div className="flex flex-row gap-3 justify-center mt-2">
          <Link
            href="/track-order"
            className="text-sm md:text-base inline-flex items-center justify-center px-3 py-3 rounded-xl bg-gradient-to-r from-[#E57373] to-[#BA68C8] text-white  font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <TruckElectric size={18} className="mr-2" />
            ট্র্যাক করুন
          </Link>
          <Link
            href="/"
            className="text-sm md:text-base inline-flex items-center justify-center px-3 py-3 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-sm text-stone-700 dark:text-stone-300 font-medium border border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/30 transition-colors duration-300"
          >
            <ShoppingBag size={18} className="mr-2" />
            শপিং চালিয়ে যান
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
