// components/Footer.tsx
"use client";

import {
  Facebook,
  HdIcon,
  Heart,
  Instagram,
  Mail,
  MapPin,
  MessageCircleHeart,
  Phone,
  TimerReset,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    shop: {
      title: "📚 Shop Books",
      links: [
        { name: "All Books", href: "/books" },
        { name: "New Arrivals", href: "/new" },
        { name: "Bestsellers", href: "/bestsellers" },
        { name: "Age 0-3", href: "/age/0-3" },
        { name: "Age 4-7", href: "/age/4-7" },
        { name: "Age 8-12", href: "/age/8-12" },
      ],
    },
    about: {
      title: "✨ About Us",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Authors", href: "/authors" },
        { name: "Careers", href: "/careers" },
      ],
    },
    support: {
      title: "🤝 Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faqs" },
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
        { name: "Privacy", href: "/privacy" },
      ],
    },
  };

  const socialLinks = [
    {
      icon: <Facebook />,
      href: "https://facebook.com/kiddovalley",
      name: "Facebook",
    },
    {
      icon: <Instagram />,
      href: "https://instagram.com/kiddovalley",
      name: "Instagram",
    },
    {
      icon: <MessageCircleHeart />,
      href: "https://pinterest.com/kiddovalley",
      name: "Pinterest",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 text-white">
      {/* Rainbow Top Border */}

      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">KiddoValley</h3>
              <p className="text-purple-200 dark:text-purple-300 text-sm mb-4">
                Bringing magical stories to young readers since 2024. Discover
                the joy of reading!
              </p>
              <div className="space-y-2 text-sm text-purple-200 dark:text-purple-300">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>hello@kiddovalley.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>Storyland, Imagination Street</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {Object.values(footerSections).map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-bold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-purple-200 dark:text-purple-300 hover:text-yellow-300 dark:hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter & Social */}
        <div className="mt-12 pt-8 border-t border-purple-700 dark:border-purple-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    className="w-10 h-10 bg-white/10 hover:bg-purple-500 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                  >
                    <HdIcon size={18} />
                  </Link>
                );
              })}
            </div>

            {/* Newsletter */}
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Email for stories & deals"
                className="px-4 py-2 rounded-l-lg w-full md:w-64 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-6 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-purple-700 dark:border-purple-800 text-center text-sm text-purple-300 dark:text-purple-400">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} KiddoValley. Made with{" "}
            <Heart size={14} className="text-pink-400 fill-current" /> for young
            readers
          </p>
        </div>
      </div>
    </footer>
  );
}
