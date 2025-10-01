import React from 'react'

export default function ProgressBar({ 
  progress = 0, 
  showLabel = true, 
  size = 'default',
  className = '',
  animated = true 
}) {
  const heightClass = size === 'large' ? 'h-6' : size === 'small' ? 'h-2' : 'h-4'
  const labelSize = size === 'large' ? 'text-sm' : size === 'small' ? 'text-xs' : 'text-sm'

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-progress-bg rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`h-full bg-progress-bar rounded-full ${animated ? 'progress-bar-fill' : ''}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className={`font-medium text-text ${labelSize}`}>
            {Math.round(progress)}%
          </span>
          <span className={`text-text-muted ${labelSize}`}>
            Complete
          </span>
        </div>
      )}
    </div>
  )
}