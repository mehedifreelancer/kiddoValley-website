"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Users,
  Award,
  Heart,
  ChevronRight,
  Star,
  User,
  MessageCircle,
} from "lucide-react";
import Button from "../components/shared/Button";

// ===== Animated Section Wrapper =====
const AnimatedSection = ({ children, delay = 0 }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// ===== Main Component =====
export default function AboutPage() {
  // রিয়েল ফেসবুক কমেন্টগুলো
  const testimonials = [
    {
      name: "Sneho UH",
      comment:
        "Alhamdulillah got the books with fast delivery and we loved it! ✨",
    },
    {
      name: "অভিভাবক",
      comment:
        "আজকে বুমবুম আর মহাশূন্য বইদুটো হাতে পেলাম। বইগুলো খুবই ভালো লেগেছে আলহামদুলিল্লাহ। আমার ছেলে খুবই পছন্দ করেছে বইগুলো। অনেক ধন্যবাদ kiddoValley কে",
    },
    {
      name: "অভিভাবক",
      comment:
        "আমার ছেলে অনেক খুশি।বইটা দেখে তার খুব ভালো লেগেছে। ধন্যবাদ এমন বইয়ের জন্য",
    },
    {
      name: "অভিভাবক",
      comment:
        "এটা নিয়েছি,খুব সুন্দর, আরও ইউনিক কালেকশন আনার অনুরোধ,সামনে আরও নিবো ইনশাআল্লাহ",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden px-3 sm:px-4 py-6 sm:py-12">
      {/* ===== Background (অপরিবর্তিত) ===== */}
      <div className="fixed inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated -z-10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle at center, 
                #D51B26 0%,
                #8859F8 20%,
                #1C08A9 40%,
                #36A43D 60%,
                #8859F8 70%,
                transparent 85%
              )`,
              opacity: 0.2,
            }}
          />
          <div
            className="absolute w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full blur-2xl"
            style={{
              background: `radial-gradient(circle at center, 
                #D51B26 0%,
                #8859F8 30%,
                #1C08A9 50%,
                transparent 80%
              )`,
              opacity: 0.15,
            }}
          />
          <div
            className="absolute w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] md:w-[1100px] md:h-[1100px] rounded-full blur-[100px]"
            style={{
              background: `radial-gradient(circle at center, 
                #36A43D 0%,
                #1C08A9 20%,
                #8859F8 40%,
                #D51B26 60%,
                transparent 80%
              )`,
              opacity: 0.1,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-50/30 to-cream-200/30 dark:via-dark-bg/30 dark:to-dark-surface/30 pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ===== Hero Section ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-stone-800 dark:text-stone-200 mb-3 sm:mb-4 leading-tight">
            আমাদের{" "}
            <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
              গল্প
            </span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto px-2">
            শিশুদের ডিজিটাল আসক্তি থেকে মুক্ত করে তাদের সক্রিয় ও স্বপ্নময়
            ভবিষ্যৎ গড়ে তোলা—এই আমাদের অঙ্গীকার।
          </p>
        </motion.div>

        {/* ===== Mission & Vision (কনটেন্ট আপডেট) ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
          <AnimatedSection delay={0.1}>
            <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-white/30 dark:border-white/10 h-full">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-[#E57373]/20 to-[#BA68C8]/20 shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#E57373] dark:text-[#BA68C8]" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-stone-800 dark:text-stone-200">
                  আমাদের লক্ষ্য
                </h2>
              </div>
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                প্রতিটি শিশুকে ডিভাইসের বাইরে এনে তাদের শারীরিক ও মানসিক বিকাশে
                সহায়তা করা। আমরা চাই শিশুরা বই পড়ুক, খেলাধুলা করুক, আর কল্পনার
                মাধ্যমে নতুন কিছু আবিষ্কার করুক—যাতে তারা গড়ে তোলে একটি সক্রিয়
                ও উজ্জ্বল ভবিষ্যৎ।
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-white/30 dark:border-white/10 h-full">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-[#36A43D]/20 to-[#1C08A9]/20 shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#36A43D] dark:text-[#1C08A9]" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-stone-800 dark:text-stone-200">
                  আমাদের দৃষ্টি
                </h2>
              </div>
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                বাংলাদেশের শিশুরা যেন স্ক্রিনের বাইরে প্রকৃত জীবনকে উপভোগ করতে
                শেখে—দৌড়ায়, খেলে, পড়ে, গল্প করে। Kiddo Valley চায় শিশুদের
                হাতে তুলে দিতে এমন সব উপকরণ যা তাদের স্থির না রেখে সক্রিয় রাখে,
                আনন্দ দেয়, আর স্বপ্ন দেখাতে শেখায়।
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* ===== Our Story (কনটেন্ট আপডেট) ===== */}
        <AnimatedSection delay={0.3}>
          <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12 border border-white/30 dark:border-white/10 mb-8 sm:mb-12 md:mb-16">
            <div className="flex flex-col md:flex-row gap-5 sm:gap-6 md:gap-8 items-center">
              <div className="flex-1 order-2 md:order-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200 mb-3 sm:mb-4 text-center md:text-left">
                  আমাদের যাত্রা
                </h2>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                  Kiddo Valley শুরু হয়েছিল একটি ছোট স্বপ্ন থেকে—শিশুদের মোবাইল,
                  ট্যাব আর গ্যাজেটের বাইরে টেনে এনে বই, খেলা, আর কল্পনার এক
                  বিস্ময়কর জগতে নিয়ে যাওয়া। আমরা গর্বিত যে আজ আমরা হাজার
                  হাজার পরিবারের কাছে পৌঁছাতে পেরেছি, যারা তাদের সন্তানদের জন্য
                  সক্রিয় ও অর্থবহ সময় খুঁজে পান আমাদের মাধ্যমে।
                </p>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base md:text-lg">
                  আমাদের সংগ্রহে রয়েছে বই, গেমস, ক্রিয়েটিভ কার্যক্রম—যা
                  শিশুদের মনন ও সৃজনশীলতায় ভিন্নতা আনে। আমরা চাই প্রতিটি শিশু
                  যেন ডিজিটাল জগতের বাইরে প্রকৃত আনন্দ খুঁজে পায়।
                </p>
              </div>
              <div className="flex-1 flex justify-center order-1 md:order-2">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl border-4 border-white/50 dark:border-dark-border/50">
                  <Image
                    src="/images/about-hero.jpg"
                    alt="Kiddo Valley"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ===== TESTIMONIALS SECTION (স্ট্যাটিস্টিক্সের বদলে) ===== */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <AnimatedSection delay={0.25}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-stone-800 dark:text-stone-200 mb-1.5 sm:mb-2 px-2">
              অভিভাবকরা যা বলছেন
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-center text-stone-500 dark:text-stone-400 mb-5 sm:mb-8 px-4">
              আমাদের যাত্রার সবচেয়ে বড় প্রেরণা তাদের ভালোবাসা
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6">
            {testimonials.map((item, idx) => (
              <AnimatedSection key={idx} delay={0.1 * idx}>
                <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/30 dark:border-white/10 h-full flex flex-col transition-all hover:scale-[1.02] hover:shadow-xl">
                  <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                    <div className="p-1.5 sm:p-2 rounded-full bg-[#BA68C8]/10 dark:bg-[#E57373]/10 shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#BA68C8] dark:text-[#E57373]" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200">
                        {item.name}
                      </p>
                      <div className="flex text-yellow-400 text-xs sm:text-sm">
                        {"★".repeat(5)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed italic">
                      “{item.comment}”
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/20 dark:border-white/10 flex justify-end">
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 dark:text-stone-500" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* ===== Core Values (কনটেন্ট আপডেট) ===== */}
        <AnimatedSection delay={0.4}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200 px-2">
              আমাদের মূল বিশ্বাস
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 md:gap-6 mb-8 sm:mb-12 md:mb-16">
            {[
              {
                title: "সক্রিয় জীবনযাত্রা",
                desc: "শিশুদের শারীরিক ও মানসিক বিকাশকে প্রাধান্য দেওয়া, তাদের স্থির না রেখে সদা উদ্যমী রাখা।",
                icon: Heart,
              },
              {
                title: "নিরাপদ ও মানসম্মত",
                desc: "শিশুদের জন্য নিরাপদ, মানসম্মত ও আনন্দদায়ক সব কিছু নিশ্চিত করা—বই হোক বা খেলার সামগ্রী।",
                icon: Star,
              },
              {
                title: "বৈচিত্র্য ও উদ্ভাবন",
                desc: "শিশুদের আগ্রহ ধরে রাখতে নতুন নতুন অনন্য কালেকশন আনা।",
                icon: BookOpen,
              },
            ].map((item, idx) => (
              <AnimatedSection key={idx} delay={0.1 * idx}>
                <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-white/30 dark:border-white/10">
                  <item.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2.5 sm:mb-3 text-[#E57373] dark:text-[#BA68C8]" />
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 mt-1.5 sm:mt-2">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* ===== Call to Action (অপরিবর্তিত) ===== */}
        <AnimatedSection delay={0.5}>
          <div className="backdrop-blur-xl bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12 text-center border border-white/30 dark:border-white/10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200 mb-3 sm:mb-4 px-2">
              চলো, ডিভাইসের বাইরে নতুন কিছু আবিষ্কার করি
            </h2>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 max-w-2xl mx-auto mb-5 sm:mb-6 px-2">
              আপনার সন্তানের জন্য সেরা বই, খেলার সামগ্রী ও ক্রিয়েটিভ উপকরণ বেছে
              নিন। সক্রিয় ও আনন্দময় শৈশব গড়তে আজই শুরু করুন।
            </p>
            <div className="flex justify-center">
              <Link href="/products">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  সংগ্রহ দেখুন
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
