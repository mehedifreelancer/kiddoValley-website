// app/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

import AllProductSection from "./components/shared/AllProductSection";
import HeroSection from "./components/shared/HeroSection";
import { getPublicHeroSliders } from "./homePage.service";

export default function Home() {
  const {
    data: slides,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["public-hero-sliders"],
    queryFn: getPublicHeroSliders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !slides) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">Failed to load page content.</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection slides={slides} />
      <AllProductSection />
    </>
  );
}
