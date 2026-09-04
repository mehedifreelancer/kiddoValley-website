"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AllProductSection from "../components/shared/AllProductSection";
import { useQuery } from "@tanstack/react-query";
import { getPublicGridSettings } from "../homePage.service";
import ProductsPageSkeleton from "../components/skeleton/Productspageskeleton";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const {
    data: gridClasses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["layout-settings"],
    queryFn: getPublicGridSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ✅ স্পিনার/টেক্সটের বদলে ProductsPageSkeleton
  if (isLoading) return <ProductsPageSkeleton />;
  if (error) return <div>Error loading settings</div>;

  const handleClearSearch = () => {
    router.push("/products");
  };

  return (
    <div>
      <AllProductSection
        gridClasses={gridClasses}
        onClearSearch={handleClearSearch}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default Page;
