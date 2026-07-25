"use client";

import { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { getYouTubeId } from "@/app/lib/youtube";

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef<any>(null);
  const timelineInterval = useRef<any>(null);

  useEffect(() => {
    const id = getYouTubeId(url);
    setVideoId(id);

    // কম্পোনেন্ট ক্লোজ বা আনমাউন্ট হলে ভিডিও এবং ইন্টারভাল বন্ধ করার জন্য ক্লিনআপ
    return () => {
      if (timelineInterval.current) clearInterval(timelineInterval.current);
      if (playerRef.current) {
        playerRef.current.destroy(); // আইফ্রেম ডেস্ট্রয় করে ব্যাকগ্রাউন্ড প্লে বন্ধ করা
      }
    };
  }, [url]);

  // প্রোগ্রেস বার প্রতি সেকেন্ডে আপডেট করার জন্য টাইমার
  const startTimelineUpdate = () => {
    if (timelineInterval.current) clearInterval(timelineInterval.current);

    timelineInterval.current = setInterval(() => {
      if (
        playerRef.current &&
        typeof playerRef.current.getCurrentTime === "function"
      ) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  };

  const onReady = (event: any) => {
    playerRef.current = event.target;
    setIsLoaded(true);
    setDuration(event.target.getDuration());
    event.target.playVideo();
    setIsPlaying(true);
    startTimelineUpdate();
  };

  const onStateChange = (event: any) => {
    // ১ = PLAYING, ২ = PAUSED, ০ = ENDED
    if (event.data === 1) {
      setIsPlaying(true);
      startTimelineUpdate();
    } else {
      setIsPlaying(false);
      if (timelineInterval.current) clearInterval(timelineInterval.current);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  // সিক বার বা প্রোগ্রেস বার টেনে পরিবর্তন করার ফাংশন
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const newTime = parseFloat(e.target.value);
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  // সময়কে ০:০০ ফরম্যাটে দেখানোর ইউটিলিটি
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!videoId) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500">Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden border border-gray-800 shadow-xl">
      {/* ভিডিও ডিসপ্লে সেকশন (১৬:৯ রেশিও লকড) */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {/* থাম্বনেইল ও লোডার */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10">
            <img
              src={`https://youtube.com{videoId}/maxresdefault.jpg`}
              alt="Video thumbnail"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
            </div>
          </div>
        )}

        {/* আল্ট্রা-ক্রপড ইউটিউব প্লেয়ার উইন্ডো */}
        {/* top-[-18%] এবং h-[136%] এর ফলে ইউটিউবের আসল টাইটেল এবং নিচের লোগো এরিয়া পুরোপুরি ভ্যানিশ হয়ে যাবে */}
        <div
          className={`absolute top-[-18%] bottom-[-18%] left-[-1%] right-[-1%] w-[102%] h-[136%] pointer-events-none ${isLoaded ? "block" : "hidden"}`}
        >
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                mute: 1, // ব্রাউজার পলিসির জন্য ইনিশিয়াল মিউট করা বাধ্যতামুলক, পরে ইউজার আনমিউট করবে
                controls: 0,
                rel: 0,
                playsinline: 1,
                iv_load_policy: 3,
                disablekb: 1,
                modestbranding: 1,
              },
            }}
            onReady={onReady}
            onStateChange={onStateChange}
            className="w-full h-full"
          />
        </div>

        {/* ভিডিওর ভেতরের টাইটেল ওভারলে */}
        {title && isLoaded && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 pointer-events-none z-10">
            <p className="text-white text-sm font-medium truncate">{title}</p>
          </div>
        )}
      </div>

      {/* ভিডিও পোরশনের নিচে নতুন কাস্টম কন্ট্রোলার */}
      {isLoaded && (
        <div className="bg-gray-900 px-4 py-3 flex flex-col gap-2 select-none">
          {/* প্রোগ্রেস বার (Timeline / Seek Bar) */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-gray-400 font-mono min-w-[35px] text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:h-2 transition-all"
            />
            <span className="text-xs text-gray-400 font-mono min-w-[35px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* কন্ট্রোল বাটনসমূহ */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-4">
              {/* প্লে এবং পজ টগল বাটন */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-rose-500 transition-colors p-1"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={22} className="fill-white" />
                ) : (
                  <Play size={22} className="fill-white" />
                )}
              </button>

              {/* ভলিউম অন/অফ বাটন */}
              <button
                onClick={toggleMute}
                className="text-white hover:text-rose-500 transition-colors p-1"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
            </div>

            {/* ডানদিকের ব্র্যান্ডিং বা এক্সট্রা স্পেস */}
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
              Custom Player
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
