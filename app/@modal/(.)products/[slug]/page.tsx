// app/@modal/(.)products/[slug]/page.tsx
"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/app/components/shared/Modal";
import VideoModalContent from "@/app/components/shared/VideoModalContent";
import ProductDetails from "@/app/components/shared/ProductDetails";
import { getProductBySlug } from "@/app/products/product.service";

export default function ProductModal() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={() => router.back()} title="Loading...">
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
        </div>
      </Modal>
    );
  }

  if (error || !product) {
    router.back();
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onClose={() => router.back()}
      title={product.name}
      size="xl"
    >
      <ProductDetails
        product={product}
        onVideoOpen={() => setIsVideoOpen(true)}
        onVideoClose={() => setIsVideoOpen(false)}
      />

      {/* ভিডিও মডাল – ProductDetails-এর ভেতরে না রেখে বাইরে রাখা ভালো */}
      {isVideoOpen && product.videoUrl && (
        <Modal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          title={`${product.name} - ভিডিও প্রিভিউ`}
          size="lg"
        >
          <VideoModalContent
            videoUrl={product.videoUrl}
            title={product.name}
            isOpen={isVideoOpen}
          />
        </Modal>
      )}
    </Modal>
  );
}
