// components/products/RelatedProducts.tsx
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Book } from "@/app/data/books";

interface RelatedProductsProps {
  products: Book[];
  title?: string;
  maxColumns?: 2 | 3 | 4;
}

export default function RelatedProducts({
  products,
  title = "আপনি আরও পছন্দ করতে পারেন",
  maxColumns = 4,
}: RelatedProductsProps) {
  if (!products.length) return null;

  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className="pt-12 mt-8 border-t border-stone-200 dark:border-dark-border">
      <h2 className="text-2xl font-light text-stone-800 dark:text-stone-200 mb-6">
        {title}
      </h2>
      <div className={`grid grid-cols-1 ${gridCols[maxColumns]} gap-4`}>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block group"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#E57373]/10 to-[#BA68C8]/10 mb-2">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen
                    size={32}
                    className="text-stone-300 dark:text-stone-600"
                  />
                </div>
              )}
            </div>
            <h3 className="font-medium text-stone-800 dark:text-stone-200 line-clamp-1 group-hover:text-[#E57373] transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-[#E57373] font-bold">
              ৳{product.price.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
