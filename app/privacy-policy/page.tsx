"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  Database,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import Button from "../components/shared/Button";

export default function PrivacyPolicyPage() {
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
              গোপনীয়তা
            </span>{" "}
            নীতি
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto px-2">
            আপনার ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদ। আমরা কীভাবে তা সংগ্রহ,
            ব্যবহার ও সুরক্ষিত করি, তা জানুন।
          </p>
        </motion.div>

        {/* ===== Content ===== */}
        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 border border-white/30 dark:border-white/10 space-y-5 sm:space-y-6 md:space-y-8">
          {/* Section 1: What we collect */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-2.5 sm:gap-4"
          >
            <div className="p-2 sm:p-3 rounded-full bg-[#E57373]/20 flex-shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[#E57373]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200 mb-1 sm:mb-1.5">
                আমরা কী সংগ্রহ করি?
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                আপনার{" "}
                <strong>নাম, ফোন নম্বর, ইমেইল, এবং ডেলিভারি ঠিকানা</strong> –
                শুধুমাত্র অর্ডার প্রক্রিয়াকরণ, ডেলিভারি ও গ্রাহক সেবার জন্য।
                কোনো পেমেন্ট তথ্য (কার্ড, ব্যাংক) আমরা সংরক্ষণ করি না – তা
                নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে প্রক্রিয়া করা হয়।
              </p>
            </div>
          </motion.div>

          {/* Section 2: How we use */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-2.5 sm:gap-4"
          >
            <div className="p-2 sm:p-3 rounded-full bg-[#BA68C8]/20 flex-shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#BA68C8]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200 mb-1 sm:mb-1.5">
                কীভাবে ব্যবহার করি?
              </h2>
              <ul className="text-sm sm:text-base text-stone-600 dark:text-stone-400 list-disc list-inside space-y-0.5 sm:space-y-1">
                <li>অর্ডার নিশ্চিতকরণ ও ডেলিভারি</li>
                <li>গ্রাহক সহায়তা ও যোগাযোগ</li>
                <li>প্রচারণামূলক ইমেইল (শুধুমাত্র আপনার সম্মতি সাপেক্ষে)</li>
                <li>ওয়েবসাইটের কার্যকারিতা উন্নত করা</li>
              </ul>
            </div>
          </motion.div>

          {/* Section 3: Data security */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-2.5 sm:gap-4"
          >
            <div className="p-2 sm:p-3 rounded-full bg-[#36A43D]/20 flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#36A43D]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200 mb-1 sm:mb-1.5">
                তথ্য সুরক্ষা
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                আপনার ডেটা এনক্রিপ্টেড আকারে সংরক্ষণ করা হয়। আমাদের কাছে
                শুধুমাত্র প্রয়োজনীয় কর্মীদের অ্যাক্সেস রয়েছে। আমরা কখনো আপনার
                তথ্য তৃতীয় পক্ষের সাথে বাণিজ্যিক উদ্দেশ্যে শেয়ার করি না –
                শুধুমাত্র ডেলিভারি অংশীদার (কুরিয়ার) এবং আইনি প্রয়োজন থাকলে।
              </p>
            </div>
          </motion.div>

          {/* Section 4: Data retention */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-2.5 sm:gap-4"
          >
            <div className="p-2 sm:p-3 rounded-full bg-[#1C08A9]/20 flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C08A9]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200 mb-1 sm:mb-1.5">
                কতদিন রাখি?
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                আমরা আইনগত প্রয়োজন (যেমন হিসাব সংরক্ষণ) এবং গ্রাহক সেবার মান
                বজায় রাখার জন্য প্রয়োজনীয় সময় পর্যন্ত তথ্য রাখি। আপনি চাইলে
                যে কোনো সময় আমাদের জানিয়ে আপনার তথ্য সংশোধন বা মুছে ফেলতে
                পারেন।
              </p>
            </div>
          </motion.div>

          {/* Section 5: Your rights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-start gap-2.5 sm:gap-4"
          >
            <div className="p-2 sm:p-3 rounded-full bg-[#E57373]/20 flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#E57373]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200 mb-1 sm:mb-1.5">
                আপনার অধিকার
              </h2>
              <ul className="text-sm sm:text-base text-stone-600 dark:text-stone-400 list-disc list-inside space-y-0.5 sm:space-y-1">
                <li>
                  <strong>অ্যাক্সেস:</strong> আপনার সংরক্ষিত ডেটা দেখতে পারেন
                </li>
                <li>
                  <strong>সংশোধন:</strong> ভুল তথ্য পরিবর্তন করতে পারেন
                </li>
                <li>
                  <strong>মুছে ফেলা:</strong> আপনার ডেটা মুছে ফেলতে অনুরোধ করতে
                  পারেন
                </li>
                <li>
                  <strong>অপ্ট-আউট:</strong> প্রচারণামূলক ইমেইল থেকে বেরিয়ে
                  যেতে পারেন
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Section 6: Contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-start gap-2.5 sm:gap-4"
          >
            <div className="p-2 sm:p-3 rounded-full bg-[#8859F8]/20 flex-shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#8859F8]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-200 mb-1 sm:mb-1.5">
                যোগাযোগ
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                গোপনীয়তা নিয়ে কোনো প্রশ্ন বা অনুরোধ থাকলে আমাদের লিখুন:
                <br />
                <strong>ইমেইল:</strong> privacy@kiddovalley.com
                <br />
                <strong>ফোন:</strong> ০১৭৮১-৮৭৩০৬৪
                <br />
                <strong>ঠিকানা:</strong> Kiddo Valley, ঢাকা, বাংলাদেশ
              </p>
            </div>
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
