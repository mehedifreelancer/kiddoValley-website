// components/products/AllProductSection.tsx
"use client";

import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { useEffect, useRef } from "react";
import { getPublicProducts, Product } from "@/app/products/product.service";

// ✅ নিরাপদ ম্যাপিং ফাংশন – API প্রোডাক্টকে ProductCard-এর জন্য উপযুক্ত অবজেক্টে রূপান্তর
// AllProductSection.tsx - mapProductToBook ফাংশন
const mapProductToBook = (product: Product): any => {
  if (!product) {
    return {
      id: "0",
      name: "Unknown",
      slug: "unknown",
      price: 0,
      discount: 0,
      imageUrl: "/placeholder.jpg",
      category: "Uncategorized",
      author: "Unknown",
      rating: 4.5,
      videoUrl: null,
      inStock: "out of stock",
      variants: [],
      attributeOrderByPriority: [],
      thumbnailImage: "/placeholder.jpg",
      weight: 0, // 🆕 এখানে যোগ করুন (ডিফল্ট)
      isForceOrder: false,
      forceOrderPriority: 0,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const defaultVariant = product.variants?.[0];
  const defaultPrice = defaultVariant?.price ?? 0;
  const defaultDiscount = defaultVariant?.discount ?? 0;
  const defaultInStock = defaultVariant?.inStock ?? "out of stock";

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    price: defaultPrice,
    discount: defaultDiscount,
    imageUrl: product.thumbnailImage || "/placeholder.jpg",
    category: product.category?.name || "Uncategorized",
    author: product.variants?.[0]?.sku || "Unknown Author",
    rating: 4.5,
    videoUrl: product.videoUrl || null,
    inStock: defaultInStock,
    variants: product.variants || [],
    attributeOrderByPriority: product.attributeOrderByPriority || [],
    thumbnailImage: product.thumbnailImage || "/placeholder.jpg",
    weight: product.weight ?? 0.5, // 🆕 এই লাইনটা যোগ করুন
    categoryObj: product.category,
    isForceOrder: product.isForceOrder,
    forceOrderPriority: product.forceOrderPriority,
    isPublished: product.isPublished,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
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
      <section className="py-16 bg-cream-50/50 dark:bg-dark-bg/50 ">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 my-[50px]">
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
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 text-center my-[50px]">
          <p className="text-red-500">Failed to load products.</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 my-[50px] text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 my-[50px]">
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
