"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Mail,
  Phone,
  Facebook,
  Send,
  User,
  MessageSquare,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";
import { sendContactMessage } from "./contact.service";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await sendContactMessage(formData);

      if (res.success) {
        toast.success("আপনার মেসেজ সফলভাবে পাঠানো হয়েছে!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(
          res.message ||
            res.error ||
            "মেসেজ পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
        );
      }
    } catch (err: any) {
      toast.error(
        err.message || "সার্ভার সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-light text-stone-800 dark:text-stone-200 mb-4">
            <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
              যোগাযোগ
            </span>{" "}
            করুন
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            আপনার যেকোনো প্রশ্ন, মতামত বা অভিযোগ জানাতে আমাদের সাথে যোগাযোগ
            করুন। আমরা ২৪ ঘন্টার মধ্যে উত্তর দেব।
          </p>
        </motion.div>

        {/* ===== Main Content ===== */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* ===== Contact Info ===== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/30 dark:border-white/10 space-y-6 h-full">
              <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#E57373] to-[#BA68C8] rounded-full" />
                সরাসরি যোগাযোগ
              </h2>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all group">
                <div className="p-3 rounded-full bg-[#36A43D]/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-[#36A43D]" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                    ফোন
                  </p>
                  <a
                    href="tel:+8801781873064"
                    className="text-stone-800 dark:text-stone-200 font-medium hover:text-[#36A43D] transition-colors"
                  >
                    ০১৭৮১-৮৭৩০৬৪
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all group">
                <div className="p-3 rounded-full bg-[#8859F8]/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-[#8859F8]" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                    ইমেইল
                  </p>
                  <a
                    href="mailto:return@kiddovalley.com"
                    className="text-stone-800 dark:text-stone-200 font-medium hover:text-[#8859F8] transition-colors"
                  >
                    return@kiddovalley.com
                  </a>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all group">
                <div className="p-3 rounded-full bg-[#1C08A9]/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5 text-[#1C08A9]" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                    ফেসবুক পেজ
                  </p>
                  <a
                    href="https://facebook.com/kiddovalley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-800 dark:text-stone-200 font-medium hover:text-[#1C08A9] transition-colors"
                  >
                    Kiddo Valley
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all group">
                <div className="p-3 rounded-full bg-[#36A43D]/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-[#36A43D]" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                    হোয়াটসঅ্যাপ
                  </p>
                  <a
                    href="https://wa.me/8801781873064"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-800 dark:text-stone-200 font-medium hover:text-[#36A43D] transition-colors"
                  >
                    ০১৭৮১-৮৭৩০৬৪
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 dark:bg-white/5">
                <div className="p-3 rounded-full bg-[#E57373]/20 flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#E57373]" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                    কর্মঘণ্টা
                  </p>
                  <p className="text-stone-800 dark:text-stone-200 font-medium">
                    সকাল ৯টা – রাত ৯টা
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    (শুক্রবার ও শনিবার সকাল ১০টা – রাত ৮টা)
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 dark:bg-white/5">
                <div className="p-3 rounded-full bg-[#BA68C8]/20 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#BA68C8]" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                    ঠিকানা
                  </p>
                  <p className="text-stone-800 dark:text-stone-200 font-medium">
                    ঢাকা, বাংলাদেশ
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===== Contact Form ===== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/30 dark:border-white/10">
              <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-6">
                <span className="w-1 h-6 bg-gradient-to-b from-[#8859F8] to-[#BA68C8] rounded-full" />
                ইমেইল পাঠান
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5"
                  >
                    আপনার নাম <span className="text-[#E57373]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#8859F8]/40 focus:border-transparent transition-all"
                      placeholder="আপনার নাম লিখুন"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5"
                  >
                    আপনার ইমেইল <span className="text-[#E57373]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#8859F8]/40 focus:border-transparent transition-all"
                      placeholder="আপনার ইমেইল লিখুন"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5"
                  >
                    বিষয় <span className="text-[#E57373]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#8859F8]/40 focus:border-transparent transition-all"
                      placeholder="বিষয় লিখুন"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5"
                  >
                    বার্তা <span className="text-[#E57373]">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-xl text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#8859F8]/40 focus:border-transparent transition-all resize-none"
                      placeholder="আপনার বার্তা লিখুন..."
                    />
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gradient-to-r from-stone-400 to-stone-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#8859F8] to-[#BA68C8] hover:shadow-lg hover:shadow-[#8859F8]/30"
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      মেসেজ পাঠান
                    </>
                  )}
                </motion.button>
              </form>
              <p className="text-sm text-stone-400 dark:text-stone-500 mt-5 flex items-center justify-center gap-2">
                {/* <span className="text-xl animate-pulse">✨</span>
                "আপনার মেসেজ পাওয়ার পরপরই ইনশাআল্লাহ যত দ্রুত সম্ভব আমরা রেসপন্স
                করবো।"
                <span className="text-2xl animate-pulse">✨</span> */}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
