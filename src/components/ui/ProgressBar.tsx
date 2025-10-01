import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'default' | 'minimal' | 'widget';
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  lastUpdated?: Date;
  className?: string;
  colors?: {
    primary: string;
    accent: string;
  };
}

export function ProgressBar({
  progress,
  variant = 'default',
  showPercentage = true,
  showLabel = false,
  label,
  lastUpdated,
  className = '',
  colors,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const barHeight = {
    default: 'h-3',
    minimal: 'h-1.5',
    widget: 'h-4',
  }[variant];

  const progressBg = colors?.accent || 'hsl(142, 76%, 36%)';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text">{label}</span>
          {showPercentage && (
            <span className="text-sm text-text-muted">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-progress-bg rounded-full overflow-hidden ${barHeight}`}>
        <div
          className="progress-bar-fill h-full rounded-full"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: progressBg,
          }}
        />
      </div>
      
      {variant === 'default' && showPercentage && !showLabel && (
        <div className="mt-2 text-center">
          <span className="text-lg font-semibold text-text">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      
      {variant === 'widget' && (
        <div className="mt-2 flex justify-between items-center text-xs text-text-muted">
          <span>{Math.round(clampedProgress)}% complete</span>
          {lastUpdated && (
            <span>Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
          )}
        </div>
      )}
    </div>
  );
}