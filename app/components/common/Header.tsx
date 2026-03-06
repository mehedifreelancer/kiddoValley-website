// components/Header.tsx (updated color scheme)
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
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/stores/hooks";
import { toggleTheme } from "@/app/stores/features/theme/themeSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const theme = useAppSelector((state) => state.theme.mode);
  const cartQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Add scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Books", href: "/books", icon: "📚" },
    { name: "Categories", href: "/categories", icon: "📖" },
    { name: "New Arrivals", href: "/new", icon: "✨" },
    { name: "Contact", href: "/contact", icon: "💌" },
  ];

  const getThemeIcon = () => {
    if (!mounted) return <Sun size={20} />;
    return theme === "light" ? (
      <Moon size={20} className="text-indigo-600 dark:text-indigo-400" />
    ) : (
      <Sun size={20} className="text-amber-500" />
    );
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo with sparkle effect */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
            onClick={handleLinkClick}
          >
            <div className="relative w-12 h-12 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-105 transition-transform duration-300 shadow-md">
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 dark:from-purple-400 dark:via-pink-400 dark:to-amber-400 bg-clip-text text-transparent">
                KiddoValley
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 -mt-1">
                Where stories come alive ✨
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with icons */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30"
                      : "text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Icons with improved styling */}
          <div className="flex items-center space-x-1">
            {/* Theme Toggle with animation */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-slate-800 transition-all duration-300 relative group"
              aria-label="Toggle theme"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              {getThemeIcon()}
            </button>

            {/* Search with tooltip */}
            <Link
              href="/search"
              className="p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-slate-800 transition-all duration-300 relative group"
              aria-label="Search"
            >
              <Search
                size={20}
                className="text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400"
              />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Search books
              </span>
            </Link>

            {/* User */}
            <Link
              href="/account"
              className="p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-slate-800 transition-all duration-300 relative group"
              aria-label="Account"
            >
              <User
                size={20}
                className="text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400"
              />
            </Link>

            {/* Cart with badge animation */}
            <Link
              href="/cart"
              className="p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-slate-800 transition-all duration-300 relative group"
              aria-label="Cart"
            >
              <ShoppingCart
                size={20}
                className="text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400"
              />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  {cartQuantity}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-purple-100 dark:hover:bg-slate-800 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={20} className="text-slate-600 dark:text-slate-300" />
              ) : (
                <Menu
                  size={20}
                  className="text-slate-600 dark:text-slate-300"
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu with improved styling */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-100 dark:border-slate-800">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 hover:translate-x-1"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile additional links */}
              <Link
                href="/search"
                onClick={handleLinkClick}
                className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 flex items-center gap-3"
              >
                <Search size={20} />
                <span>Search Books</span>
              </Link>
              <Link
                href="/account"
                onClick={handleLinkClick}
                className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 flex items-center gap-3"
              >
                <User size={20} />
                <span>My Account</span>
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Animated rainbow line */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 dark:from-purple-600 dark:via-pink-600 dark:to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </header>
  );
}
