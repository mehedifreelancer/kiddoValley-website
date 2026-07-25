// app/@modal/(.)products/[slug]/page.tsx
"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/app/components/shared/Modal";
import ProductDetails from "@/app/components/shared/ProductDetails";
import { getProductBySlug } from "@/app/products/product.service";

export default function ProductModal() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", slug], // ✅ পেজের সাথে একই queryKey
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  console.log(product);

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={() => router.back()} title="Loading...">
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
        </div>
      </Modal>
    );
  }

  if (error || !product) {
    router.back(); // প্রোডাক্ট না পেলে ব্যাক করে দাও
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onClose={() => router.back()}
      title={product.name}
      size="xl"
    >
      <ProductDetails product={product} />
    </Modal>
  );
}
