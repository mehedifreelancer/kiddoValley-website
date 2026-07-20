// components/products/AllProductSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { useEffect, useRef } from "react";
import { getPublicProducts, Product } from "@/app/products/product.service";

// Map API product to Book type expected by ProductCard
const mapProductToBook = (product: Product): any => ({
  id: String(product.id),
  name: product.name,
  price: product.price,
  discount: product.discount,
  imageUrl: product.thumbnailImage?.[0]?.imgUrl || "/placeholder.jpg",
  category: product.category?.name || "Uncategorized",
  author: product.sku || "Unknown Author",
  rating: 4.5, // you can compute this from reviews
  videoUrl: product.videoUrl || null,
  inStock: product.inStock || "out of stock",
  variants: product.variants || {},
});
export default function AllProductSection() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["public-products"],
    queryFn: ({ pageParam = 1 }) => getPublicProducts(pageParam, 12),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-cream-50/50 dark:bg-dark-bg/50">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-cream-50/50 dark:bg-dark-bg/50">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load products.</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <div className="container-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-stone-800 dark:text-stone-200 mb-1">
            সব{" "}
            <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
              পণ্য
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            আমাদের সম্পূর্ণ সংগ্রহ দেখুন
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={mapProductToBook(product)}
              onAddToCart={() => {}}
            />
          ))}
        </div>

        {hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
