// components/products/ProductDetails.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, BookOpen, ChevronUp, ChevronDown } from "lucide-react";
import { Book, books } from "@/app/data/books"; // Import Book type and books data
import AddToCartButton from "./AddToCartButton";
import Button from "./Button";
import Modal from "./Modal";
import VideoModalContent from "./VideoModalContent";
import RelatedProducts from "./RelatedProducts";

interface ProductDetailsProps {
  product: Book; // Using Book type
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Get related products (same category, exclude current)
  const relatedProducts = books
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="space-y-8">
        {/* Main Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Product Image */}
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen
                  size={64}
                  className="text-stone-300 dark:text-stone-600"
                />
              </div>
            )}

            {/* Category Badge */}
            <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-full text-sm font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-dark-border">
              {product.category}
            </span>

            {/* Rating Badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-amber-900 rounded-full text-sm font-medium">
              <span>★</span>
              <span>{product.rating}</span>
            </div>

            {/* Age Range Badge */}
            <span className="absolute top-4 right-4 px-3 py-1.5 bg-[#7986CB] text-white rounded-full text-sm font-medium">
              {product.ageRange}
            </span>
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            {/* Title and Author */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400">
                লিখেছেন: {product.author}
              </p>
            </div>

            {/* Description - Using a default description since your Book type doesn't have it */}
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
                {product.description ||
                  `${product.name} বইটি ${product.ageRange} বয়সী শিশুদের জন্য একটি চমৎকার ${product.category} গল্প।`}
              </p>
            </div>

            {/* Product Specs - Using available fields */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-200 dark:border-dark-border">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-500">
                  বয়স
                </p>
                <p className="font-medium text-stone-800 dark:text-stone-200">
                  {product.ageRange}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-500">
                  ধরণ
                </p>
                <p className="font-medium text-stone-800 dark:text-stone-200">
                  {product.category}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#E57373]">
                ৳{product.price.toFixed(2)}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                পরিমাণ:
              </span>
              <div className="flex items-center border border-stone-200 dark:border-dark-border rounded-lg overflow-hidden">
                <button
                  onClick={handleDecrement}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors"
                >
                  <ChevronDown
                    size={18}
                    className="text-stone-600 dark:text-stone-400"
                  />
                </button>
                <span className="w-12 text-center font-medium text-stone-800 dark:text-stone-200">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors"
                >
                  <ChevronUp
                    size={18}
                    className="text-stone-600 dark:text-stone-400"
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="flex-1">
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  price={product.price}
                  onAddToCart={(qty) =>
                    console.log(`Added ${qty} of ${product.id}`)
                  }
                />
              </div>

              {product.videoUrl && (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Play size={18} />}
                  onClick={() => setIsVideoModalOpen(true)}
                  className="flex-1"
                >
                  ভিডিও দেখুন
                </Button>
              )}
            </div>

            {/* Additional Info */}
            <div className="text-sm text-stone-500 dark:text-stone-500 pt-4">
              <p>✓ ফ্রি শিপিং (৫০০+ টাকার অর্ডারে)</p>
              <p>✓ ৭ দিনের মধ্যে রিটার্ন</p>
              <p>✓ পেমেন্ট অন ডেলিভারি</p>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts}
            title="আপনি আরও পছন্দ করতে পারেন"
            maxColumns={4}
          />
        )}
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <Modal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          title={`${product.name} - ভিডিও প্রিভিউ`}
          size="lg"
        >
          <VideoModalContent
            videoUrl={product.videoUrl || ""}
            title={product.name}
          />
        </Modal>
      )}
    </>
  );
}
