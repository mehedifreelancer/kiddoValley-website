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
  const { isMobile } = useDeviceDetect(768);

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

  return (
    <>
      {/* প্রধান মডাল – ভিডিও খোলা থাকলে disableOutsideClick সক্রিয় */}
      {isMobile ? (
        <SideModal
          isOpen={true}
          onClose={() => router.back()}
          title={product.name}
          disableOutsideClick={isVideoOpen}
        >
          <div className="p-1 md:p-3">{content}</div>
        </SideModal>
      ) : (
        <Modal
          isOpen={true}
          onClose={() => router.back()}
          title={product.name}
          size="4xl"
          disableOutsideClick={isVideoOpen}
        >
          <div className="p-1 md:p-5">{content}</div>
        </Modal>
      )}

      {/* ভিডিও মডাল – সবসময় কেন্দ্রীয় Modal */}
      {isVideoOpen && product.videoUrl && (
        <Modal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          title={`${product.name} - ভিডিও প্রিভিউ`}
          size="xl"
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
