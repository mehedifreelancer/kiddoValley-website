"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Search,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobal } from "@/app/contexts/GlobalContext";

// ✅ প্রপস টাইপ
interface HeaderProps {
  logoUrl?: string | null;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

export default function Header({ logoUrl, socialLinks }: HeaderProps) {
  const pathname = usePathname();
  const { themeMode, setThemeMode, cartCount, openCart, isCartOpen } =
    useGlobal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isCartOpen && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isCartOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "হোম", href: "/", color: "#D51B26" },
    { name: "আমাদের সম্পর্কে", href: "/about-us", color: "#36A43D" },
    { name: "বিভাগসমূহ", href: "/categories", color: "#8859F8" },
    { name: "নতুন আসা", href: "/new", color: "#1C08A9" },
    { name: "যোগাযোগ", href: "/contact-us", color: "#D51B26" },
  ];

  const toggleTheme = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  const getThemeIcon = () => {
    if (!mounted) return <Sun size={18} />;
    return themeMode === "light" ? (
      <Moon size={18} className="text-stone-600 dark:text-stone-400" />
    ) : (
      <Sun size={18} className="text-stone-500" />
    );
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 transition-all duration-700 bg-cream-100 dark:bg-dark-surface border-b border-stone-200 dark:border-dark-border">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo – ডায়নামিক */}
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

            {/* Desktop Navigation – অপরিবর্তিত */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? `${item.color}15`
                        : "transparent",
                      color: isActive ? item.color : "",
                    }}
                  >
                    <span
                      className={
                        !isActive ? "text-stone-600 dark:text-stone-400" : ""
                      }
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Icons – অপরিবর্তিত */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-md hover:bg-stone-100 dark:hover:bg-dark-elevated transition-all duration-200 cursor-pointer"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </button>

              <Link
                href="/search"
                className="hidden xs:block p-1.5 sm:p-2 rounded-md hover:bg-stone-100 dark:hover:bg-dark-elevated transition-all duration-200"
                aria-label="Search"
              >
                <Search
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-stone-600 dark:text-stone-400"
                />
              </Link>

              <button
                onClick={openCart}
                className="relative p-1.5 sm:p-2 rounded-md hover:bg-stone-100 dark:hover:bg-dark-elevated transition-all duration-200"
                aria-label="Cart"
              >
                <ShoppingCart
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-stone-600 dark:text-stone-400 cursor-pointer"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-logo-red text-white text-[10px] sm:text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleMenuToggle}
                className="md:hidden p-1.5 sm:p-2 rounded-md hover:bg-stone-100 dark:hover:bg-dark-elevated transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X size={18} className="text-stone-600 dark:text-stone-400" />
                ) : (
                  <Menu
                    size={18}
                    className="text-stone-600 dark:text-stone-400"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu – অপরিবর্তিত */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-4/5 max-w-sm bg-cream-50 dark:bg-dark-surface shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-[#BA68C8]" />
                  <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                    মেনু
                  </h2>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-dark-elevated transition-colors"
                >
                  <X size={20} className="text-stone-600 dark:text-stone-400" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                        style={{
                          backgroundColor: isActive
                            ? `${item.color}15`
                            : "transparent",
                          color: isActive ? item.color : "",
                        }}
                      >
                        <span
                          className={
                            !isActive
                              ? "text-stone-600 dark:text-stone-400"
                              : ""
                          }
                        >
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
              <div className="p-4 border-t border-stone-200 dark:border-dark-border">
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-dark-elevated transition-all duration-200"
                >
                  <Search size={18} />
                  <span>Search</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-dark-elevated transition-all duration-200"
                >
                  <User size={18} />
                  <span>Account</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
