"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Play,
  BookOpen,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
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
  showIngInModal: boolean;
  onVideoOpen?: () => void;
  onVideoClose?: () => void;
}

export default function ProductDetails({
  product,
  showIngInModal,
  onVideoOpen,
  onVideoClose,
}: ProductDetailsProps) {
  const { addToCart, openCart } = useGlobal();

  const [quantity, setQuantity] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [thumbSwiper, setThumbSwiper] = useState<any>(null);
  const mainSwiperRef = useRef<any>(null);

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

  const primaryAttributes = product?.attributeOrderByPriority || [];

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

  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const defaultFilters: Record<string, string> = {};
    primaryAttributes.forEach((attr) => {
      if (attr.values.length > 0) {
        defaultFilters[attr.key] = attr.values[0];
      }
    });
    return defaultFilters;
  });

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

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
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
        if (idx !== -1 && mainSwiperRef.current) {
          mainSwiperRef.current.slideTo(idx);
        }
      }
    },
    [filters, product, allImages],
  );

  const handleAddToCart = useCallback(() => {
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
  }, [currentVariant, product, displayPrice, addToCart, openCart]);

  const handleIncrement = useCallback(() => setQuantity((q) => q + 1), []);
  const handleDecrement = useCallback(
    () => setQuantity((q) => Math.max(1, q - 1)),
    [],
  );

  const handleVideoOpen = useCallback(() => {
    setIsVideoModalOpen(true);
    if (onVideoOpen) onVideoOpen();
  }, [onVideoOpen]);

  const handleVideoClose = useCallback(() => {
    setIsVideoModalOpen(false);
    if (onVideoClose) onVideoClose();
  }, [onVideoClose]);

  // যখন thumbSwiper সেট হয়, মেইন সোয়াইপারের thumbs আপডেট করো
  useEffect(() => {
    if (thumbSwiper && mainSwiperRef.current) {
      // মেইন সোয়াইপারের thumbs প্রপটি আপডেট করো
      mainSwiperRef.current.thumbs.swiper = thumbSwiper;
      mainSwiperRef.current.thumbs.init();
      mainSwiperRef.current.update();
    }
  }, [thumbSwiper]);

  // মডাল খোলা থাকলে thumbSwiper প্রস্তুত না হলে অপেক্ষা করো (ঐচ্ছিক)
  useEffect(() => {
    if (showIngInModal && !thumbSwiper) {
      // কিছু করো না, থাম্ব সেট হলে উপরের useEffect কাজ করবে
    }
  }, [showIngInModal, thumbSwiper]);

  const visibleAttributes = primaryAttributes.filter(
    (attr) => attr.values.length > 0,
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
        <div className="w-full">
          <div className="relative aspect-[7/5] md:aspect-[5/5] lg:aspect-[5/5] w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10">
            {/* মেইন সোয়াইপার – সবসময় রেন্ডার, থাম্বস রেফ দিয়ে আপডেট হবে */}
            <Swiper
              onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
              spaceBetween={10}
              navigation={{
                prevEl: ".custom-swiper-button-prev",
                nextEl: ".custom-swiper-button-next",
              }}
              thumbs={{ swiper: thumbSwiper }} // এখানে thumbSwiper স্টেট পাস
              modules={[FreeMode, Navigation, Thumbs]}
              className="h-full w-full"
              autoplay={false}
              observer={true}
              observeParents={true}
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

            {/* নেভিগেশন বাটন */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <button className="custom-swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-stone-800 dark:text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105">
                <ChevronLeft size={18} />
              </button>
              <button className="custom-swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-stone-800 dark:text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* ব্যাজ */}
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

          {/* থাম্বনেইল সোয়াইপার */}
          {allImages.length > 1 && (
            <div className="mt-1 md:mt-2">
              <Swiper
                onSwiper={(swiper) => setThumbSwiper(swiper)}
                spaceBetween={1}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper"
              >
                {allImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative aspect-[3/2] w-full rounded-lg overflow-hidden border-2 border-transparent hover:border-rose-500 transition-colors cursor-pointer">
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* ─── ডান পাশ ─── */}
        <div className="space-y-3">
          <div>
            {!showIngInModal && (
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">
                {product.name}
              </h1>
            )}

            {product.variants && product.variants.length > 1 && (
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                মোট {product.variants.length}টি ভেরিয়েন্ট
              </p>
            )}
          </div>

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

          <div className="flex items-baseline justify-between  gap-2">
            <div>
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
          </div>
          <div className="flex flex-row sm:flex-row gap-3 pt-4">
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
                onClick={handleVideoOpen}
                className="flex-1"
              >
                ভিডিও দেখুন
              </Button>
            )}
          </div>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
              আমরা বাংলায় ওয়েব ডেডলপমেন্ট নিয়ে কাজ করতে গিয়ে প্রথম যে সমস্যাটার
              মুখোমুখি হই, সেটা হলো, বাংলা ডেমো টেক্সট। ইংরেজির জন্য lorem ipsum
              তো আছে । বাংলার জন্য কি আছে? সেই ধারনা থেকেই বাংলা ডেমো টেক্সট
              তৈরীর চেষ্টা। HTML এর প্রয়োজনীয় প্রায় সব ফরম্যাটেই বাংলা ডেমো
              টেক্সট তুলে ধরা হয়েছে। আশা করছি, এরি ক্ষুদ্র প্রচেষ্টা আপনাদের
              কাজে আসবে।
            </p>
          </div>
        </div>
      </div>

      {isVideoModalOpen && product.videoUrl && (
        <Modal
          isOpen={isVideoModalOpen}
          onClose={handleVideoClose}
          title={`${product.name} - ভিডিও প্রিভিউ`}
          size="full"
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
