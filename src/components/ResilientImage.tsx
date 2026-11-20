import { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  aspectClassName = 'aspect-[4/3]',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`${aspectClassName} w-full bg-[#EFECE6] border border-[#E2DDD4] flex flex-col items-center justify-center p-6 text-center`}
        role="img"
        aria-label={alt}
      >
        <Utensils className="w-7 h-7 text-[#9A1F18] mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-[#3A3532] max-w-xs">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
