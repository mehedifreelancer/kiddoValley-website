// components/common/Footer.tsx
import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-cream-100 relative  dark:bg-dark-surface border-t border-stone-300 dark:border-dark-border overflow-hidden">
      {/* Minimal splash effect at bottom right */}
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

        {/* Tiny sparkle */}
        <div
          className="absolute bottom-10 right-10 w-20 h-20 rounded-full blur-xl"
          style={{
            background: "#36A43D",
            opacity: 0.1,
          }}
        />
      </div>

      {/* Minimal splash at bottom left - very subtle */}
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
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen size={24} className="text-logo-red" />
              <span className="text-lg font-light text-stone-800 dark:text-stone-200">
                Kiddo<span className="font-medium text-logo-red">Valley</span>
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
              Where stories come alive and imaginations soar. Discover the magic
              of reading with our curated collection.
            </p>
            <div className="flex space-x-3">
              {[
                { color: "#D51B26", label: "red" },
                { color: "#1C08A9", label: "blue" },
                { color: "#8859F8", label: "purple" },
                { color: "#36A43D", label: "green" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="w-6 h-6 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
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

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {[
                "Picture Books",
                "Chapter Books",
                "Educational",
                "Activity",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-stone-600 dark:text-stone-400 hover:text-logo-green dark:hover:text-logo-green transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-300 dark:border-dark-border flex flex-col md:flex-row justify-between items-center relative">
          <p className="text-xs text-stone-500 dark:text-stone-500">
            © 2024 KiddoValley. All rights reserved.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-500 flex items-center">
            Made with <Heart size={12} className="mx-1 text-logo-red" /> for
            young readers
          </p>
        </div>
      </div>

      {/* Very subtle bottom line with logo colors */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-logo-red via-logo-purple via-logo-blue to-logo-green to-transparent opacity-20"></div>
    </footer>
  );
}
