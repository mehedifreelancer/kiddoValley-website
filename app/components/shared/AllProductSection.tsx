// components/products/AllProductSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { books } from "@/app/data/books";

export default function AllProductSection() {
  const handleAddToCart = (id: string, quantity: number) => {
    console.log(`Added ${quantity} of product ${id} to cart`);
    // Your cart logic here
  };

  return (
    <section className="py-16 bg-cream-50/50 dark:bg-dark-bg/50">
      <div className="container-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-stone-800 dark:text-stone-200 mb-1">
            সব{" "}
            <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
              পণ্য
            </span>
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            আমাদের সম্পূর্ণ সংগ্রহ দেখুন
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map((book) => (
            <ProductCard
              key={book.id}
              product={book}
              onAddToCart={(quantity) => handleAddToCart(book.id, quantity)}
              // No onViewVideo prop needed anymore!
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#BA68C8] text-white rounded-lg font-bold shadow-[0_6px_0_#8E4C9E,0_8px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_3px_0_#8E4C9E,0_5px_5px_rgba(0,0,0,0.3)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#8E4C9E,0_2px_2px_rgba(0,0,0,0.2)] transition-all duration-150 relative overflow-hidden border-t-2 border-white/40 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/60 before:via-white/20 before:to-transparent before:rounded-t-lg before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-white/10 after:to-transparent after:rounded-b-lg after:pointer-events-none"
          >
            সব পণ্য দেখুন
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
