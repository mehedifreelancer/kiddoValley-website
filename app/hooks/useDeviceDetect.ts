// hooks/useDeviceDetect.ts
"use client";

import { useState, useEffect } from "react";

export function useDeviceDetect(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // সার্ভার সাইডে window নেই – ডিফল্ট false
    if (typeof window === "undefined") return;

    const checkScreen = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // প্রথমবার চেক
    checkScreen();

    // রিসাইজ ইভেন্ট লিসেনার
    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, [breakpoint]);

  return { isMobile, isDesktop: !isMobile };
}
