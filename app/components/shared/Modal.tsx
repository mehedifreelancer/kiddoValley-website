"use client";

import { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "4xl" | "5xl" | "full" | "fit";
  children: ReactNode;
  disableOutsideClick?: boolean;
  disableScrollLock?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title = "",
  size = "xl",
  children,
  disableOutsideClick = false,
  disableScrollLock = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // স্ক্রল লক
  useEffect(() => {
    if (isOpen && !disableScrollLock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      if (!disableScrollLock) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen, disableScrollLock]);

  // Escape কী
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen && !disableOutsideClick) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, disableOutsideClick]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-4xl w-full m-1",
    fit: "w-screen h-screen max-w-none max-h-none p-1",
  };
  const isFit = size === "fit";

  // পোর্টালের কন্টেন্ট
  const modalContent = isOpen ? (
    <>
      {/* ব্যাকড্রপ */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          disableOutsideClick ? "pointer-events-none" : ""
        }`}
        onClick={
          disableOutsideClick
            ? undefined
            : (e) => {
                e.stopPropagation();
                onClose();
              }
        }
      />

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${isFit ? "p-0" : "p-4"}`}
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
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={`
            relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden
            rounded-md shadow-2xl border border-stone-200/50 dark:border-dark-border/50
            ${isFit ? "rounded-none border-0 shadow-none" : ""}
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
          <div className="relative z-10 flex items-center justify-between p-2 border-b border-stone-200/50 dark:border-dark-border/50 bg-white/30 dark:bg-black/10 backdrop-blur-sm">
            {title && (
              <h3 className="text-xl font-bold text-gray-800 dark:text-stone-200 truncate">
                {title}
              </h3>
            )}
            <button
              onClick={onClose}
              className={`cursor-pointer p-2 rounded-lg hover:bg-stone-100/50 dark:hover:bg-dark-elevated/50 transition-colors ${!title ? "ml-auto" : ""}`}
            >
              <X size={20} className="text-stone-600 dark:text-stone-400" />
            </button>
          </div>

          {/* কন্টেন্ট */}
          <div
            className={`relative z-10 overflow-y-auto ${
              isFit ? "h-[calc(100vh-60px)] p-0" : "max-h-[calc(90vh-80px)] p-0"
            }`}
          >
            {children}
          </div>
        </motion.div>
      </div>
    </>
  ) : null;

  // ✅ React Portal ব্যবহার করুন
  if (typeof window === "undefined") return null;
  return createPortal(
    <AnimatePresence>{modalContent}</AnimatePresence>,
    document.body,
  );
}
