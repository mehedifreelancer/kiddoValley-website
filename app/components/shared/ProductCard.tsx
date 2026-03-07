// components/products/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, BookOpen, Heart } from "lucide-react"; // Added Heart import
import { Book } from "@/app/data/books";
import AddToCartButton from "./AddToCartButton";
import Button from "./Button";
import Modal from "./Modal";
import VideoModalContent from "./VideoModalContent";

interface ProductCardProps {
  product: Book;
  onAddToCart?: (quantity: number) => void;
  showDetails?: boolean; // Control author and category visibility
  showButtons?: boolean; // Control action buttons visibility
}

export default function ProductCard({
  product,
  onAddToCart,
  showDetails = false, // Default to true for backward compatibility
  showButtons = true, // Default to true for backward compatibility
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // Added like state

  const handleViewVideo = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group bg-white dark:bg-dark-surface rounded-md shadow-sm overflow-hidden border border-stone-100 dark:border-dark-border transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative">
          {" "}
          {/* Added relative wrapper for absolute positioning */}
          <Link
            href={`/products/${product.id}`}
            className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10"
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen
                  size={48}
                  className="text-stone-300 dark:text-stone-600"
                />
              </div>
            )}

            {/* Rating Badge - Always visible */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-medium z-10">
              <span>★</span>
              <span>{product.rating}</span>
            </div>

            {/* Video Badge - Always visible if exists */}
            {product.videoUrl && (
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full p-1.5 z-10">
                <Play size={16} className="fill-white" />
              </div>
            )}
          </Link>
          {/* Like Button - New addition from the image */}
        </div>

        {/* Content */}
        <div className="p-2">
          <div className="flex justify-between items-start mb-3">
            <Link href={`/products/${product.id}`} className="block flex-1">
              <h3 className="mb-1 text-xl font-bold text-stone-800 dark:text-stone-200 line-clamp-1 group-hover:text-[#E57373] transition-colors duration-300">
                {product.name}
              </h3>

              {/* Author - New addition */}
              {showDetails && (
                <p className="text-sm text-stone-500 dark:text-stone-500 mt-1">
                  {product.author}
                </p>
              )}

              {/* Category - Kept as is */}
              <>
                <span className="inline-block mt-1 px-2 py-1 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-full text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-dark-border">
                  {product.category}
                </span>
              </>

              {/* Description - Now with line-clamp */}
              {showDetails && (
                <div className="mt-3">
                  <p className="text-lg text-gray dark:text-stone-400">
                    জীবের মধ্যে সবচেয়ে সম্পূর্ণতা মানুষের। কিন্তু সবচেয়ে
                    অসম্পূর্ণ হয়ে সে জন্মগ্রহণ করে। বাঘ ভালুক তার জীবনযাত্রার
                    নেপথ্যে। মানুষকে দেখতে হল খুব ছোটো, কিন্তু সেটা একটা কৌশল
                  </p>
                </div>
              )}
            </Link>

            {/* Price - Always visible */}
            <div className="ml-2">
              <span className="text-lg font-bold text-[#E57373] whitespace-nowrap">
                ৳{product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Stats Row - New addition from the image */}

          <div className="flex items-center gap-4 my-3 text-xs text-stone-500 dark:text-stone-500 border-t border-stone-100 dark:border-dark-border "></div>

          {/* Action Buttons - Conditionally shown based on showButtons */}
          {showButtons && (
            <div className="flex gap-2 pb-2">
              <div className={product.videoUrl ? "flex-1" : "w-full"}>
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  author={product.author}
                />
              </div>

              {product.videoUrl && (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Play size={16} />}
                  onClick={handleViewVideo}
                  className="flex-1"
                >
                  ভিডিও
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal - Only shown when video button is clicked */}
      {isModalOpen && (
        <Modal
          title={`${product.name} - ভিডিও প্রিভিউ`}
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
