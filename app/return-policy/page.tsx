"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Undo,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Shield,
  Percent,
  Truck,
  FileText,
} from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-3 sm:px-4 py-6 sm:py-12">
      {/* ===== Background ===== */}
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-10 md:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light text-stone-800 dark:text-stone-200 mb-2.5 sm:mb-4 leading-tight">
            <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
              রিফান্ড ও আংশিক রিফান্ড
            </span>{" "}
            নীতি
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto px-2">
            আপনার সন্তুষ্টি আমাদের প্রথম অগ্রাধিকার। পণ্য ফেরত, আংশিক ফেরত ও
            ক্ষতিপূরণের সহজ ও স্বচ্ছ নীতি।
          </p>
        </motion.div>

        {/* ===== Content ===== */}
        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 border border-white/30 dark:border-white/10 space-y-5 sm:space-y-6 md:space-y-8">
          {/* Section 1: Return Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Heading row: icon + title only */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
              <div className="p-2 sm:p-3 rounded-full bg-[#E57373]/20 flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#E57373]" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200">
                ফেরতের সময়সীমা ও শর্ত
              </h2>
            </div>
            {/* Full-width content, no icon indent */}
            <ul className="text-sm sm:text-base text-stone-600 dark:text-stone-400 list-disc list-inside space-y-0.5 sm:space-y-1">
              <li>
                পণ্য হাতে পাওয়ার <strong>৭ দিনের</strong> মধ্যে ফেরতের আবেদন
                করতে হবে
              </li>
              <li>
                পণ্যের প্যাকেট <strong>অক্ষত</strong> থাকতে হবে (খোলা না থাকলে)
              </li>
              <li>
                যেসব বই ব্যবহার করা হয়েছে বা কভার/পৃষ্ঠা ছেঁড়া, সেগুলো ফেরত
                নেওয়া হয় না
              </li>
              <li>ফেরতের জন্য পণ্যের ছবি ও বর্ণনা দিয়ে আবেদন করতে হবে</li>
            </ul>
          </motion.div>

          {/* Section 2: Defect-wise Partial Refund (Main Feature) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Heading row: icon + title only */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
              <div className="p-2 sm:p-3 rounded-full bg-[#BA68C8]/20 flex-shrink-0">
                <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-[#BA68C8]" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200">
                ত্রুটি অনুযায়ী আংশিক ফেরত
              </h2>
            </div>

            {/* Full-width content, no icon indent */}
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-3 sm:mb-4">
              পণ্যে যদি ছোটখাটো ত্রুটি থাকে, তবে সম্পূর্ণ ফেরত না দিয়ে{" "}
              <strong>আংশিক ফেরত</strong> দেওয়া হয় – যাতে কুরিয়ার ঝামেলা
              ছাড়াই দ্রুত সমাধান পাওয়া যায়।
            </p>

            {/* ===== Responsive Table → Card list ===== */}
            {(() => {
              const rows = [
                {
                  type: "ছোট দাগ বা প্রিন্ট ত্রুটি",
                  percent: "১০-২৫%",
                  color: "#E57373",
                  desc: "কয়েকটি পৃষ্ঠায় কালি কম/বেশি, ছোট দাগ",
                },
                {
                  type: "কভার বা বাইন্ডিং ছোটখাটো সমস্যা",
                  percent: "২০-৩৫%",
                  color: "#BA68C8",
                  desc: "কভারে সামান্য ভাঁজ, বাইন্ডিং ঢিলা",
                },
                {
                  type: "মাঝারি ক্ষতি (ছেঁড়া/জল পড়া)",
                  percent: "৩৫-৫০%",
                  color: "#36A43D",
                  desc: "পৃষ্ঠা ছেঁড়া, পানি/তেলের দাগ (যদি পড়া যায়)",
                },
                {
                  type: "গুরুতর ক্ষতি (পড়া যায় না)",
                  percent: "৫০-১০০%",
                  color: "#1C08A9",
                  desc: "পৃষ্ঠা নেই, পুরো ছিড়ে গেছে",
                },
              ];

              return (
                <>
                  {/* ---- Desktop / Tablet: normal table (sm and up) ---- */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-white/10 dark:bg-black/10">
                          <th className="text-left p-2 border border-white/20 dark:border-dark-border/30 text-stone-700 dark:text-stone-300 font-semibold">
                            ত্রুটির ধরন
                          </th>
                          <th className="text-center p-2 border border-white/20 dark:border-dark-border/30 text-stone-700 dark:text-stone-300 font-semibold">
                            ফেরত শতাংশ
                          </th>
                          <th className="text-left p-2 border border-white/20 dark:border-dark-border/30 text-stone-700 dark:text-stone-300 font-semibold">
                            বিবরণ
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-stone-600 dark:text-stone-400">
                        {rows.map((row, i) => (
                          <tr key={i}>
                            <td className="p-2 border border-white/20 dark:border-dark-border/30">
                              {row.type}
                            </td>
                            <td
                              className="text-center p-2 border border-white/20 dark:border-dark-border/30 font-semibold"
                              style={{ color: row.color }}
                            >
                              {row.percent}
                            </td>
                            <td className="p-2 border border-white/20 dark:border-dark-border/30">
                              {row.desc}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* ---- Mobile: card / stacked list (below sm) ---- */}
                  <div className="sm:hidden space-y-2.5">
                    {rows.map((row, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-white/25 dark:bg-black/20 border border-white/30 dark:border-white/10 p-3"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                            {row.type}
                          </span>
                          <span
                            className="text-sm font-bold shrink-0 px-2 py-0.5 rounded-full bg-white/40 dark:bg-black/30"
                            style={{ color: row.color }}
                          >
                            {row.percent}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-stone-600 dark:text-stone-400 pt-1.5 border-t border-white/20 dark:border-white/10">
                          <span className="font-medium text-stone-500 dark:text-stone-500 shrink-0">
                            বিবরণ:
                          </span>
                          <span>{row.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

            <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-2">
              ⚠️ শতাংশ পণ্যের অবস্থা ও আমাদের পর্যালোচনার ভিত্তিতে নির্ধারিত
              হয়।
            </p>
          </motion.div>

          {/* Section 3: Refund Process */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
              <div className="p-2 sm:p-3 rounded-full bg-[#36A43D]/20 flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#36A43D]" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200">
                আংশিক ফেরত প্রক্রিয়া (সরাসরি)
              </h2>
            </div>
            <ol className="text-sm sm:text-base text-stone-600 dark:text-stone-400 list-decimal list-inside space-y-0.5 sm:space-y-1">
              <li>আমাদের কাস্টমার কেয়ারে পণ্যের ছবি ও বিবরণ পাঠান</li>
              <li>আমরা ত্রুটি পর্যালোচনা করে ফেরত শতাংশ নির্ধারণ করি</li>
              <li>
                সম্মতি পেলে <strong>সরাসরি আপনার অ্যাকাউন্টে</strong> (যেমন
                বিকাশ/নগদ) টাকা ফেরত দেওয়া হয়
              </li>
              <li>
                পণ্যটি ফেরত পাঠানোর <strong>প্রয়োজন হয় না</strong> (ছোটখাটো
                ত্রুটির ক্ষেত্রে)
              </li>
            </ol>
            <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-1.5 sm:mt-2">
              ✅ এই প্রক্রিয়ায় কুরিয়ার ঝামেলা এড়ানো যায় এবং গ্রাহক দ্রুত
              সমাধান পান।
            </p>
          </motion.div>

          {/* Section 4: Courier Issues */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
              <div className="p-2 sm:p-3 rounded-full bg-[#1C08A9]/20 flex-shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C08A9]" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200">
                কুরিয়ার সংক্রান্ত সমস্যা
              </h2>
            </div>
            <ul className="text-sm sm:text-base text-stone-600 dark:text-stone-400 list-disc list-inside space-y-0.5 sm:space-y-1">
              <li>
                যদি পণ্য <strong>ক্ষতিগ্রস্ত</strong> হয় কুরিয়ারের মাধ্যমে,
                তবে ফটো পাঠান – আমরা দায়িত্ব নেব
              </li>
              <li>
                কুরিয়ারের দেরি বা ভুল ডেলিভারি – আমরা সরাসরি কুরিয়ারকে যোগাযোগ
                করি
              </li>
              <li>
                যদি পণ্য আপনার হাতে না পৌঁছায়, তবে পুরো টাকা ফেরত দেওয়া হবে
              </li>
            </ul>
          </motion.div>

          {/* Section 5: Special Conditions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
              <div className="p-2 sm:p-3 rounded-full bg-[#E57373]/20 flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#E57373]" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200">
                বিশেষ শর্তাবলী
              </h2>
            </div>
            <ul className="text-sm sm:text-base text-stone-600 dark:text-stone-400 list-disc list-inside space-y-0.5 sm:space-y-1">
              <li>ডেলিভারি চার্জ ফেরত দেওয়া হয় না (শুধু পণ্যের মূল্য)</li>
              <li>
                আংশিক ফেরতের জন্য পণ্য ফেরত পাঠাতে হবে না – সরাসরি টাকা ফেরত
              </li>
              <li>
                যদি পণ্যটি সম্পূর্ণ ফেরত দিতে চান (গুরুতর ত্রুটি), তবে কুরিয়ার
                চার্জ আমরা বহন করব
              </li>
              <li>বিকাশ/নগদ/ব্যাংক ট্রান্সফারের মাধ্যমে ফেরত দেওয়া হয়</li>
            </ul>
          </motion.div>

          {/* Section 6: Contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
              <div className="p-2 sm:p-3 rounded-full bg-[#8859F8]/20 flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#8859F8]" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200">
                যোগাযোগ
              </h2>
            </div>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              ফেরত বা আংশিক ফেরত সংক্রান্ত যেকোনো প্রশ্নে আমাদের জানান:
              <br />
              <strong>ইমেইল:</strong> return@kiddovalley.com
              <br />
              <strong>ফোন:</strong> ০১৭৮১-৮৭৩০৬৪
              <br />
              <strong>হোয়াটসঅ্যাপ:</strong> ০১৭৮১-৮৭৩০৬৪
            </p>
          </motion.div>
        </div>

        {/* ===== Footer ===== */}
        <div className="mt-6 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-dark-border pt-4 sm:pt-6">
          <span>
            শেষ হালনাগাদ:{" "}
            {new Date().toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <Link href="/" className="hover:text-[#BA68C8] transition-colors">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
