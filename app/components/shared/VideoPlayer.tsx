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

    return () => {
      if (timelineInterval.current) clearInterval(timelineInterval.current);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [url]);

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

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const newTime = parseFloat(e.target.value);
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

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
    <div className="w-full bg-black rounded-sm overflow-hidden  shadow-md select-none">
      {/* ভিডিও ডিসপ্লে এরিয়া */}
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

        {/* মোবাইল ফ্রেম অপ্টিমাইজড প্লেয়ার উইন্ডো */}
        <div
          className={`absolute top-[-25%] bottom-[-25%] left-[-2%] right-[-2%] w-[104%] h-[150%] pointer-events-none ${isLoaded ? "block" : "hidden"}`}
        >
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                mute: 1,
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
      </div>

      {/* নিচের নতুন কাস্টম কন্ট্রোল প্যানেল */}
      {isLoaded && (
        <div className="bg-gray-200 dark:bg-gray-900 px-2 py-3 flex flex-col gap-2">
          {/* প্রোগ্রেস বার (Time Seek) */}
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

            <button
              onClick={toggleMute}
              className="text-gray-300  hover:text-white  p-1 rounded-lg transition-all active:scale-95 shadow-inner "
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX size={18} className="text-rose-400" />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
          </div>

          {/* কন্ট্রোলারের নিচের ৩-কলাম গ্রিড লেআউট */}
          <div className="flex border-t border-gray-300 dark:border-gray-800  justify-center items-center mt-1">
            {/* ২. মাঝখানে (Center): প্লে এবং পজ বাটন */}
            <button
              onClick={togglePlay}
              className="mt-2 text-white hover:text-rose-500 bg-gray-800 hover:bg-gray-700 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md border border-gray-700"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} className="fill-white text-white" />
              ) : (
                <Play size={18} className="fill-white text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
