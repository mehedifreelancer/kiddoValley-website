"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ShoppingCart, Eye, Layers } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";
import VideoModalContent from "./VideoModalContent";
import { useGlobal } from "@/app/contexts/GlobalContext";

interface Variant {
  id: number;
  sku: string;
  price: number;
  discount: number;
  inStock: "in stock" | "less than 5" | "out of stock";
  imgUrl: string | null;
  stockId: number;
  attributes: Record<string, string>;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  description?: string;
  videoUrl?: string | null;
  thumbnailImage: string | null;
  variants: Variant[];
  attributeOrderByPriority?: Array<{ key: string; values: string[] }>;
  isForceOrder: boolean;
  forceOrderPriority: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; name: string; slug: string };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (quantity: number) => void;
  showDetails?: boolean;
  showButtons?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  showDetails = false,
  showButtons = true,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cart, addToCart, openCart } = useGlobal();

  const primaryAttribute = useMemo(() => {
    if (
      product.attributeOrderByPriority &&
      product.attributeOrderByPriority.length > 0
    ) {
      return product.attributeOrderByPriority[0];
    }
    return null;
  }, [product]);

  const primaryKey = primaryAttribute?.key || null;
  const variantBadges = primaryAttribute?.values || [];

  const getDefaultVariant = (): Variant | null => {
    if (!product.variants || product.variants.length === 0) return null;
    let candidate = product.variants.find(
      (v) =>
        (v.inStock === "in stock" || v.inStock === "less than 5") &&
        (primaryKey ? v.attributes?.[primaryKey] : true),
    );
    if (candidate) return candidate;
    candidate = product.variants.find(
      (v) => v.inStock === "in stock" || v.inStock === "less than 5",
    );
    if (candidate) return candidate;
    return product.variants[0];
  };

  const defaultVariant = useMemo(
    () => getDefaultVariant(),
    [product.variants, primaryKey],
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    defaultVariant,
  );
  const currentVariant = selectedVariant ?? defaultVariant;

  const getVariantLabel = (variant: Variant | null): string => {
    if (!variant || !primaryKey) return "";
    const value = variant.attributes?.[primaryKey];
    return value ? String(value) : "";
  };

  const variantLabel = getVariantLabel(currentVariant);

  const calculateActiveBadgeIndex = (
    variant: Variant | null,
  ): number | null => {
    if (!variant || !primaryAttribute) return null;
    const label = getVariantLabel(variant);
    if (label) {
      const idx = variantBadges.indexOf(label);
      return idx !== -1 ? idx : null;
    }
    return null;
  };

  const getDefaultBadgeIndex = (): number | null => {
    if (!defaultVariant || !primaryAttribute) return null;
    const label = getVariantLabel(defaultVariant);
    if (label) {
      const idx = variantBadges.indexOf(label);
      return idx !== -1 ? idx : null;
    }
    return null;
  };

  const [activeBadgeIndex, setActiveBadgeIndex] = useState<number | null>(
    getDefaultBadgeIndex(),
  );

  useEffect(() => {
    const newIndex = calculateActiveBadgeIndex(selectedVariant);
    if (newIndex !== null) {
      setActiveBadgeIndex(newIndex);
    } else {
      setActiveBadgeIndex(null);
    }
  }, [selectedVariant, variantBadges, primaryAttribute]);

  // ✅ আপডেটেড handleBadgeClick – স্টকওয়ালা ভেরিয়েন্টকে প্রাধান্য দেয়
  const handleBadgeClick = (badgeValue: string, idx: number) => {
    if (!primaryKey) return;

    // ১. প্রথমে স্টকওয়ালা ভেরিয়েন্ট খুঁজি
    let matched = product.variants.find(
      (v) =>
        v.attributes?.[primaryKey] === badgeValue &&
        (v.inStock === "in stock" || v.inStock === "less than 5"),
    );

    // ২. স্টকওয়ালা না পেলে যেকোনো ম্যাচিং ভেরিয়েন্ট
    if (!matched) {
      matched = product.variants.find(
        (v) => v.attributes?.[primaryKey] === badgeValue,
      );
    }

    if (matched) {
      if (selectedVariant?.id === matched.id) {
        setSelectedVariant(null);
        setActiveBadgeIndex(getDefaultBadgeIndex());
      } else {
        setSelectedVariant(matched);
      }
    }
  };

  const displayPrice = currentVariant?.price ?? 0;
  const displayDiscount = currentVariant?.discount ?? 0;
  const displayImage =
    currentVariant?.imgUrl || product.thumbnailImage || "/placeholder.jpg";
  const displayInStock = currentVariant?.inStock || "out of stock";
  const discountedPrice =
    displayDiscount > 0
      ? displayPrice - (displayPrice * displayDiscount) / 100
      : displayPrice;

  const stockStatusColor =
    {
      "in stock":
        "text-emerald-700 bg-emerald-50 dark:bg-gray-950/60 dark:text-emerald-400",
      "less than 5":
        "text-amber-700 bg-amber-50 dark:bg-gray-950/60 dark:text-amber-400",
      "out of stock":
        "text-rose-700 bg-rose-50 dark:bg-gray-950/60 dark:text-rose-400",
    }[displayInStock] ||
    "text-stone-600 bg-stone-100 dark:bg-stone-800 dark:text-stone-400";

  const stockLabel =
    {
      "in stock": "স্টকে আছে",
      "less than 5": "সীমিত স্টক",
      "out of stock": "স্টক শেষ",
    }[displayInStock] || displayInStock;

  const handleViewVideo = () => {
    if (!product.videoUrl) return;
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  // ProductCard.tsx - handleAddToCart ফাংশনটি নিচের মতো আপডেট করুন

  const handleAddToCart = () => {
    // ✅ currentVariant থেকে stockId নিন
    const stockId = currentVariant?.stockId;
    if (!stockId) {
      console.error("❌ stockId missing for variant:", currentVariant);
      // ফ্যালব্যাক: product.variants থেকে প্রথম স্টক আইডি খুঁজুন (যদি currentVariant না থাকে)
      const fallback = product.variants?.find((v) => v.stockId)?.stockId;
      if (!fallback) {
        toast.error("স্টক আইডি পাওয়া যায়নি");
        return;
      }
      // fallback ব্যবহার করুন
      addToCart({
        id: String(product.id),
        name: product.name,
        stockId: fallback,
        price: displayPrice,
        imageUrl: displayImage,
        author: product.category?.name || "",
        quantity: 1,
      });
      openCart();
      return;
    }

    // ✅ সঠিক stockId সহ কার্টে যোগ করুন
    const uniqueId = `${product.id}-${currentVariant.sku}`;
    addToCart({
      id: uniqueId,
      name: product.name,
      price: displayPrice,
      stockId: stockId,
      imageUrl: displayImage,
      sku: currentVariant.sku,
      variant: currentVariant,
      quantity: 1,
    });
    openCart();
  };
  const handleDetails = () => {
    window.location.href = `/products/${product.slug}`;
  };

  const totalVariants = product.variants?.length || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-stone-200/60 dark:border-dark-border/60 overflow-hidden transition-all duration-300 h-full flex flex-col mx-auto w-full"
      >
        <div className="relative flex-shrink-0 bg-gradient-to-br from-rose-50/50 to-purple-50/50 dark:from-dark-surface/80 dark:to-dark-surface/60">
          <Link
            href={`/products/${product.slug}`}
            className="block relative aspect-[4/3] overflow-hidden"
          >
            <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform backface-visibility-hidden">
              {displayImage && displayImage !== "/placeholder.jpg" ? (
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-stone-300 dark:text-stone-600">
                    📖
                  </span>
                </div>
              )}
            </div>
          </Link>

          {displayDiscount > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-bold rounded-lg shadow-md tracking-wide">
                -{displayDiscount}%
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm ${stockStatusColor}`}
            >
              {stockLabel}
            </span>
          </div>
        </div>

        {totalVariants > 0 && (
          <div className="p-3 pb-2 border-b border-stone-100 dark:border-dark-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
                <Layers
                  size={16}
                  className="text-stone-400 dark:text-stone-500"
                />
                <span className="font-medium">{totalVariants}টি ভেরিয়েন্ট</span>
              </div>
              {product.videoUrl && (
                <button
                  onClick={handleViewVideo}
                  className="cursor-pointer flex items-center gap-1.5 text-sm font-medium bg-gray-600 hover:bg-rose-300 text-white px-2 rounded-full transition-colors shadow-sm"
                >
                  <Play size={12} className="fill-white" />
                  ভিডিও
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow">
          <div className="px-3 pb-4">
            <Link href={`/products/${product.slug}`}>
              <h3 className="mt-1 text-lg font-bold text-stone-800 dark:text-stone-100 line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
                {product.name}
                {variantLabel && ` (${variantLabel})`}
              </h3>
            </Link>

            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                ৳ {discountedPrice.toFixed(2)}
              </span>
              {displayDiscount > 0 && (
                <>
                  <del className="text-sm text-stone-400 dark:text-stone-500 line-through">
                    ৳{displayPrice.toFixed(2)}
                  </del>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    {displayDiscount}% ছাড়
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {primaryKey && (
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {primaryKey}:
                </span>
              )}
              {variantBadges.length > 0 ? (
                <>
                  {variantBadges.slice(0, 3).map((badge, idx) => (
                    <span
                      key={idx}
                      onClick={() => handleBadgeClick(badge, idx)}
                      className={`
                        cursor-pointer inline-block px-2.5 py-0.5 rounded-md text-xs font-medium border transition-all duration-200
                        ${
                          idx === activeBadgeIndex
                            ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 shadow-sm"
                            : "bg-stone-100 dark:bg-dark-surface/60 text-stone-700 dark:text-stone-300 border-stone-200/50 dark:border-dark-border/40 hover:bg-stone-200 dark:hover:bg-stone-700/40"
                        }
                      `}
                    >
                      {badge}
                    </span>
                  ))}
                  {variantBadges.length > 3 && (
                    <span className="inline-block px-2.5 py-0.5 text-stone-500 dark:text-stone-400 text-xs font-medium">
                      +{variantBadges.length - 3}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs text-gray-400">No variant</span>
              )}
            </div>
          </div>

          {showButtons && (
            <div className="px-3 pb-4 flex gap-2 mt-auto border-t border-stone-100 dark:border-dark-border/50 pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={<ShoppingCart size={16} />}
                onClick={handleAddToCart}
                className="w-full"
                disabled={displayInStock === "out of stock"}
              >
                {displayInStock === "out of stock" ? "স্টক শেষ" : "কার্ট"}
              </Button>

              <Link href={`/products/${product.slug}`} className="w-full">
                <Button
                  className="w-full"
                  variant="secondary"
                  size="sm"
                  icon={<Eye size={16} />}
                >
                  বিস্তারিত
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {isModalOpen && product.videoUrl && (
        <Modal
          title={`${product.name} – ভিডিও প্রিভিউ`}
          size="xl"
          onClose={handleCloseModal}
          isOpen={isModalOpen}
        >
          <VideoModalContent videoUrl={product.videoUrl} title={product.name} />
        </Modal>
      )}
    </>
  );
}
