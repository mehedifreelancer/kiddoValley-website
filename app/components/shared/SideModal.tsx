// components/shared/SideModal.tsx
"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: ReactNode;
  disableOutsideClick?: boolean;
  disableScrollLock?: boolean; // নতুন প্রপ
}

export default function SideModal({
  isOpen,
  onClose,
  title = "",
  className = "",
  children,
  disableOutsideClick = false,
  disableScrollLock = false,
}: SideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleCloseTrigger = () => {
    if (isAnimatingOut) return;
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 400);
  };

  useEffect(() => {
    if (!isOpen && !isAnimatingOut) handleCloseTrigger();
    if (isOpen) setIsAnimatingOut(false);
  }, [isOpen]);

  // ক্লিক আউটসাইড
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCloseTrigger();
      }
    };

    if (isOpen && !isAnimatingOut && !disableOutsideClick) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    if (isOpen && !disableScrollLock) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (!disableScrollLock && !isOpen) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen, isAnimatingOut, disableOutsideClick, disableScrollLock]);

  // Escape কী
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleCloseTrigger();
    };
    if (isOpen && !isAnimatingOut && !disableOutsideClick) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isAnimatingOut, disableOutsideClick]);

  useEffect(() => {
    return () => {
      if (!disableScrollLock) document.body.style.overflow = "unset";
    };
  }, [disableScrollLock]);

  const shouldRender = isOpen && !isAnimatingOut;

  return (
    <AnimatePresence>
      {shouldRender && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* ব্যাকড্রপ */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              disableOutsideClick ? "pointer-events-none" : ""
            }`}
            onClick={disableOutsideClick ? undefined : handleCloseTrigger}
          />

          <motion.div
            ref={modalRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`
              relative h-full w-full max-w-full z-10
              overflow-hidden shadow-2xl 
              bg-white dark:bg-dark-surface
              ${className}
            `}
          >
            {/* ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট */}
            <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-[400px] h-[400px] rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle at center, #D51B26 0%, #8859F8 30%, #1C08A9 50%, transparent 80%)`,
                    opacity: 0.2,
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-50/20 to-cream-200/20 dark:via-dark-bg/20 dark:to-dark-surface/20 pointer-events-none" />
            </div>

            {/* হেডার */}
            <div className="relative z-10 flex items-center py-2 border-b border-stone-200/50 dark:border-dark-border/50 bg-white/30 dark:bg-black/10 backdrop-blur-sm">
              <button
                onClick={handleCloseTrigger}
                className="p-2 rounded-lg hover:bg-stone-100/50 dark:hover:bg-dark-elevated/50 transition-colors"
              >
                <ChevronLeft
                  size={24}
                  className="text-stone-600 dark:text-stone-400"
                />
              </button>
              {title && (
                <h3 className="text-xl font-bold text-gray-800 dark:text-stone-200 truncate">
                  {title}
                </h3>
              )}
            </div>

            {/* কন্টেন্ট */}
            <div className="relative z-10 h-[calc(100vh-70px)] overflow-y-auto p-2">
              {children}
            </div>

            {/* ফ্লোটিং ক্লোজ বাটন */}
            <button
              onClick={handleCloseTrigger}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 
                bg-white/90 dark:bg-black/60 backdrop-blur-md 
                text-stone-800 dark:text-white 
                w-14 h-14 rounded-full shadow-2xl 
                flex items-center justify-center 
                border border-stone-200/50 dark:border-white/20
                hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              <ChevronLeft
                size={32}
                className="text-stone-800 dark:text-white"
              />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
