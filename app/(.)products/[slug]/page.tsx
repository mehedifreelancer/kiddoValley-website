// app/(.)products/[slug]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/shared/Modal";
import ProductDetails from "@/app/components/shared/ProductDetails";
import { books } from "@/app/data/books";
import { notFound } from "next/navigation";
import ProductCard from "@/app/components/shared/ProductCard";

export default function ProductModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params); // Unwrap the Promise
  const router = useRouter();
  const product = books.find((p) => p.id === slug);

  if (!product) notFound();

  return (
    <Modal
      isOpen={true}
      onClose={() => router.back()}
      title={product.name}
      size="xl"

    >
      <ProductCard showDetails={true} product={product} />
    </Modal>
  );
}
