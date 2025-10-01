import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProgressSlider({ 
  value = 0, 
  onChange, 
  disabled = false,
  className = '' 
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value)
    onChange(newValue)
  }

  const adjustProgress = (delta) => {
    const newValue = Math.min(100, Math.max(0, value + delta))
    onChange(newValue)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress Display */}
      <div className="text-center">
        <div className="text-4xl font-bold text-text mb-2">
          {value}%
        </div>
        <div className="text-text-muted">Progress Complete</div>
      </div>

      {/* Quick Adjust Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => adjustProgress(-5)}
          disabled={disabled || value <= 0}
          className="touch-target flex items-center justify-center w-12 h-12 rounded-full bg-bg-secondary border border-border hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-text" />
        </button>
        <button
          onClick={() => adjustProgress(5)}
          disabled={disabled || value >= 100}
          className="touch-target flex items-center justify-center w-12 h-12 rounded-full bg-bg-secondary border border-border hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-text" />
        </button>
      </div>

      {/* Slider */}
      <div className="px-4">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className="w-full h-3 bg-progress-bg rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, hsl(142, 76%, 36%) 0%, hsl(142, 76%, 36%) ${value}%, hsl(210, 20%, 95%) ${value}%, hsl(210, 20%, 95%) 100%)`
          }}
        />
      </div>

      {/* Quick Set Buttons */}
      <div className="flex justify-center space-x-2">
        {[0, 25, 50, 75, 100].map(preset => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            disabled={disabled}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              value === preset
                ? 'bg-primary text-white'
                : 'bg-bg-secondary text-text-muted hover:bg-surface-hover hover:text-text'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {preset}%
          </button>
        ))}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: hsl(142, 76%, 36%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: hsl(142, 76%, 36%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}