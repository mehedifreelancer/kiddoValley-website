// components/shared/VideoModalContent.tsx
"use client";

import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

interface VideoModalContentProps {
  videoUrl: string | null;
  title?: string;
}

export default function VideoModalContent({
  videoUrl,
  title,
}: VideoModalContentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500">No video available</p>
      </div>
    );
  }

  return (
    <div className="">
      <VideoPlayer url={videoUrl} title={title} />
    </div>
  );
}
