"use client"; // ← mark as client component

import React from "react";
import AllProductSection from "../components/shared/AllProductSection";
import { useQuery } from "@tanstack/react-query";
import { getPublicGridSettings } from "../homePage.service";

const Page = () => {
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

  // Handle loading / error states (optional)
  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading settings</div>;

  return (
    <div>
      <AllProductSection gridClasses={gridClasses} />
    </div>
  );
};

export default Page;
