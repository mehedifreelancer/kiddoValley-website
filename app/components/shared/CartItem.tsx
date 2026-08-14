// components/shared/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/app/contexts/GlobalContext";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onItemClick?: () => void;
  variant?: "sidebar" | "checkout";
  showRemove?: boolean;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onItemClick,
  variant = "sidebar",
  showRemove = true,
}: CartItemProps) {
  // ===== ভ্যারিয়েন্টের অ্যাট্রিবিউট থেকে ডিটেইল বের করা =====
  const getVariantDetails = (): string => {
    if (!item.variant?.attributes) return "";
    const attrs = item.variant.attributes;
    // সব ভ্যালুকে কমা দিয়ে আলাদা করি
    return Object.values(attrs).filter(Boolean).join(", ");
  };

  const variantDetails = getVariantDetails();

  const isSidebar = variant === "sidebar";

  // 🆕 discount আছে কিনা check করো
  const hasDiscount =
    !!item.discountPercent &&
    item.discountPercent > 0 &&
    !!item.originalPrice &&
    item.originalPrice > item.price;

  return (
    <div
      className={`flex gap-3 p-2 rounded-lg ${isSidebar ? "bg-white dark:bg-dark-surface" : ""}`}
    >
      {/* ইমেজ */}
      <Link
        href={`/products/${item.slug || item.id}`}
        onClick={onItemClick}
        className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100 dark:bg-dark-elevated"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            📖
          </div>
        )}
        {/* 🆕 ছোট discount badge, image এর কোণায় */}
        {hasDiscount && (
          <span className="absolute top-1 left-1 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            -{item.discountPercent}%
          </span>
        )}
      </Link>

      {/* তথ্য */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug || item.id}`}
          onClick={onItemClick}
          className="block"
        >
          <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
            {item.name}
          </h4>
          {/* ✅ ভ্যারিয়েন্ট ডিটেইল – ছোট আকারে */}
          {variantDetails && (
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {variantDetails}
            </p>
          )}

          {/* 🆕 প্রতি ইউনিট প্রাইস — discount থাকলে original strikethrough + discounted highlight */}
          {hasDiscount ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-stone-400 dark:text-stone-500 line-through">
                ৳{item.originalPrice!.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ৳{item.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              ৳{item.price.toFixed(2)}
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1 rounded hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} className="text-stone-600 dark:text-stone-400" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-stone-800 dark:text-stone-200">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1 rounded hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} className="text-stone-600 dark:text-stone-400" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              ৳{(item.price * item.quantity).toFixed(2)}
            </span>
            {showRemove && (
              <button
                onClick={() => onRemove(item.id)}
                className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  