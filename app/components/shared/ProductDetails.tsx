// components/shared/ProductDetails.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Play,
  BookOpen,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Button from "./Button";
import Modal from "./Modal";
import VideoModalContent from "./VideoModalContent";
import { Product } from "@/app/products/product.service";
import { useGlobal } from "@/app/contexts/GlobalContext";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart, openCart } = useGlobal();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // ===== সব ইমেজ সংগ্রহ =====
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    if (product?.thumbnailImage) imgs.push(product.thumbnailImage);
    if (product?.variants && Array.isArray(product.variants)) {
      product.variants.forEach((v) => {
        if (v.imgUrl && !imgs.includes(v.imgUrl)) imgs.push(v.imgUrl);
      });
    }
    return imgs;
  }, [product]);

  // ===== প্রাইমারি অ্যাট্রিবিউট =====
  const primaryAttributes = product?.attributeOrderByPriority || [];

  // ===== ডিফল্ট ভেরিয়েন্ট =====
  const defaultVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return (
      product.variants.find(
        (v) => v.inStock === "in stock" || v.inStock === "less than 5",
      ) || product.variants[0]
    );
  }, [product?.variants]);

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const currentVariant = selectedVariant || defaultVariant;

  // ===== ফিল্টার স্টেট =====
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const defaultFilters: Record<string, string> = {};
    primaryAttributes.forEach((attr) => {
      if (attr.values.length > 0) {
        defaultFilters[attr.key] = attr.values[0];
      }
    });
    return defaultFilters;
  });

  // ===== ডিসপ্লে ডেটা =====
  const displayPrice = currentVariant?.price ?? 0;
  const displayDiscount = currentVariant?.discount ?? 0;
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

  // ===== ফিল্টার পরিবর্তন =====
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const matched = product.variants.find((v) =>
      Object.entries(newFilters).every(([k, val]) => {
        if (!val) return true;
        return v.attributes?.[k] === val;
      }),
    );
    if (matched) {
      setSelectedVariant(matched);
      const idx = allImages.indexOf(
        matched.imgUrl || product.thumbnailImage || "",
      );
      if (idx !== -1 && thumbsSwiper) {
        thumbsSwiper.slideTo(idx);
      }
    }
  };

  // ===== কার্টে যোগ =====
  const handleAddToCart = () => {
    if (!currentVariant) return;
    const uniqueId = `${product.id}-${currentVariant.sku}`;
    addToCart({
      id: uniqueId,
      name: product.name,
      price: displayPrice,
      imageUrl:
        currentVariant.imgUrl || product.thumbnailImage || "/placeholder.jpg",
      sku: currentVariant.sku,
      variant: currentVariant,
      quantity: 1,
    });
    openCart();
  };

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  // ===== শুধু ভ্যালুওয়ালা অ্যাট্রিবিউট =====
  const visibleAttributes = primaryAttributes.filter(
    (attr) => attr.values.length > 0,
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ─── LEFT: ইমেজ স্লাইডার (Swiper) ─── */}
        <div className="w-full">
          <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10">
            <Swiper
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="h-full w-full"
              autoplay={false}
            >
              {allImages.length > 0 ? (
                allImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`${product.name} - ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="flex items-center justify-center w-full h-full">
                    <BookOpen
                      size={64}
                      className="text-stone-300 dark:text-stone-600"
                    />
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            {/* ব্যাজ: ডিসকাউন্ট ও স্টক */}
            {displayDiscount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-sm font-bold rounded-lg shadow-md z-10">
                -{displayDiscount}%
              </span>
            )}
            <span
              className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm backdrop-blur-sm z-10 ${stockStatusColor}`}
            >
              {stockLabel}
            </span>
            <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-full text-sm font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-dark-border z-10">
              {product.category?.name || "ক্যাটাগরি"}
            </span>
          </div>

          {/* থাম্বনেইল স্লাইডার */}
          {allImages.length > 1 && (
            <div className="mt-3">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper"
              >
                {allImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-transparent hover:border-rose-500 transition-colors cursor-pointer">
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* ─── RIGHT: প্রোডাক্ট তথ্য ─── */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              {product.category?.name || "বই"}
            </p>
          </div>

          {/* বিবরণ */}
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
              {product.description || `${product.name} – একটি চমৎকার বই।`}
            </p>
          </div>

          {/* ─── অ্যাট্রিবিউট ফিল্টার (শুধু ভ্যালুওয়ালা) ─── */}
          {visibleAttributes.length > 0 && (
            <div className="space-y-3">
              {visibleAttributes.map((attr) => {
                const currentValue = filters[attr.key] || "";
                return (
                  <div key={attr.key}>
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1">
                      {attr.key}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((val) => (
                        <button
                          key={val}
                          onClick={() => handleFilterChange(attr.key, val)}
                          className={`px-3 py-1 text-sm rounded-full border transition-all ${
                            currentValue === val
                              ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700"
                              : "bg-stone-100 dark:bg-dark-surface/60 text-stone-700 dark:text-stone-300 border-stone-200/50 dark:border-dark-border/40 hover:bg-stone-200"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* দাম ও ডিসকাউন্ট */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#E57373]">
              ৳{discountedPrice.toFixed(2)}
            </span>
            {displayDiscount > 0 && (
              <>
                <del className="text-sm text-stone-400 dark:text-stone-500 line-through">
                  ৳{displayPrice.toFixed(2)}
                </del>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  {displayDiscount}% ছাড়
                </span>
              </>
            )}
          </div>

          {/* পরিমাণ */}
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

          {/* অ্যাকশন বাটন */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="primary"
              size="md"
              icon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
              disabled={displayInStock === "out of stock"}
              className="flex-1"
            >
              {displayInStock === "out of stock"
                ? "স্টক শেষ"
                : "কার্টে যোগ করুন"}
            </Button>

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

          {/* অতিরিক্ত তথ্য */}
          <div className="text-sm text-stone-500 dark:text-stone-500 pt-4 space-y-1">
            <p>✓ ফ্রি শিপিং (৫০০+ টাকার অর্ডারে)</p>
            <p>✓ ৭ দিনের মধ্যে রিটার্ন</p>
            <p>✓ পেমেন্ট অন ডেলিভারি</p>
          </div>
        </div>
      </div>

      {/* ─── ভিডিও মডাল (কম্পোনেন্টের একদম শেষে) ─── */}
      {isVideoModalOpen && product.videoUrl && (
        <Modal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          title={`${product.name} - ভিডিও প্রিভিউ`}
          size="lg"
        >
          <VideoModalContent
            key={product.videoUrl}
            videoUrl={product.videoUrl}
            title={product.name}
          />
        </Modal>    
      )}
    </>
  );
}
