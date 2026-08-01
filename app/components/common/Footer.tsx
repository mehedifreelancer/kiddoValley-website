"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Heart,
  Facebook,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";

interface FooterProps {
  logoUrl?: string | null;
  footerText?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

export default function Footer({
  logoUrl,
  footerText,
  socialLinks,
}: FooterProps) {
  const defaultFooterText = "© 2024 KiddoValley. All rights reserved.";

  const socialIcons = [
    { key: "facebook", icon: Facebook, label: "Facebook", color: "#1877F2" },
    { key: "instagram", icon: Instagram, label: "Instagram", color: "#E4405F" },
    { key: "youtube", icon: Youtube, label: "YouTube", color: "#FF0000" },
    { key: "website", icon: Globe, label: "Website", color: "#36A43D" },
  ];

  // সক্রিয় সোশ্যাল লিংক ফিল্টার
  const activeSocials = socialIcons.filter((item) =>
    socialLinks?.[item.key as keyof typeof socialLinks]?.trim(),
  );

  return (
    <footer className="bg-cream-200 relative dark:bg-dark-surface border-t border-stone-300 dark:border-dark-border overflow-hidden">
      {/* Splash effects – অপরিবর্তিত */}
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-full h-full rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle at 70% 70%, 
              #D51B26 0%, 
              #8859F8 40%, 
              #1C08A9 70%, 
              transparent 100%
            )`,
            opacity: 0.15,
            transform: "scale(1.5)",
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-20 h-20 rounded-full blur-xl"
          style={{ background: "#36A43D", opacity: 0.1 }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 w-full h-full rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle at 30% 70%, 
              #36A43D 0%, 
              #1C08A9 60%, 
              transparent 100%
            )`,
            opacity: 0.1,
          }}
        />
      </div>

      {/* Footer Content */}
      <div className="container-md mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand – ইমেজ লোগো */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Link
                href="/"
                className="flex items-center space-x-2 sm:space-x-3 group shrink-0"
              >
                {logoUrl ? (
                  // ✅ ডায়নামিক লোগো ইমেজ
                  <div className="relative w-32 h-10 sm:w-40 sm:h-12">
                    <Image
                      src={logoUrl}
                      alt="Kiddo Valley Logo"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 48px, 56px"
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  // ✅ ফ্যালব্যাক টেক্সট লোগো
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-md bg-gradient-to-br from-logo-red via-logo-purple to-logo-blue group-hover:scale-105 transition-transform duration-300">
                      <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base md:text-lg font-light tracking-tight">
                        <span className="text-stone-800 dark:text-stone-200">
                          Kiddo
                        </span>
                        <span className="font-semibold text-logo-red">
                          Valley
                        </span>
                      </span>
                      <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-500 hidden xs:block">
                        Children's Bookstore
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
              Where stories come alive and imaginations soar. Discover the magic
              of reading with our curated collection.
            </p>

            {/* সোশ্যাল লিংক (ঐচ্ছিক) – এখানে রেখেছি, কিন্তু আপনি চাইলে বাদ দিতে পারেন */}
            {activeSocials.length > 0 && (
              <div className="flex space-x-3">
                {activeSocials.map(({ key, icon: Icon, label, color }) => (
                  <a
                    key={key}
                    href={socialLinks?.[key as keyof typeof socialLinks] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-stone-200 dark:bg-dark-elevated flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-white transition-colors"
                    style={{ hover: { backgroundColor: color } }}
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links – স্ট্যাটিক */}
          <div>
            <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["About Us", "Contact", "FAQs", "Shipping"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-stone-600 dark:text-stone-400 hover:text-logo-purple dark:hover:text-logo-purple transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories সেকশন → এখন সোশ্যাল লিংক */}
          <div>
            <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-4">
              Connect With Us
            </h3>
            {activeSocials.length > 0 ? (
              <ul className="space-y-3">
                {activeSocials.map(({ key, icon: Icon, label, color }) => (
                  <li key={key}>
                    <a
                      href={
                        socialLinks?.[key as keyof typeof socialLinks] || "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: color }}
                      >
                        <Icon size={16} className="text-white" />
                      </div>
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-400 dark:text-stone-500">
                No social links configured.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar – ডায়নামিক ফুটার টেক্সট */}
        <div className="mt-12 pt-6 border-t border-stone-300 dark:border-dark-border flex flex-col md:flex-row justify-between items-center relative">
          <p className="text-xs text-stone-500 dark:text-stone-500">
            {footerText || defaultFooterText}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-500 flex items-center">
            Made with <Heart size={12} className="mx-1 text-logo-red" /> for
            young readers
          </p>
        </div>
      </div>

      {/* Bottom gradient line – অপরিবর্তিত */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-logo-red via-logo-purple via-logo-blue to-logo-green to-transparent opacity-20"></div>
    </footer>
  );
}
