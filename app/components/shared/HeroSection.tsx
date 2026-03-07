// components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Rocket, Heart } from "lucide-react";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroSection() {
  // 3 completely different slides with Bengali content
  const slides = [
    {
      id: 1,
      theme: "fantasy",
      badge: {
        icon: <Sparkles size={14} />,
        text: "✨ যাদুকরী অ্যাডভেঞ্চার",
      },
      title: "স্বাগতম",
      brand: "ফ্যান্টাসি ওয়ার্ল্ড",
      description:
        "পদার্পণ করুন রূপকথার জগতে, যেখানে কল্পনা আর বাস্তবতা মিলেমিশে একাকার।",
      bookTitle: "জাদুর বন",
      bookSubtitle: "যেখানে ম্যাজিক বাঁচে",
      gradient: "from-purple-600 to-pink-500",
      stats: {
        first: { value: "১৫ হাজার+", label: "পাঠক" },
        second: { value: "৩০০+", label: "বই" },
        third: { value: "৪.৯", label: "রেটিং" },
      },
      colors: {
        primary: "text-purple-600 dark:text-purple-400",
        secondary: "text-pink-500 dark:text-pink-400",
        bg: "bg-purple-100 dark:bg-purple-900/20",
      },
    },
    {
      id: 2,
      theme: "space",
      badge: {
        icon: <Rocket size={14} />,
        text: "🚀 মহাকাশ অভিযান",
      },
      title: "উড়াল দাও",
      brand: "গ্যালাক্সি কোয়েস্ট",
      description:
        "তারার মেলা পেরিয়ে, দূর গ্রহে যাত্রা করো আমাদের মহাকাশ সংগ্রহ নিয়ে।",
      bookTitle: "মঙ্গল অভিযান",
      bookSubtitle: "মহাজাগতিক অ্যাডভেঞ্চার",
      gradient: "from-blue-600 to-cyan-500",
      stats: {
        first: { value: "৮.৫ হাজার+", label: "মহাকাশচারী" },
        second: { value: "২০০+", label: "বই" },
        third: { value: "৪.৮", label: "রেটিং" },
      },
      colors: {
        primary: "text-blue-600 dark:text-blue-400",
        secondary: "text-cyan-500 dark:text-cyan-400",
        bg: "bg-blue-100 dark:bg-blue-900/20",
      },
    },
    {
      id: 3,
      theme: "kindness",
      badge: {
        icon: <Heart size={14} />,
        text: "❤️ দয়ালু গল্প",
      },
      title: "আবিষ্কার করো",
      brand: "হৃদয়ছোঁয়া গল্প",
      description: "বন্ধুত্ব আর সহমর্মিতার সুন্দর গল্প যা ছোটদের মন জয় করবে।",
      bookTitle: "বন্ধুত্বের ক্লাব",
      bookSubtitle: "বন্ধু বানানোর গল্প",
      gradient: "from-green-500 to-emerald-600",
      stats: {
        first: { value: "১২ হাজার+", label: "সাহায্যকারী" },
        second: { value: "২৫০+", label: "বই" },
        third: { value: "৫.০", label: "রেটিং" },
      },
      colors: {
        primary: "text-green-600 dark:text-green-400",
        secondary: "text-emerald-500 dark:text-emerald-400",
        bg: "bg-green-100 dark:bg-green-900/20",
      },
    },
  ];

  return (
    <section className="pb-15 relative w-full overflow-hidden bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated">
      {/* Background decorative elements - full width */}
      <div className="absolute inset-0 w-full pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-logo-red/5 dark:bg-logo-red/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-logo-blue/5 dark:bg-logo-blue/10 blur-3xl"></div>
      </div>

      {/* Main Swiper Slider - full width */}
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        className="w-full h-[50vh] min-h-[400px] max-h-[600px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Content container - this keeps content centered and constrained */}
              <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full py-6 md:py-8">
                  {/* Left Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                  >
                    {/* Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${slide.colors.bg} border ${slide.colors.primary} mb-3 md:mb-4`}
                    >
                      <span className={slide.colors.primary}>
                        {slide.badge.icon}
                      </span>
                      <span
                        className={`text-xs font-medium ${slide.colors.primary}`}
                      >
                        {slide.badge.text}
                      </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 md:mb-3">
                      <span className="block text-stone-800 dark:text-stone-200">
                        {slide.title}
                      </span>
                      <span
                        className={`block font-semibold mt-1 bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}
                      >
                        {slide.brand}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 mb-4 md:mb-6 max-w-lg leading-relaxed">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
                      <Link
                        href="/books"
                        className={`group px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r ${slide.gradient} text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5`}
                      >
                        দেখুন
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </Link>

                      <Link
                        href={`/category/${slide.theme}`}
                        className={`px-5 py-2.5 md:px-6 md:py-3 bg-transparent border ${slide.colors.primary} ${slide.colors.primary} rounded-lg font-medium text-sm hover:bg-stone-100 dark:hover:bg-dark-elevated transition-all duration-300`}
                      >
                        আরও জানুন
                      </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 md:gap-6">
                      <div>
                        <div
                          className={`text-lg md:text-xl font-semibold ${slide.colors.primary}`}
                        >
                          {slide.stats.first.value}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-500">
                          {slide.stats.first.label}
                        </div>
                      </div>
                      <div className="w-px h-6 bg-stone-300 dark:bg-stone-700"></div>
                      <div>
                        <div
                          className={`text-lg md:text-xl font-semibold ${slide.colors.secondary}`}
                        >
                          {slide.stats.second.value}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-500">
                          {slide.stats.second.label}
                        </div>
                      </div>
                      <div className="w-px h-6 bg-stone-300 dark:bg-stone-700"></div>
                      <div>
                        <div
                          className={`text-lg md:text-xl font-semibold flex items-center gap-1 ${slide.colors.primary}`}
                        >
                          {slide.stats.third.value}
                          <Star
                            size={12}
                            className="fill-yellow-500 text-yellow-500"
                          />
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-500">
                          {slide.stats.third.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Content - Book Images */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10"
                  >
                    <div className="relative aspect-square max-w-sm mx-auto">
                      {/* Main book */}
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 z-20"
                      >
                        <div className="relative w-full h-full transform rotate-3 hover:rotate-0 transition-transform duration-500">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} rounded-xl shadow-xl overflow-hidden`}
                          >
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                              <div className="text-sm md:text-base font-bold mb-0.5">
                                {slide.bookTitle}
                              </div>
                              <div className="text-xs opacity-80">
                                {slide.bookSubtitle}
                              </div>
                            </div>
                          </div>
                          <div className="absolute -right-1.5 top-1.5 bottom-1.5 w-1.5 bg-stone-200 dark:bg-stone-700 rounded-r-md shadow-md"></div>
                        </div>
                      </motion.div>

                      {/* Small book 1 */}
                      <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                        className="absolute top-0 right-0 w-16 h-20 md:w-20 md:h-24 z-10"
                      >
                        <div className="relative w-full h-full transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-80 rounded-lg shadow-md overflow-hidden`}
                          >
                            <div className="absolute inset-0 bg-black/10"></div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Small book 2 */}
                      <motion.div
                        animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-5 left-0 w-14 h-16 md:w-16 md:h-20 z-10"
                      >
                        <div className="relative w-full h-full transform rotate-12 hover:rotate-0 transition-transform duration-500">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-60 rounded-lg shadow-md overflow-hidden`}
                          >
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
