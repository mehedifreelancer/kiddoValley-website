// app/@modal/(.)products/[slug]/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation"; // 🆕 usePathname
import { useQuery } from "@tanstack/react-query";
import Modal from "@/app/components/shared/Modal";
import SideModal from "@/app/components/shared/SideModal";
import VideoModalContent from "@/app/components/shared/VideoModalContent";
import ProductDetails from "@/app/components/shared/ProductDetails";
import { getProductBySlug } from "@/app/products/product.service";
import { useDeviceDetect } from "@/app/hooks/useDeviceDetect";
import { useGlobal } from "@/app/contexts/GlobalContext"; // ✅ ইমপোর্ট

export default function ProductModal() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const pathname = usePathname(); // 🆕

  const { isMobile } = useDeviceDetect(768);
  const { isCartOpen } = useGlobal(); // ✅ কার্ট স্টেট নিন

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
  if (!pathname?.startsWith(`/products/${slug}`)) {
    return null;
  }
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

  const content = (
    <ProductDetails
      product={product}
      onVideoOpen={() => setIsVideoOpen(true)}
      onVideoClose={() => setIsVideoOpen(false)}
      showIngInModal={true}
    />
  );

  // ✅ ক্লোজ ডিজেবল করার শর্ত – ভিডিও ওপেন অথবা কার্ট ওপেন
  const shouldDisableOutsideClick = isVideoOpen || isCartOpen;

  return (
    <>
      {/* ডিটেইল মডাল – ভিডিও বা কার্ট খোলা থাকলে বাইরের ক্লিক নিষ্ক্রিয় */}
      {isMobile ? (
        <SideModal
          isOpen={true}
          onClose={() => router.back()}
          title={product.name}
          disableOutsideClick={shouldDisableOutsideClick}
        >
          <div className="p-1 md:p-3">{content}</div>
        </SideModal>
      ) : (
        <Modal
          isOpen={true}
          onClose={() => router.back()}
          title={product.name}
          size="4xl"
          disableOutsideClick={shouldDisableOutsideClick}
        >
          <div className="p-1 md:p-5">{content}</div>
        </Modal>
      )}

      {/* ভিডিও মডাল – ওভারলে */}
      {isVideoOpen && product.videoUrl && (
        <Modal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          title={`${product.name} - ভিডিও প্রিভিউ`}
          size="4xl"
        >
          <VideoModalContent
            videoUrl={product.videoUrl}
            title={product.name}
            isOpen={isVideoOpen}
          />
        </Modal>
      )}
    </>
  );
}
