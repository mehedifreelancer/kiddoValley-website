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
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12">
      {/* ===== Background ===== */}
      <div className="fixed inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated -z-10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[800px] h-[800px] rounded-full blur-3xl"
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
            className="absolute w-[400px] h-[400px] rounded-full blur-2xl"
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
            className="absolute w-[1100px] h-[1100px] rounded-full blur-[100px]"
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
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-stone-800 dark:text-stone-200 mb-4">
            আমাদের{" "}
            <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
              গল্প
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            শিশুদের কল্পনার ডানা মেলার গল্প – Kiddo Valley-এর শুরু থেকে আজ
            পর্যন্ত।
          </p>
        </motion.div>

        {/* ===== Mission & Vision ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <AnimatedSection delay={0.1}>
            <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-8 border border-white/30 dark:border-white/10 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-[#E57373]/20 to-[#BA68C8]/20">
                  <BookOpen className="w-6 h-6 text-[#E57373] dark:text-[#BA68C8]" />
                </div>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200">
                  আমাদের লক্ষ্য
                </h2>
              </div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                প্রতিটি শিশুর হাতে একটি করে বই তুলে দেওয়া – যাতে তারা কল্পনার
                রাজ্যে হারিয়ে যেতে পারে, নতুন জ্ঞান অর্জন করতে পারে এবং জীবনকে
                সুন্দরভাবে দেখতে শেখে। আমরা বিশ্বাস করি, বই হলো সেরা বন্ধু।
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-8 border border-white/30 dark:border-white/10 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-[#36A43D]/20 to-[#1C08A9]/20">
                  <Users className="w-6 h-6 text-[#36A43D] dark:text-[#1C08A9]" />
                </div>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200">
                  আমাদের দৃষ্টি
                </h2>
              </div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                বাংলাদেশের প্রতিটি ঘরে শিশুদের বইয়ের সংস্কৃতি ছড়িয়ে দেওয়া।
                ডিজিটাল যুগেও যেন শিশুরা বইয়ের মায়া ভুলে না যায়, সেজন্য আমরা চাই
                সহজলভ্য, মানসম্মত ও রঙিন বইয়ের ভাণ্ডার তৈরি করতে।
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* ===== Our Story ===== */}
        <AnimatedSection delay={0.3}>
          <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/30 dark:border-white/10 mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  আমাদের যাত্রা
                </h2>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-base md:text-lg mb-4">
                  Kiddo Valley শুরু হয়েছিল একটি ছোট স্বপ্ন থেকে – এমন একটি জায়গা
                  তৈরি করা যেখানে শিশুরা খুঁজে পাবে তাদের প্রিয় গল্প, রঙিন চিত্র
                  আর জ্ঞানভিত্তিক বই। আমরা গর্বিত যে আজ আমরা হাজার হাজার শিশুর
                  কাছে পৌঁছাতে পেরেছি।
                </p>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-base md:text-lg">
                  আমাদের সংগ্রহে রয়েছে দেশি-বিদেশি অসংখ্য বই, যা শিশুদের মানসিক
                  বিকাশ ও সৃজনশীলতায় সহায়তা করে। আমরা চাই প্রতিটি শিশু যেন বইয়ের
                  মাধ্যমে পৃথিবীকে জানতে পারে।
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl border-4 border-white/50 dark:border-dark-border/50">
                  <Image
                    src="/images/about-hero.jpg" // Replace with actual image path
                    alt="Kiddo Valley"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ===== Statistics ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "বই", value: "৫,০০০+", icon: BookOpen },
            { label: "পাঠক", value: "১০,০০০+", icon: Users },
            { label: "পুরস্কার", value: "১২", icon: Award },
            { label: "সন্তুষ্টি", value: "৯৮%", icon: Heart },
          ].map((stat, idx) => (
            <AnimatedSection key={idx} delay={0.1 * idx}>
              <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg p-6 text-center border border-white/30 dark:border-white/10 transition-all hover:scale-105 hover:shadow-xl">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-[#BA68C8] dark:text-[#E57373]" />
                <p className="text-3xl font-bold text-stone-800 dark:text-stone-200">
                  {stat.value}
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {stat.label}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* ===== Core Values ===== */}
        <AnimatedSection delay={0.4}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-stone-800 dark:text-stone-200">
              আমাদের বিশ্বাস
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "গুণগত মান",
                desc: "শিশুদের জন্য শুধু ভালো বই নয়, সেরা বই। আমরা প্রতিটি বই যাচাই করে নিই।",
                icon: Star,
              },
              {
                title: "সাশ্রয়ী মূল্য",
                desc: "প্রত্যেকের জন্য বই সহজলভ্য করতে আমরা সাশ্রয়ী মূল্যে বই সরবরাহ করি।",
                icon: Heart,
              },
              {
                title: "বৈচিত্র্য",
                desc: "বাংলা, ইংরেজি – সব ভাষার শিশুতোষ বই আমাদের সংগ্রহে আছে।",
                icon: BookOpen,
              },
            ].map((item, idx) => (
              <AnimatedSection key={idx} delay={0.1 * idx}>
                <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg p-6 text-center border border-white/30 dark:border-white/10">
                  <item.icon className="w-10 h-10 mx-auto mb-3 text-[#E57373] dark:text-[#BA68C8]" />
                  <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
                    {item.title}
                  </h3>
                  <p className="text-stone-700 dark:text-stone-300 mt-2">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* ===== Call to Action ===== */}
        <AnimatedSection delay={0.5}>
          <div className="backdrop-blur-xl bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/30 dark:border-white/10">
            <h2 className="text-3xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
              চলো, পড়ার অভিযান শুরু করি
            </h2>
            <p className="text-stone-700 dark:text-stone-300 max-w-2xl mx-auto mb-6">
              আমাদের সংগ্রহ থেকে আপনার সন্তানের জন্য সেরা বই বেছে নিন। পড়ার
              আনন্দকে বাড়ি পর্যন্ত পৌঁছে দিন।
            </p>
            <div className="flex justify-center">
              <Link href="/products">
                <Button variant="primary" size="lg" className="px-8 py-3">
                  বই দেখুন
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
