interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-container-high rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCircle({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-container-high rounded-full ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-container-high rounded h-4 ${className}`}
      aria-hidden="true"
    />
  );
}
