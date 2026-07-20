"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ShoppingCart, Eye, Layers } from "lucide-react";
import { Book } from "@/app/data/books";
import Button from "./Button";
import Modal from "./Modal";
import VideoModalContent from "./VideoModalContent";
import { useGlobal } from "@/app/contexts/GlobalContext";

interface ProductCardProps {
  product: Book;
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
  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const [activeBadgeIndex, setActiveBadgeIndex] = useState<number | null>(null);

  // Safe fallbacks
  const price = product?.price ?? 0;
  const discount = product?.discount ?? 0;
  const imageUrl = product?.imageUrl || "/placeholder.jpg";
  const name = product?.name || "Untitled";
  const author = product?.author || "Unknown Author";
  const videoUrl = product?.videoUrl || null;
  const inStock = product?.inStock || "out of stock";
  const variants = product?.variants || {};

  // Count total variants across all variant dimensions
  const variantValues = Object.values(variants).flat();
  const totalVariants = variantValues.length;

  // Extract language values if "Language" key exists, otherwise use all variant values
  const languageValues = variants["Language"] || [];
  const displayBadges =
    languageValues.length > 0 ? languageValues : variantValues;

  const handleViewVideo = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name,
      price,
      imageUrl,
      author,
      quantity: 1,
    });
    openCart();
  };

  const handleDetails = () => {
    // Navigate to product detail page
    window.location.href = `/products/${product.id}`;
  };

  // Stock status badge color
  const stockStatusColor =
    {
      "in stock":
        "text-emerald-700 bg-emerald-50 dark:bg-gray-950/60 dark:text-emerald-400",
      "less than 5":
        "text-amber-700 bg-amber-50 dark:bg-gray-950/60 dark:text-amber-400",
      "out of stock":
        "text-rose-700 bg-rose-50 dark:bg-gray-950/60 dark:text-rose-400",
    }[inStock] ||
    "text-stone-600 bg-stone-100 dark:bg-stone-800 dark:text-stone-400";

  // Stock status label
  const stockLabel =
    {
      "in stock": "স্টকে আছে",
      "less than 5": "সীমিত স্টক",
      "out of stock": "স্টক শেষ",
    }[inStock] || inStock;

  // Calculate discounted price
  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  // Determine if we should show the variant section
  const showVariantSection = totalVariants > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-stone-200/60 dark:border-dark-border/60 overflow-hidden transition-all duration-300 h-full flex flex-col  mx-auto w-full"
      >
        {/* ─── Image Container ─── */}
        <div className="relative flex-shrink-0 bg-gradient-to-br from-rose-50/50 to-purple-50/50 dark:from-dark-surface/80 dark:to-dark-surface/60">
          <Link
            href={`/products/${product.id}`}
            className="block relative aspect-[4/3] overflow-hidden"
          >
            {imageUrl && imageUrl !== "/placeholder.jpg" ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-content transition-transform duration-500 ease-out group-hover:scale-105"
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

            {/* 🔹 Discount Badge – Top Left */}
            {discount > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-bold rounded-lg shadow-md tracking-wide">
                  -{discount}%
                </span>
              </div>
            )}

            {/* 🔹 Stock Status – Top Right */}
            <div className="absolute top-3 right-3 z-10">
              <span
                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm ${stockStatusColor}`}
              >
                {stockLabel}
              </span>
            </div>

            {/* 🔹 Video Badge – Bottom Right (overlay) */}
            {videoUrl && (
              <div className="absolute bottom-3 right-3 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewVideo();
                  }}
                  className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm hover:bg-black/75 text-white rounded-full px-3 py-1.5 text-xs font-medium transition-colors shadow-lg"
                >
                  <Play size={14} className="fill-white" />
                  ভিডিও
                </button>
              </div>
            )}
          </Link>
        </div>

        {/* ─── Variant Section ─── */}
        <div className="p-3 pb-2 border-b border-stone-100 dark:border-dark-border/50">
          {/* Row: Variant count + Video button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
              <Layers
                size={16}
                className="text-stone-400 dark:text-stone-500"
              />
              <span className="font-medium">{totalVariants}টি ভেরিয়েন্ট</span>
            </div>

            {!videoUrl && (
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

        {/* ─── Content ─── */}
        <div className="flex flex-col flex-grow">
          <div className="px-3 pb-4 ">
            <Link href={`/products/${product.id}`}>
              {/* Product Name */}
              <h3 className="mt-1 text-lg font-bold text-stone-800 dark:text-stone-100 line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
                {name}
              </h3>
            </Link>

            {/* Price */}
            <div className=" flex items-baseline gap-2 flex-wrap">
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                ৳{discountedPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <>
                  <del className="text-sm text-stone-400 dark:text-stone-500 line-through">
                    ৳{price.toFixed(2)}
                  </del>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    {discount}% ছাড়
                  </span>
                </>
              )}
            </div>

            {/* ─── Language / Variant Badges ─── */}
            {displayBadges.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span>Select:</span>
                {displayBadges.slice(0, 3).map((value, idx) => (
                  <span
                    key={idx}
                    onClick={() =>
                      setActiveBadgeIndex(idx === activeBadgeIndex ? null : idx)
                    }
                    className={`
                          cursor-pointer inline-block px-2.5 py-0.5 rounded-md text-xs font-medium border transition-all duration-200
                          ${
                            idx === activeBadgeIndex
                              ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 shadow-sm"
                              : "bg-stone-100 dark:bg-dark-surface/60 text-stone-700 dark:text-stone-300 border-stone-200/50 dark:border-dark-border/40 hover:bg-stone-200 dark:hover:bg-stone-700/40"
                          }
                        `}
                  >
                    {value}
                  </span>
                ))}
                {displayBadges.length > 3 && (
                  <span className="inline-block px-2.5 py-0.5 text-stone-500 dark:text-stone-400 text-xs font-medium">
                    +{displayBadges.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-2.5">
                <span className="inline-block px-2.5 py-0.5 bg-stone-100 dark:bg-dark-surface/60 text-stone-700 dark:text-stone-300 rounded-md text-xs font-medium border border-stone-200/50 dark:border-dark-border/40">
                  No variant
                </span>
              </div>
            )}
          </div>
          {/* ─── Action Buttons ─── */}
          {showButtons && (
            <div className="px-3 pb-4  flex gap-2 mt-auto border-t border-stone-100 dark:border-dark-border/50 pt-2 ">
              <Button
                variant="primary"
                size="sm"
                icon={<ShoppingCart size={16} />}
                onClick={handleAddToCart}
                className="w-full"
                disabled={inStock === "out of stock"}
              >
                {inStock === "out of stock" ? "স্টক শেষ" : "কার্ট"}
              </Button>

              <Link href={`/products/${product.id}`} className="w-full">
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

      {/* ─── Video Modal ─── */}
      {isModalOpen && (
        <Modal
          title={`${name} – ভিডিও প্রিভিউ`}
          size="xl"
          onClose={handleCloseModal}
          isOpen={isModalOpen}
        >
          <VideoModalContent videoUrl={videoUrl} title={name} />
        </Modal>
      )}
    </>
  );
}
