import React from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { format } from 'date-fns'

export default function MilestoneTimeline({ milestones, currentProgress, variant = 'horizontal' }) {
  if (variant === 'vertical') {
    return (
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const isCompleted = milestone.completedAt || currentProgress >= milestone.targetProgress
          const isActive = !isCompleted && (index === 0 || milestones[index - 1].completedAt || currentProgress >= milestones[index - 1].targetProgress)
          
          return (
            <div key={milestone.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-accent" />
                ) : (
                  <Circle className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${isCompleted ? 'text-text' : isActive ? 'text-primary' : 'text-text-muted'}`}>
                  {milestone.name}
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  Target: {milestone.targetProgress}%
                  {milestone.completedAt && (
                    <span className="ml-2">
                      • Completed {format(new Date(milestone.completedAt), 'MMM d')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Horizontal timeline
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {milestones.map((milestone, index) => {
          const isCompleted = milestone.completedAt || currentProgress >= milestone.targetProgress
          const isActive = !isCompleted && (index === 0 || milestones[index - 1].completedAt || currentProgress >= milestones[index - 1].targetProgress)
          
          return (
            <div key={milestone.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div className={`flex-1 h-0.5 ${milestones[index - 1].completedAt || currentProgress >= milestones[index - 1].targetProgress ? 'bg-accent' : 'bg-border'}`} />
                )}
                <div className="flex-shrink-0 mx-2">
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-accent" />
                  ) : (
                    <Circle className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                  )}
                </div>
                {index < milestones.length - 1 && (
                  <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-accent' : 'bg-border'}`} />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${isCompleted ? 'text-text' : isActive ? 'text-primary' : 'text-text-muted'}`}>
                  {milestone.name}
                </p>
                <p className="text-xs text-text-muted">{milestone.targetProgress}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}