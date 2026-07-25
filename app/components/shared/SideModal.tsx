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
}

export default function SideModal({
  isOpen,
  onClose,
  title = "",
  className = "",
  children,
  disableOutsideClick = false,
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
    if (!isOpen && !isAnimatingOut) {
      handleCloseTrigger();
    }
    if (isOpen) {
      setIsAnimatingOut(false);
    }
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
      document.body.style.overflow = "hidden";
    } else {
      if (isOpen && !isAnimatingOut) {
        document.body.style.overflow = "hidden";
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (!isOpen && !isAnimatingOut) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen, isAnimatingOut, disableOutsideClick]);

  // Escape কী
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseTrigger();
      }
    };

    if (isOpen && !isAnimatingOut && !disableOutsideClick) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isAnimatingOut, disableOutsideClick]);

  // ক্লিনআপ
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const shouldRender = isOpen && !isAnimatingOut;

  return (
    <AnimatePresence>
      {shouldRender && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* ব্যাকড্রপ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseTrigger}
          />

          {/* সাইড প্যানেল */}
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
            {/* ===== এক্সাক্ট ব্যাকগ্রাউন্ড (লেআউটের মতো) ===== */}
            <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated pointer-events-none">
              {/* Center splash */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-[800px] h-[800px] rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle at center, 
                      #D51B26 0%,
                      #8859F8 20%,
                      #1C08A9 40%,
                      #36A43D 60%,
                      #8859F8 70%,
                      transparent 85%
                    )`,
                    opacity: 0.25,
                  }}
                />
                <div
                  className="absolute w-[400px] h-[400px] rounded-full blur-2xl"
                  style={{
                    background: `radial-gradient(circle at center, 
                      #D51B26 0%,
                      #8859F8 30%,
                      #1C08A9 50%,
                      transparent 80%
                    )`,
                    opacity: 0.2,
                  }}
                />
                <div
                  className="absolute w-[1100px] h-[1100px] rounded-full blur-[100px]"
                  style={{
                    background: `radial-gradient(circle at center, 
                      #36A43D 0%,
                      #1C08A9 20%,
                      #8859F8 40%,
                      #D51B26 60%,
                      transparent 80%
                    )`,
                    opacity: 0.15,
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-50/30 to-cream-200/30 dark:via-dark-bg/30 dark:to-dark-surface/30 pointer-events-none"></div>
            </div>

            {/* হেডার – স্বচ্ছ */}
            <div className="relative z-10 flex items-center py-2 border-b border-stone-200/50 dark:border-dark-border/50 bg-white/30 dark:bg-black/10 backdrop-blur-sm">
              <button
                onClick={handleCloseTrigger}
                className="p-2 rounded-lg hover:bg-stone-100/50 dark:hover:bg-dark-elevated/50 transition-colors"
                aria-label="Go back"
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

            {/* কন্টেন্ট – স্ক্রোলযোগ্য */}
            <div className="relative z-10 h-[calc(100vh-70px)] overflow-y-auto p-2">
              {children}
            </div>

            {/* ফ্লোটিং ক্লোজ বাটন (নিচে) */}
            <button
              onClick={handleCloseTrigger}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 
                bg-white/90 dark:bg-black/60 backdrop-blur-md 
                text-stone-800 dark:text-white 
                w-14 h-14 rounded-full shadow-2xl 
                flex items-center justify-center 
                border border-stone-200/50 dark:border-white/20
                hover:scale-105 active:scale-95 transition-transform duration-200"
              aria-label="Close"
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
