// app/products/[slug]/page.tsx
import React from "react"; // Add this import
import ProductDetails from "@/app/components/shared/ProductDetails";
import { books } from "@/app/data/books";
import { notFound } from "next/navigation";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params); // Unwrap the Promise
  const product = books.find((p) => p.id === slug); // Using id as slug

  if (!product) notFound();

  return (
    <div className="container mx-auto py-10">
      <ProductDetails product={product} />
    </div>
  );
}
