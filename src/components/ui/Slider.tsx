import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  variant?: 'default' | 'mobile';
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  variant = 'default',
  className = '',
  disabled = false,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const isMobile = variant === 'mobile';
  const thumbSize = isMobile ? 'w-8 h-8' : 'w-5 h-5';
  const trackHeight = isMobile ? 'h-3' : 'h-2';
  const trackPadding = isMobile ? 'py-6' : 'py-2';

  const handleInteractionStart = (clientX: number) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(clientX);
  };

  const handleInteractionMove = (clientX: number) => {
    if (!isDragging || disabled) return;
    updateValue(clientX);
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
  };

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleInteractionStart(e.clientX);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleInteractionStart(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleInteractionMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleInteractionMove(e.touches[0].clientX);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleInteractionEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleInteractionEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging]);

  const progressPercentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative ${trackPadding} ${className}`}>
      <div
        ref={sliderRef}
        className={`relative ${trackHeight} bg-progress-bg rounded-full cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Progress track */}
        <div
          className={`${trackHeight} bg-accent rounded-full transition-all duration-300`}
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* Thumb */}
        <div
          className={`
            absolute ${thumbSize} bg-white border-2 border-accent rounded-full 
            shadow-lg cursor-grab active:cursor-grabbing transform -translate-y-1/2 -translate-x-1/2
            transition-all duration-150 hover:scale-110
            ${isDragging ? 'scale-110 shadow-xl' : ''}
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          style={{
            left: `${progressPercentage}%`,
            top: '50%',
          }}
        />
      </div>
      
      {isMobile && (
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-text">{Math.round(value)}%</span>
        </div>
      )}
    </div>
  );
}