// components/skeleton/SkeletonBase.tsx
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-white/20 dark:bg-white/15 backdrop-blur-sm border border-white/10 dark:border-white/15 rounded-lg ${className}`}
    />
  );
}

export function SkeletonCircle({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-white/20 dark:bg-white/15 backdrop-blur-sm border border-white/10 dark:border-white/15 rounded-full ${className}`}
    />
  );
}
