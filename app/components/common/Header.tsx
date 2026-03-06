// components/Header.tsx
"use client";

import Link from "next/link";
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Books", href: "/books" },
    { name: "Categories", href: "/categories" },
    { name: "New", href: "/new" },
    { name: "Contact", href: "/contact" },
  ];

  const getThemeIcon = () => {
    if (!mounted) return <Sun size={18} />;
    return theme === "light" 
      ? <Moon size={18} className="text-stone-600 dark:text-stone-400" />
      : <Sun size={18} className="text-stone-500" />;
  };

  // Get accent color based on path for active states
  const getAccentColor = (href: string) => {
    switch(href) {
      case '/': return '#D51B26'; // Red for home
      case '/books': return '#36A43D'; // Green for books
      case '/categories': return '#8859F8'; // Purple for categories
      case '/new': return '#1C08A9'; // Blue for new
      default: return '#8859F8'; // Purple for others
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-700 ${
      scrolled 
        ? 'bg-cream-50/90 dark:bg-dark-surface/90 backdrop-blur-md shadow-sm' 
        : 'bg-cream-50/80 dark:bg-dark-bg/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo with brand colors */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-sm bg-gradient-to-br from-logo-red via-logo-purple to-logo-blue group-hover:scale-105 transition-transform duration-500">
              <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-light tracking-wide text-stone-800 dark:text-stone-200">
                Kiddo<span className="font-medium" style={{ color: '#D51B26' }}>Valley</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-500">
                Children's <span style={{ color: '#36A43D' }}>Bookstore</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const accentColor = getAccentColor(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <span className={`text-sm tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'font-medium'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <span 
                      className="absolute -bottom-1 left-0 w-full h-0.5"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-sm hover:bg-stone-200 dark:hover:bg-dark-elevated transition-all duration-300"
            >
              {getThemeIcon()}
            </button>

            {/* Search */}
            <Link
              href="/search"
              className="p-2 rounded-sm hover:bg-stone-200 dark:hover:bg-dark-elevated transition-all duration-300"
            >
              <Search size={18} className="text-stone-600 dark:text-stone-400" />
            </Link>

            {/* User */}
            <Link
              href="/account"
              className="p-2 rounded-sm hover:bg-stone-200 dark:hover:bg-dark-elevated transition-all duration-300"
            >
              <User size={18} className="text-stone-600 dark:text-stone-400" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-sm hover:bg-stone-200 dark:hover:bg-dark-elevated transition-all duration-300"
            >
              <ShoppingCart size={18} className="text-stone-600 dark:text-stone-400" />
              {cartQuantity > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-sm text-white text-[10px] flex items-center justify-center"
                  style={{ backgroundColor: '#D51B26' }}
                >
                  {cartQuantity}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-sm hover:bg-stone-200 dark:hover:bg-dark-elevated transition-all duration-300"
            >
              {isMenuOpen ? 
                <X size={18} className="text-stone-600 dark:text-stone-400" /> : 
                <Menu size={18} className="text-stone-600 dark:text-stone-400" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 dark:border-dark-border">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const accentColor = getAccentColor(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="relative group"
                  >
                    <span className={`px-2 py-2 text-sm block ${
                      isActive
                        ? 'font-medium'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <span 
                        className="absolute left-0 top-0 h-full w-0.5"
                        style={{ backgroundColor: accentColor }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Elegant bottom border with logo colors */}
      <div className="h-[2px] w-full bg-gradient-to-r from-logo-red via-logo-purple to-logo-blue opacity-30"></div>
    </header>
  );
}