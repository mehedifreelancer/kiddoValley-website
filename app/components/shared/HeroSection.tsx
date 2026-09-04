// components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const getBadgeIcon = () => <Sparkles size={14} />;

interface HeroSectionProps {
  slides: HeroSlider[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated">
      {/* Decorative blobs */}
      <div className="absolute inset-0 w-full pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-logo-red/5 dark:bg-logo-red/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-logo-blue/5 dark:bg-logo-blue/10 blur-3xl"></div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={true}
        // 🆕 মোবাইলে height auto, বড় স্ক্রিনে আগের মতোই
        className="w-full h-auto min-h-[520px] sm:min-h-[450px] md:h-[50vh] md:max-h-[600px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background image */}
              {/* Background image/color */}
              <div className="absolute inset-0 w-full h-full">
                {slide.bgType === "color" && slide.bgColor ? (
                  <div
                    className="w-full h-full"
                    style={{ background: slide.bgColor }}
                  />
                ) : (
                  <img
                    src={slide.bgImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Content container */}
              <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-8 md:py-8">
                  {/* Left content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                  >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 mb-3 md:mb-4">
                      <span className="text-purple-600 dark:text-purple-400">
                        {getBadgeIcon()}
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {slide.badgeText}
                      </span>
                    </div>

                    {/* Titles */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 md:mb-3">
                      <span
                        className={`block ${slide.firstTitleColor || "text-stone-800 dark:text-stone-200"}`}
                      >
                        {slide.firstTitle}
                      </span>
                      <span
                        className={`block font-semibold mt-2 ${slide.secondTitleColor || "text-purple-600"}`}
                      >
                        {slide.secondTitle}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm md:text-base text-white mb-4 md:mb-6 max-w-lg leading-relaxed">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3 mb-2 md:mb-6 lg:mb-8">
                      <Link
                        href="/products"
                        className="group px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5"
                      >
                        দেখুন
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                      {slide.sliderDetailsUrl && (
                        <Link
                          href={slide.sliderDetailsUrl}
                          className="px-5 py-2.5 md:px-6 md:py-3 bg-transparent border text-purple-600 border-purple-600 rounded-lg font-medium text-sm hover:bg-stone-100 dark:hover:bg-dark-elevated transition-all duration-300"
                        >
                          আরও জানুন
                        </Link>
                      )}
                    </div>
                  </motion.div>

                  {/* Right – Book images */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    // 🆕 ছোট বই দুইটার জন্য বাড়তি জায়গা রাখতে padding + overflow visible
                    className="relative z-10 px-6 md:px-10"
                  >
                    <div className="relative aspect-square max-w-sm mx-auto">
                      {/* Main book */}
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 z-20 transform scale-110"
                      >
                        <div className="relative w-full h-full transform rotate-3 hover:rotate-0 transition-transform duration-500">
                          {/* 🆕 object-cover এর বদলে object-contain — কোনো অংশ কাটবে না */}
                          <div className="absolute inset-0 rounded-xl shadow-sm overflow-hidden bg-white/40 dark:bg-black/20">
                            <img
                              src={slide.innerBigImage}
                              alt="Book cover"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
                              <div className="text-sm md:text-base font-bold mb-0.5 ">
                                {slide.bookTitle}
                              </div>
                              <div className="text-xs opacity-80">
                                {slide.bookSubtitle}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Small top book */}
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          x: [0, 20, 0],
                          rotate: [0, 15, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        // 🆕 মোবাইলে right-0 (বাইরে যাবে না), বড় স্ক্রিনে আগের মতো right-[-20px]
                        className="absolute top-[-15px] right-0 md:right-[-20px] w-14 h-18 sm:w-16 sm:h-20 md:w-20 md:h-24 z-10"
                      >
                        <div className="relative w-full h-full transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                          <div className="absolute inset-0  opacity-80 rounded-lg shadow-md overflow-hidden">
                            <img
                              src={slide.innerTopImage}
                              alt="Book"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Small bottom book */}
                      <motion.div
                        animate={{
                          y: [0, 10, 0],
                          x: [0, 10, 0],
                          rotate: [0, 15, 0],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          delay: 1,
                        }}
                        // 🆕 মোবাইলে left-0 (বাইরে যাবে না), বড় স্ক্রিনে আগের মতো left-[-20px]
                        className="absolute bottom-[-10px] left-[-15px] md:left-[-20px] w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-20 z-10"
                      >
                        <div className="relative w-full h-full transform rotate-12 hover:rotate-0 transition-transform duration-500">
                          <div className="absolute inset-0  opacity-60 rounded-lg shadow-md overflow-hidden">
                            <img
                              src={slide.innerBottomImage}
                              alt="Book"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
