// components/cart/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { CartItem as CartItemType } from "@/app/contexts/GlobalContext";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onItemClick?: () => void;
  variant?: "default" | "checkout" | "sidebar";
  showRemove?: boolean;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onItemClick,
  variant = "default",
  showRemove = true,
}: CartItemProps) {
  const getItemStyles = () => {
    switch (variant) {
      case "sidebar":
        return "backdrop-blur-md bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 border border-white/20 dark:border-white/10";
      case "checkout":
        return "backdrop-blur-md bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30";
      default:
        return "hover:bg-stone-50 dark:hover:bg-dark-elevated";
    }
  };

  const getImageContainerStyles = () => {
    switch (variant) {
      case "sidebar":
        return "bg-gradient-to-br from-[#E57373]/30 to-[#BA68C8]/30 backdrop-blur-sm border border-white/20 shadow-lg";
      case "checkout":
        return "bg-gradient-to-br from-[#E57373]/30 to-[#BA68C8]/30 backdrop-blur-sm border border-white/20 shadow-lg";
      default:
        return "bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10";
    }
  };

  const getQuantityControlStyles = () => {
    switch (variant) {
      case "sidebar":
        return "border border-white/30 dark:border-white/20 backdrop-blur-sm bg-white/20 dark:bg-black/30";
      case "checkout":
        return "border border-white/30 dark:border-white/20 backdrop-blur-sm bg-white/20 dark:bg-black/30";
      default:
        return "border border-stone-200 dark:border-dark-border";
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case "sidebar":
        return "hover:bg-white/30 dark:hover:bg-black/40";
      case "checkout":
        return "hover:bg-white/30 dark:hover:bg-black/40";
      default:
        return "hover:bg-stone-100 dark:hover:bg-dark-elevated";
    }
  };

  const getRemoveButtonStyles = () => {
    switch (variant) {
      case "sidebar":
        return "hover:bg-white/30 dark:hover:bg-black/40 backdrop-blur-sm";
      case "checkout":
        return "hover:bg-white/30 dark:hover:bg-black/40 backdrop-blur-sm";
      default:
        return "hover:bg-stone-200 dark:hover:bg-dark-elevated";
    }
  };

  const getTextColors = () => {
    switch (variant) {
      case "sidebar":
      case "checkout":
      return {
        name: "text-stone-800 dark:text-stone-200",
        author: "text-stone-600/80 dark:text-stone-400/80",
        quantity: "text-stone-800 dark:text-stone-200",
        price: "text-[#E57373]",
        icon: "text-stone-700 dark:text-stone-300",
        removeIcon: "text-red-400 dark:text-stone-400"
      };
      default:
      return {
        name: "text-stone-800 dark:text-stone-200",
        author: "text-stone-600 dark:text-stone-400",
        quantity: "text-stone-700 dark:text-stone-300",
        price: "text-[#E57373]",
        icon: "text-stone-600 dark:text-stone-400",
        removeIcon: "text-red-400 dark:text-stone-400"
      };
    }
  };

  const colors = getTextColors();

  return (
    <div className={`flex gap-3 p-2 rounded-lg transition-all duration-300 ${getItemStyles()}`}>
      {/* Product Image */}
      <Link
        href={`/products/${item.id}`}
        onClick={onItemClick}
        className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${getImageContainerStyles()}`}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag size={24} className="text-stone-400 dark:text-stone-500" />
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <Link
            href={`/products/${item.id}`}
            onClick={onItemClick}
            className="block flex-1"
          >
            <h3 className={`font-medium line-clamp-1 hover:text-[#E57373] transition-colors ${colors.name}`}>
              {item.name}
            </h3>
          </Link>
          {showRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className={`p-1 rounded-full transition-colors self-start ${getRemoveButtonStyles()}`}
            >
              <Trash2 size={16} className={colors.removeIcon} />
            </button>
          )}
        </div>

        {item.author && (
          <p className={`text-xs mt-0.5 ${colors.author}`}>
            {item.author}
          </p>
        )}

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-2">
          <span className={`font-bold ${colors.price}`}>
            ৳{(item.price * item.quantity).toFixed(2)}
          </span>

          <div className={`flex items-center rounded-md ${getQuantityControlStyles()}`}>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className={`p-1 transition-colors rounded-l-md ${getButtonStyles()}`}
            >
              <Minus size={14} className={colors.icon} />
            </button>
            <span className={`w-8 text-center text-sm font-medium ${colors.quantity}`}>
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className={`p-1 transition-colors rounded-r-md ${getButtonStyles()}`}
            >
              <Plus size={14} className={colors.icon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}