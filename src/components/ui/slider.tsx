import * as React from 'react';
import { cn } from '@/utils/cn';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function Slider({ min, max, step = 1, value, onChange, className }: SliderProps) {
  const [minValue, maxValue] = value;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxValue - step);
    onChange([val, maxValue]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minValue + step);
    onChange([minValue, val]);
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className={cn('relative w-full h-5 flex items-center', className)}>
      <div className="relative w-full h-1 bg-secondary rounded-full">
        {/* Active Track Highlight */}
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
      </div>

      {/* Dual Overlaid Range Inputs */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none outline-none focus:outline-none z-20 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-background 
          [&::-webkit-slider-thumb]:border 
          [&::-webkit-slider-thumb]:border-primary 
          [&::-webkit-slider-thumb]:shadow-md 
          [&::-webkit-slider-thumb]:cursor-pointer 
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:appearance-none 
          [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:w-4 
          [&::-moz-range-thumb]:rounded-full 
          [&::-moz-range-thumb]:bg-background 
          [&::-moz-range-thumb]:border 
          [&::-moz-range-thumb]:border-primary 
          [&::-moz-range-thumb]:shadow-md 
          [&::-moz-range-thumb]:cursor-pointer 
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:transition-transform
          [&::-moz-range-thumb]:hover:scale-110"
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none outline-none focus:outline-none z-20
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-background 
          [&::-webkit-slider-thumb]:border 
          [&::-webkit-slider-thumb]:border-primary 
          [&::-webkit-slider-thumb]:shadow-md 
          [&::-webkit-slider-thumb]:cursor-pointer 
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:appearance-none 
          [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:w-4 
          [&::-moz-range-thumb]:rounded-full 
          [&::-moz-range-thumb]:bg-background 
          [&::-moz-range-thumb]:border 
          [&::-moz-range-thumb]:border-primary 
          [&::-moz-range-thumb]:shadow-md 
          [&::-moz-range-thumb]:cursor-pointer 
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:transition-transform
          [&::-moz-range-thumb]:hover:scale-110"
      />
    </div>
  );
}
