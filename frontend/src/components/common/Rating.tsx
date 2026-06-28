import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function Rating({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const stars = Array.from({ length: maxStars }, (_, index) => {
    const starValue = index + 1;
    const isFull = displayRating >= starValue;
    const isHalf = !isFull && displayRating >= starValue - 0.5;

    return (
      <span
        key={index}
        className={cn(
          interactive ? 'cursor-pointer transition-transform hover:scale-115' : ''
        )}
        onClick={() => {
          if (interactive && onChange) {
            onChange(starValue);
          }
        }}
        onMouseEnter={() => {
          if (interactive) setHoverRating(starValue);
        }}
        onMouseLeave={() => {
          if (interactive) setHoverRating(null);
        }}
      >
        {isFull ? (
          <Star
            size={size}
            className="fill-amber-400 text-amber-400"
          />
        ) : isHalf ? (
          <StarHalf
            size={size}
            className="fill-amber-400 text-amber-400"
          />
        ) : (
          <Star
            size={size}
            className="text-muted-foreground/40"
          />
        )}
      </span>
    );
  });

  return <div className={cn('flex items-center space-x-0.5', className)}>{stars}</div>;
}
