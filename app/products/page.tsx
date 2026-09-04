"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import AllProductSection from "../components/shared/AllProductSection";
import { useQuery } from "@tanstack/react-query";
import { getPublicGridSettings } from "../homePage.service";

const Page = () => {
  // ✅ URL থেকে search প্যারামিটার পড়ুন
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

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading settings</div>;

  return (
    <div>
      {/* ✅ সার্চ কোয়েরি প্রপস হিসেবে পাঠানো হচ্ছে */}
      <AllProductSection gridClasses={gridClasses} searchQuery={searchQuery} />
    </div>
  );
};

export default Page;
