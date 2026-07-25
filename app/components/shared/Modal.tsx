// components/shared/Modal.tsx
"use client";

import { useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: string; // এখন যেকোনো Tailwind ক্লাস স্ট্রিং দেয়া যাবে, যেমন "max-w-4xl lg:max-w-full"
  className?: string; // অতিরিক্ত কাস্টম ক্লাস
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title = "",
  size = "xl",
  className = "",
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // প্রি-ডিফাইন্ড সাইজ (সুবিধার জন্য)
  const presetSizes: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-4xl w-full m-1",
    fit: "w-screen h-screen max-w-none max-h-none p-1",
  };

  // যদি size প্রপটি প্রি-ডিফাইন্ড তালিকায় থাকে, তাহলে তার ক্লাস নাও, নইলে size-টিকে সরাসরি ক্লাস হিসেবে ব্যবহার করো।
  const sizeClass = presetSizes[size] || size;

  const isFit = size === "fit" || sizeClass.includes("h-screen");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ব্যাকড্রপ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* মডাল কন্টেইনার */}
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${
              isFit ? "p-0" : "p-4"
            }`}
          >
            <motion.div
              ref={modalRef}
              initial={{
                opacity: 0,
                scale: isFit ? 1 : 0.95,
                y: isFit ? 0 : 20,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: isFit ? 1 : 0.95, y: isFit ? 0 : 20 }}
              transition={{ duration: 0.2 }}
              className={`
                relative w-full ${sizeClass} max-h-[90vh] overflow-hidden
                rounded-md shadow-2xl border border-stone-200/50 dark:border-dark-border/50
                ${isFit ? "rounded-none border-0 shadow-none" : ""}
                ${className}
              `}
            >
              {/* ===== ব্যাকগ্রাউন্ড – layout-এর মতো গ্রেডিয়েন্ট + স্প্ল্যাশ ===== */}
              <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated pointer-events-none">
                {/* স্প্ল্যাশ সার্কেল */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{
                      background: `radial-gradient(circle at center, 
                        #D51B26 0%,
                        #8859F8 20%,
                        #1C08A9 40%,
                        #36A43D 60%,
                        #8859F8 70%,
                        transparent 85%
                      )`,
                      opacity: 0.2,
                    }}
                  />
                  <div
                    className="absolute w-[300px] h-[300px] rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(circle at center, 
                        #D51B26 0%,
                        #8859F8 30%,
                        #1C08A9 50%,
                        transparent 80%
                      )`,
                      opacity: 0.15,
                    }}
                  />
                  <div
                    className="absolute w-[800px] h-[800px] rounded-full blur-[80px]"
                    style={{
                      background: `radial-gradient(circle at center, 
                        #36A43D 0%,
                        #1C08A9 20%,
                        #8859F8 40%,
                        #D51B26 60%,
                        transparent 80%
                      )`,
                      opacity: 0.1,
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-50/30 to-cream-200/30 dark:via-dark-bg/30 dark:to-dark-surface/30 pointer-events-none"></div>
              </div>

              {/* হেডার (স্বচ্ছ ব্যাকগ্রাউন্ডে) */}
              <div
                className={`border shadow-sm relative z-10 flex items-center justify-between p-2 border-b border-stone-200/50 dark:border-dark-border/50 ${
                  isFit && " backdrop-blur-sm"
                }`}
              >
                {title && (
                  <h3 className="text-xl font-bold text-gray-800 dark:text-stone-200 truncate">
                    {title}
                  </h3>
                )}
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg hover:bg-stone-100/50 dark:hover:bg-dark-elevated/50 transition-colors ${
                    !title ? "ml-auto" : ""
                  }`}
                >
                  <X size={20} className="text-stone-600 dark:text-stone-400" />
                </button>
              </div>

              {/* কন্টেন্ট (স্ক্রোলযোগ্য) */}
              <div
                className={`relative z-10 overflow-y-auto ${
                  isFit
                    ? "h-[calc(100vh-60px)] p-0"
                    : "max-h-[calc(90vh-80px)] p-0"
                }`}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
