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
  Minus,
  Plus,
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

  // ===== ইউটিউব থাম্বনেইল ফাংশন =====
  const getYouTubeThumbnail = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
    return null;
  };

  const videoThumbnail = product.videoUrl
    ? getYouTubeThumbnail(product.videoUrl)
    : null;

  // ===== সব ইমেজ =====
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

  // ===== মেইন স্লাইডার আইটেম =====
  const mainSlides = useMemo(() => {
    const slides: Array<
      | { type: "image"; url: string }
      | { type: "video"; url: string; thumbnail: string }
    > = [];
    allImages.forEach((img) => {
      slides.push({ type: "image", url: img });
    });
    if (product.videoUrl && videoThumbnail) {
      slides.push({
        type: "video",
        url: product.videoUrl,
        thumbnail: videoThumbnail,
      });
    }
    return slides;
  }, [allImages, product.videoUrl, videoThumbnail]);

  // ===== থাম্বনেইল =====
  const thumbSlides = useMemo(() => {
    const slides: Array<
      | { type: "image"; url: string }
      | { type: "video"; url: string; thumbnail: string }
    > = [];
    allImages.forEach((img) => {
      slides.push({ type: "image", url: img });
    });
    if (product.videoUrl && videoThumbnail) {
      slides.push({
        type: "video",
        url: product.videoUrl,
        thumbnail: videoThumbnail,
      });
    }
    return slides;
  }, [allImages, product.videoUrl, videoThumbnail]);

  // ===== অ্যাট্রিবিউট =====
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

  // ===== প্রাইমারি কী ও ভেরিয়েন্ট লেবেল (কার্টের জন্য) =====
  const primaryKey = product.attributeOrderByPriority?.[0]?.key || null;
  const variantLabel = useMemo(() => {
    if (!currentVariant || !primaryKey) return "";
    const value = currentVariant.attributes?.[primaryKey];
    return value ? String(value) : "";
  }, [currentVariant, primaryKey]);

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
        const idx = mainSlides.findIndex(
          (slide) =>
            slide.type === "image" &&
            slide.url === (matched.imgUrl || product.thumbnailImage || ""),
        );
        if (idx !== -1 && mainSwiperRef.current) {
          mainSwiperRef.current.slideTo(idx);
        }
      }
    },
    [filters, product, mainSlides],
  );

  // ===== কার্টে যোগ – ভেরিয়েন্ট লেবেল সহ =====
  const handleAddToCart = useCallback(() => {
    if (!currentVariant) return;
    const uniqueId = `${product.id}-${currentVariant.sku}`;
    const displayName = variantLabel
      ? `${product.name} (${variantLabel})`
      : product.name;

    addToCart({
      id: uniqueId,
      name: displayName,
      price: displayPrice,
      imageUrl:
        currentVariant.imgUrl || product.thumbnailImage || "/placeholder.jpg",
      sku: currentVariant.sku,
      variant: currentVariant,
      quantity: quantity, // ← পরিমাণ ব্যবহার করছি
    });
    openCart();
  }, [
    currentVariant,
    product,
    displayPrice,
    addToCart,
    openCart,
    variantLabel,
    quantity,
  ]);

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

  useEffect(() => {
    if (thumbSwiper && mainSwiperRef.current) {
      mainSwiperRef.current.thumbs.swiper = thumbSwiper;
      mainSwiperRef.current.thumbs.init();
      mainSwiperRef.current.update();
    }
  }, [thumbSwiper]);

  const visibleAttributes = primaryAttributes.filter(
    (attr) => attr.values.length > 0,
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-8 lg:gap-12">
        {/* বাম – ইমেজ স্লাইডার */}
        <div className="w-full">
          <div className="relative aspect-[7/5] md:aspect-[5/5] lg:aspect-[5/5] w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10">
            <Swiper
              onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
              spaceBetween={10}
              navigation={{
                prevEl: ".custom-swiper-button-prev",
                nextEl: ".custom-swiper-button-next",
              }}
              thumbs={{ swiper: thumbSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="h-full w-full"
              autoplay={false}
              observer={true}
              observeParents={true}
            >
              {mainSlides.map((slide, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative w-full h-full">
                    {slide.type === "image" ? (
                      <Image
                        src={slide.url}
                        alt={`${product.name} - ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                    ) : (
                      <>
                        <Image
                          src={slide.thumbnail}
                          alt={`Video - ${product.name}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          unoptimized
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVideoOpen();
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-black dark:text-white transition-all group-hover:scale-110">
                            <Play size={14} className="fill-current ml-1" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* নেভিগেশন বাটন */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <button className="custom-swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-stone-800 dark:text-white w-8 h-8 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105">
                <ChevronLeft size={15} />
              </button>
              <button className="custom-swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-stone-800 dark:text-white w-8 h-8 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105">
                <ChevronRight size={15} />
              </button>
            </div>

            {/* ব্যাজ */}
            {displayDiscount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-sm font-bold rounded-lg shadow-md z-10">
                -{displayDiscount}%
              </span>
            )}
            <span
              className={`absolute top-4 right-4 px-2 lg:px-3 py-0.5 lg:py-1  rounded-md lg:rounded-lg text-sm font-medium shadow-sm backdrop-blur-sm z-10 ${stockStatusColor}`}
            >
              {stockLabel}
            </span>
            <span className="absolute bottom-1 left-1 px-3   lg:px-3 py-1 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-full text-xs lg:text-sm font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-dark-border z-10">
              {product.category?.name || "ক্যাটাগরি"}
            </span>
          </div>

          {/* থাম্বনেইল */}
          {thumbSlides.length > 1 && (
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
                {thumbSlides.map((slide, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative aspect-[3/2] w-full rounded-lg overflow-hidden border-2 border-transparent hover:border-rose-500 transition-colors cursor-pointer">
                      {slide.type === "image" ? (
                        <Image
                          src={slide.url}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <>
                          <Image
                            src={slide.thumbnail}
                            alt={`Video Thumbnail`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVideoOpen();
                            }}
                          >
                            <div className="w-6 h-6 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-black dark:text-white">
                              <Play size={10} className="fill-current ml-0.5" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* ডান – প্রোডাক্ট তথ্য */}
        <div className="space-y-3">
          <div>
            {!showIngInModal && (
              <h1 className="mt-3 text-2xl lg:text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">
                {product.name}
              </h1>
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
                          className={`px-2 lg:px-3 lg:py-1 text-xs lg:text-sm rounded-full border transition-all ${
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

          <div className="flex flex-col justify-between gap-1">
            <div>
              <span className="text-2xl md:text-3xl font-bold text-[#E57373]">
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
            {/* পরিমাণ সিলেক্টর – এখন চালু */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                পরিমাণ:
              </span>
              <div className=" flex items-center border border-stone-200 dark:border-dark-border rounded-lg overflow-hidden">
                <button
                  onClick={handleDecrement}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors w-fu"
                  aria-label="Decrease quantity"
                >
                  <Minus
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
                  aria-label="Increase quantity"
                >
                  <Plus
                    size={18}
                    className="text-stone-600 dark:text-stone-400"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
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
                size="sm"
                icon={<Play size={18} />}
                onClick={handleVideoOpen}
                className="flex-1"
              >
                ভিডিও দেখুন
              </Button>
            )}
          </div>

          <div className="prose prose-stone dark:prose-invert max-w-none mt-5">
            <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
              {product.description || `${product.name} – একটি চমৎকার বই।`}
            </p>
          </div>
        </div>
      </div>

      {/* ===== ভিডিও মডাল – শুধু ডিটেইল পেজে (showIngInModal false) ===== */}
      {!showIngInModal && isVideoModalOpen && product.videoUrl && (
        <Modal
          isOpen={isVideoModalOpen}
          onClose={handleVideoClose}
          title={`${product.name} - ভিডিও প্রিভিউ`}
          size="4xl"
          disableScrollLock={true}
        >
          <VideoModalContent
            videoUrl={product.videoUrl}
            title={product.name}
            isOpen={isVideoModalOpen}
          />
        </Modal>
      )}
    </>
  );
}
