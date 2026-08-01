"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Award,
  Star,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  User,
  Crown,
  Briefcase,
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

// ===== Team Member Card =====
const TeamCard = ({
  member,
  size = "md",
}: {
  member: any;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  const imgSize = {
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };
  return (
    <div
      className={`backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg border border-white/30 dark:border-white/10 hover:shadow-xl transition-all hover:scale-[1.02] ${sizeClasses[size]}`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`relative ${imgSize[size]} rounded-full overflow-hidden border-4 border-white/50 dark:border-dark-border/50 shadow-md mb-3`}
        >
          <Image
            src={member.image || "/images/avatar-placeholder.jpg"}
            alt={member.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200">
          {member.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-[#BA68C8] dark:text-[#E57373] font-medium mt-1">
          {member.roleIcon && <member.roleIcon size={14} />}
          <span>{member.role}</span>
        </div>
        {member.bio && (
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 line-clamp-3">
            {member.bio}
          </p>
        )}
        {member.social && (
          <div className="flex gap-2 mt-3">
            {member.social.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-stone-200/50 dark:bg-stone-700/30 hover:bg-[#1DA1F2] hover:text-white transition-colors"
              >
                <Twitter size={14} />
              </a>
            )}
            {member.social.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-stone-200/50 dark:bg-stone-700/30 hover:bg-[#0A66C2] hover:text-white transition-colors"
              >
                <Linkedin size={14} />
              </a>
            )}
            {member.social.facebook && (
              <a
                href={member.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-stone-200/50 dark:bg-stone-700/30 hover:bg-[#1877F2] hover:text-white transition-colors"
              >
                <Facebook size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Main Component =====
export default function OurTeamPage() {
  // Team data with hierarchy
  const founders = [
    {
      name: "মাহমুদুল হাসান",
      role: "প্রতিষ্ঠাতা ও সিইও",
      roleIcon: Crown,
      bio: "শিশু সাহিত্যের প্রতি অগাধ ভালোবাসা থেকে Kiddo Valley-এর পথচলা শুরু। ১০ বছরের অভিজ্ঞতা।",
      image: "/images/team/founder1.jpg",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "তাসনিম আরা",
      role: "সহ-প্রতিষ্ঠাতা",
      roleIcon: Crown,
      bio: "শিশু মনোবিজ্ঞানী ও শিক্ষাবিদ। বই নির্বাচন ও কনটেন্ট উন্নয়নে বিশেষ দক্ষতা।",
      image: "/images/team/founder2.jpg",
      social: { linkedin: "#", facebook: "#" },
    },
  ];

  const leadership = [
    {
      name: "আরিফুর রহমান",
      role: "প্রধান বিপণন কর্মকর্তা",
      roleIcon: Briefcase,
      bio: "বিপণন ও ব্র্যান্ড কৌশল বিশেষজ্ঞ। ৭ বছরের অভিজ্ঞতা।",
      image: "/images/team/leader1.jpg",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "নুসরাত জাহান",
      role: "প্রধান সম্পাদক",
      roleIcon: Briefcase,
      bio: "শিশুসাহিত্য সম্পাদনা ও প্রকাশনায় দক্ষ। ৫টি বই সম্পাদনা করেছেন।",
      image: "/images/team/leader2.jpg",
      social: { facebook: "#", linkedin: "#" },
    },
  ];

  const members = [
    {
      name: "রিয়াদ হোসেন",
      role: "গ্রাফিক ডিজাইনার",
      bio: "রঙিন ও আকর্ষণীয় বইয়ের কভার ডিজাইন করেন।",
      image: "/images/team/member1.jpg",
    },
    {
      name: "সাবরিনা আক্তার",
      role: "বই নির্বাচক",
      bio: "শিশুদের উপযোগী বই নির্বাচন ও পর্যালোচনা করেন।",
      image: "/images/team/member2.jpg",
    },
    {
      name: "মেহেদী হাসান",
      role: "ওয়েব ডেভেলপার",
      bio: "আমাদের অনলাইন প্ল্যাটফর্মের স্থপতি।",
      image: "/images/team/member3.jpg",
    },
    {
      name: "ফারজানা ইয়াসমিন",
      role: "গ্রাহক সম্পর্ক কর্মকর্তা",
      bio: "গ্রাহকদের সাথে যোগাযোগ ও সেবা প্রদান করেন।",
      image: "/images/team/member4.jpg",
    },
  ];

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
        {/* ===== Hero ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-stone-800 dark:text-stone-200 mb-4">
            আমাদের{" "}
            <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
              দল
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            শিশুদের জন্য ভালোবাসা আর পেশাদারিত্বের সমন্বয় – আমাদের দলই আমাদের
            শক্তি।
          </p>
        </motion.div>

        {/* ===== Founders (with crown icon) ===== */}
        <AnimatedSection delay={0.1}>
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200 mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#E57373]" />
            প্রতিষ্ঠাতা
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {founders.map((member, idx) => (
              <TeamCard key={idx} member={member} size="lg" />
            ))}
          </div>
        </AnimatedSection>

        {/* ===== Leadership ===== */}
        <AnimatedSection delay={0.2}>
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#BA68C8]" />
            ব্যবস্থাপনা
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {leadership.map((member, idx) => (
              <TeamCard key={idx} member={member} size="md" />
            ))}
          </div>
        </AnimatedSection>

        {/* ===== Team Members ===== */}
        <AnimatedSection delay={0.3}>
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-200 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#36A43D]" />
            আমাদের দল
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {members.map((member, idx) => (
              <TeamCard key={idx} member={member} size="sm" />
            ))}
          </div>
        </AnimatedSection>

        {/* ===== Join Us CTA ===== */}
        <AnimatedSection delay={0.4}>
          <div className="backdrop-blur-xl bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/30 dark:border-white/10">
            <h2 className="text-3xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
              আমাদের সাথে যোগ দিন
            </h2>
            <p className="text-stone-700 dark:text-stone-300 max-w-2xl mx-auto mb-6">
              আপনি যদি শিশুদের বই ও শিক্ষার প্রতি আগ্রহী হন, তাহলে আমাদের দলের
              অংশ হতে পারেন। আমরা সবসময় নতুন প্রতিভাকে স্বাগত জানাই।
            </p>
            <Button variant="primary" size="lg" className="px-8 py-3">
              <Mail className="w-5 h-5 mr-2" />
              যোগাযোগ করুন
            </Button>
          </div>
        </AnimatedSection>

        <div className="mt-12 text-center text-sm text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-dark-border pt-6">
          Kiddo Valley – শিশুদের বইয়ের ঠিকানা
        </div>
      </div>
    </div>
  );
}
