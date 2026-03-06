// components/products/VideoModalContent.tsx
"use client";

interface VideoModalContentProps {
  videoUrl?: string;
  title?: string;
}

export default function VideoModalContent({
  videoUrl,
  title,
}: VideoModalContentProps) {
  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = videoUrl ? getYouTubeId(videoUrl) : null;
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : videoUrl;

  if (!videoUrl) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-600 dark:text-stone-400">
          ভিডিও পাওয়া যায়নি
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={title || "Video player"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-sm text-stone-500 dark:text-stone-500 text-center">
        {title} - ভিডিও প্রিভিউ
      </p>
    </div>
  );
}
