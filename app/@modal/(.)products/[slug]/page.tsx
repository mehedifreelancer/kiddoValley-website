// app/@modal/(.)products/[slug]/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/app/components/shared/Modal";
import SideModal from "@/app/components/shared/SideModal";
import VideoModalContent from "@/app/components/shared/VideoModalContent";
import ProductDetails from "@/app/components/shared/ProductDetails";
import { getProductBySlug } from "@/app/products/product.service";
import { useDeviceDetect } from "@/app/hooks/useDeviceDetect";

export default function ProductModal() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { isMobile, isDesktop } = useDeviceDetect(768); // 768px ব্রেকপয়েন্ট

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

  // লোডিং স্ক্রিন
  if (isLoading) {
    const Loader = () => (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
      </div>
    );

    if (isMobile) {
      return (
        <SideModal
          isOpen={true}
          onClose={() => router.back()}
          title="Loading..."
        >
          <Loader />
        </SideModal>
      );
    }
    return (
      <Modal
        isOpen={true}
        onClose={() => router.back()}
        title="Loading..."
        size="4xl"
      >
        <Loader />
      </Modal>
    );
  }

  if (error || !product) {
    router.back();
    return null;
  }

  // মূল কন্টেন্ট
  const content = (
    <ProductDetails
      product={product}
      onVideoOpen={() => setIsVideoOpen(true)}
      onVideoClose={() => setIsVideoOpen(false)}
      showIngInModal={true}
    />
  );

  // ভিডিও মডাল (মোবাইল/ডেস্কটপ আলাদা)
  const videoModal =
    isVideoOpen &&
    product.videoUrl &&
    (isMobile ? (
      <SideModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title={`${product.name} - ভিডিও প্রিভিউ`}
        className="w-full max-w-full"
      >
        <VideoModalContent
          videoUrl={product.videoUrl}
          title={product.name}
          isOpen={isVideoOpen}
        />
      </SideModal>
    ) : (
      <Modal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title={`${product.name} - ভিডিও প্রিভিউ`}
        size="4xl lg:max-w-6xl"
      >
        <VideoModalContent
          videoUrl={product.videoUrl}
          title={product.name}
          isOpen={isVideoOpen}
        />
      </Modal>
    ));

  // প্রধান মডাল
  return (
    <>
      {isMobile ? (
        <SideModal
          isOpen={true}
          onClose={() => router.back()}
          title={product.name}
        >
          <div className="p-1 md:p-3">{content}</div>
        </SideModal>
      ) : (
        <Modal
          isOpen={true}
          onClose={() => router.back()}
          title={product.name}
          size="4xl"
        >
          <div className="p-1 md:p-5">{content}</div>
        </Modal>
      )}
      {videoModal}
    </>
  );
}
