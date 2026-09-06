// components/products/RelatedProducts.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Book } from "@/app/data/books";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";

interface RelatedProductsProps {
  products: Book[];
  title?: string;
}

export default function RelatedProducts({
  products,
  title = "আপনি আরও পছন্দ করতে পারেন",
}: RelatedProductsProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!products.length) return null;

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  const ArrowButton = ({
    direction,
    onClick,
    className = "",
  }: {
    direction: "prev" | "next";
    onClick: () => void;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={`flex items-center justify-center rounded-full bg-white dark:bg-dark-surface border border-stone-200 dark:border-dark-border text-stone-600 dark:text-stone-300 shadow-sm hover:bg-gradient-to-r hover:from-[#E57373] hover:to-[#BA68C8] hover:text-white hover:border-transparent hover:shadow-md transition-all duration-300 active:scale-95 ${className}`}
    >
      {direction === "prev" ? (
        <ChevronLeft size={18} />
      ) : (
        <ChevronRight size={18} />
      )}
    </button>
  );

  return (
    <div className="relative pt-8 md:pt-12 mt-6 md:mt-8 border-t border-stone-200 dark:border-dark-border">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-light text-stone-800 dark:text-stone-200">
          {title}
        </h2>

        {/* ডেস্কটপ নেভিগেশন — হেডারের পাশে */}
        <div className="hidden md:flex gap-2">
          <ArrowButton direction="prev" onClick={goPrev} className="w-9 h-9" />
          <ArrowButton direction="next" onClick={goNext} className="w-9 h-9" />
        </div>
      </div>

      <div className="relative">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={2.2}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: { slidesPerView: 2.4, spaceBetween: 12 },
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 3.5, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          }}
          loop={true}
          speed={800}
          className="w-full !pb-1"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Link href={`/products/${product.id}`} className="block group">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10 mb-2">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 480px) 45vw, (max-width: 640px) 33vw, (max-width: 1024px) 28vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen
                        size={32}
                        className="text-stone-300 dark:text-stone-600"
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-sm md:text-base font-medium text-stone-800 dark:text-stone-200 line-clamp-1 group-hover:text-[#E57373] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-[#E57373] font-bold">
                  ৳{product.price.toFixed(2)}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* মোবাইল নেভিগেশন — ছবির ওপরে ওভারলে */}
        <div className="md:hidden">
          <ArrowButton
            direction="prev"
            onClick={goPrev}
            className="absolute left-1 top-[32%] -translate-y-1/2 z-10 w-8 h-8 !bg-white/90 dark:!bg-black/70 backdrop-blur-sm"
          />
          <ArrowButton
            direction="next"
            onClick={goNext}
            className="absolute right-1 top-[32%] -translate-y-1/2 z-10 w-8 h-8 !bg-white/90 dark:!bg-black/70 backdrop-blur-sm"
          />
        </div>
      </div>
    </div>
  );
}
