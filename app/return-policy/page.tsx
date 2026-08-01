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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-light text-stone-800 dark:text-stone-200 mb-4">
            <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
              ফেরত ও আংশিক ফেরত
            </span>{" "}
            নীতি
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            আপনার সন্তুষ্টি আমাদের প্রথম অগ্রাধিকার। পণ্য ফেরত, আংশিক ফেরত ও
            ক্ষতিপূরণের সহজ ও স্বচ্ছ নীতি।
          </p>
        </motion.div>

        {/* ===== Content ===== */}
        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/30 dark:border-white/10 space-y-8">
          {/* Section 1: Return Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-full bg-[#E57373]/20 flex-shrink-0">
              <Clock className="w-5 h-5 text-[#E57373]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
                ফেরতের সময়সীমা ও শর্ত
              </h2>
              <ul className="text-stone-600 dark:text-stone-400 list-disc list-inside space-y-1">
                <li>
                  পণ্য হাতে পাওয়ার <strong>৭ দিনের</strong> মধ্যে ফেরতের আবেদন
                  করতে হবে
                </li>
                <li>
                  পণ্যের প্যাকেট <strong>অক্ষত</strong> থাকতে হবে (খোলা না
                  থাকলে)
                </li>
                <li>
                  যেসব বই ব্যবহার করা হয়েছে বা কভার/পৃষ্ঠা ছেঁড়া, সেগুলো ফেরত
                  নেওয়া হয় না
                </li>
                <li>ফেরতের জন্য পণ্যের ছবি ও বর্ণনা দিয়ে আবেদন করতে হবে</li>
              </ul>
            </div>
          </motion.div>

          {/* Section 2: Defect-wise Partial Refund (Main Feature) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-full bg-[#BA68C8]/20 flex-shrink-0">
              <Percent className="w-5 h-5 text-[#BA68C8]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
                ত্রুটি অনুযায়ী আংশিক ফেরত
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-sm mb-3">
                পণ্যে যদি ছোটখাটো ত্রুটি থাকে, তবে সম্পূর্ণ ফেরত না দিয়ে{" "}
                <strong>আংশিক ফেরত</strong> দেওয়া হয় – যাতে কুরিয়ার ঝামেলা ছাড়াই
                দ্রুত সমাধান পাওয়া যায়।
              </p>
              <div className="overflow-x-auto">
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
                    <tr>
                      <td className="p-2 border border-white/20 dark:border-dark-border/30">
                        ছোট দাগ বা প্রিন্ট ত্রুটি
                      </td>
                      <td className="text-center p-2 border border-white/20 dark:border-dark-border/30 font-semibold text-[#E57373]">
                        ১০-২৫%
                      </td>
                      <td className="p-2 border border-white/20 dark:border-dark-border/30">
                        কয়েকটি পৃষ্ঠায় কালি কম/ বেশি, ছোট দাগ
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-white/20 dark:border-dark-border/30">
                        কভার বা বাইন্ডিং ছোটখাটো সমস্যা
                      </td>
                      <td className="text-center p-2 border border-white/20 dark:border-dark-border/30 font-semibold text-[#BA68C8]">
                        ২০-৩৫%
                      </td>
                      <td className="p-2 border border-white/20 dark:border-dark-border/30">
                        কভারে সামান্য ভাঁজ, বাইন্ডিং ঢিলা
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-white/20 dark:border-dark-border/30">
                        মাঝারি ক্ষতি (ছেঁড়া/জল পড়া)
                      </td>
                      <td className="text-center p-2 border border-white/20 dark:border-dark-border/30 font-semibold text-[#36A43D]">
                        ৩৫-৫০%
                      </td>
                      <td className="p-2 border border-white/20 dark:border-dark-border/30">
                        পৃষ্ঠা ছেঁড়া, পানি/তেলের দাগ (যদি পড়া যায়)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-white/20 dark:border-dark-border/30">
                        গুরুতর ক্ষতি (পড়া যায় না)
                      </td>
                      <td className="text-center p-2 border border-white/20 dark:border-dark-border/30 font-semibold text-[#1C08A9]">
                        ৫০-১০০%
                      </td>
                      <td className="p-2 border border-white/20 dark:border-dark-border/30">
                        পৃষ্ঠা নেই, পুরো ছিড়ে গেছে
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                ⚠️ শতাংশ পণ্যের অবস্থা ও আমাদের পর্যালোচনার ভিত্তিতে নির্ধারিত
                হয়।
              </p>
            </div>
          </motion.div>

          {/* Section 3: Refund Process */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-full bg-[#36A43D]/20 flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-[#36A43D]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
                আংশিক ফেরত প্রক্রিয়া (সরাসরি)
              </h2>
              <ol className="text-stone-600 dark:text-stone-400 list-decimal list-inside space-y-1">
                <li>আমাদের কাস্টমার কেয়ারে পণ্যের ছবি ও বিবরণ পাঠান</li>
                <li>আমরা ত্রুটি পর্যালোচনা করে ফেরত শতাংশ নির্ধারণ করি</li>
                <li>
                  সম্মতি পেলে <strong>সরাসরি আপনার অ্যাকাউন্টে</strong> (যেমন
                  বিকাশ/নগদ) টাকা ফেরত দেওয়া হয়
                </li>
                <li>
                  পণ্যটি ফেরত পাঠানোর <strong>প্রয়োজন হয় না</strong> (ছোটখাটো
                  ত্রুটির ক্ষেত্রে)
                </li>
              </ol>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                ✅ এই প্রক্রিয়ায় কুরিয়ার ঝামেলা এড়ানো যায় এবং গ্রাহক দ্রুত
                সমাধান পান।
              </p>
            </div>
          </motion.div>

          {/* Section 4: Courier Issues */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-full bg-[#1C08A9]/20 flex-shrink-0">
              <Truck className="w-5 h-5 text-[#1C08A9]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
                কুরিয়ার সংক্রান্ত সমস্যা
              </h2>
              <ul className="text-stone-600 dark:text-stone-400 list-disc list-inside space-y-1">
                <li>
                  যদি পণ্য <strong>ক্ষতিগ্রস্ত</strong> হয় কুরিয়ারের মাধ্যমে,
                  তবে ফটো পাঠান – আমরা দায়িত্ব নেব
                </li>
                <li>
                  কুরিয়ারের দেরি বা ভুল ডেলিভারি – আমরা সরাসরি কুরিয়ারকে যোগাযোগ
                  করি
                </li>
                <li>
                  যদি পণ্য আপনার হাতে না পৌঁছায়, তবে পুরো টাকা ফেরত দেওয়া হবে
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Section 5: Special Conditions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-full bg-[#E57373]/20 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-[#E57373]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
                বিশেষ শর্তাবলী
              </h2>
              <ul className="text-stone-600 dark:text-stone-400 list-disc list-inside space-y-1">
                <li>ডেলিভারি চার্জ ফেরত দেওয়া হয় না (শুধু পণ্যের মূল্য)</li>
                <li>
                  আংশিক ফেরতের জন্য পণ্য ফেরত পাঠাতে হবে না – সরাসরি টাকা ফেরত
                </li>
                <li>
                  যদি পণ্যটি সম্পূর্ণ ফেরত দিতে চান (গুরুতর ত্রুটি), তবে কুরিয়ার
                  চার্জ আমরা বহন করব
                </li>
                <li>বিকাশ/নগদ/ব্যাংক ট্রান্সফারের মাধ্যমে ফেরত দেওয়া হয়</li>
              </ul>
            </div>
          </motion.div>

          {/* Section 6: Contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 rounded-full bg-[#8859F8]/20 flex-shrink-0">
              <FileText className="w-5 h-5 text-[#8859F8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
                যোগাযোগ
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                ফেরত বা আংশিক ফেরত সংক্রান্ত যেকোনো প্রশ্নে আমাদের জানান:
                <br />
                <strong>ইমেইল:</strong> return@kiddovalley.com
                <br />
                <strong>ফোন:</strong> ০১৭৮১-৮৭৩০৬৪
                <br />
                <strong>হোয়াটসঅ্যাপ:</strong> ০১৭৮১-৮৭৩০৬৪
              </p>
            </div>
          </motion.div>
        </div>

        {/* ===== Footer ===== */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-dark-border pt-6">
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
