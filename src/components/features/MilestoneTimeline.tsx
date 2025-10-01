import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Milestone } from '../../types';

interface MilestoneTimelineProps {
  milestones: Milestone[];
  currentProgress: number;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export function MilestoneTimeline({
  milestones,
  currentProgress,
  variant = 'horizontal',
  className = '',
}: MilestoneTimelineProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);

  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {sortedMilestones.map((milestone, index) => {
          const isCompleted = milestone.completedAt || currentProgress >= milestone.targetProgress;
          const isNext = !isCompleted && (index === 0 || sortedMilestones[index - 1].completedAt || currentProgress >= sortedMilestones[index - 1].targetProgress);
          
          return (
            <div key={milestone.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-accent" />
                ) : (
                  <Circle className={`w-5 h-5 ${isNext ? 'text-primary' : 'text-text-muted'}`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isCompleted ? 'text-accent' : isNext ? 'text-primary' : 'text-text-muted'}`}>
                  {milestone.name}
                </p>
                <p className="text-xs text-text-muted">
                  {milestone.targetProgress}% target
                  {milestone.completedAt && (
                    <span className="ml-2">
                      • Completed {milestone.completedAt.toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 ${className}`}>
      {sortedMilestones.map((milestone, index) => {
        const isCompleted = milestone.completedAt || currentProgress >= milestone.targetProgress;
        const isNext = !isCompleted && (index === 0 || sortedMilestones[index - 1].completedAt || currentProgress >= sortedMilestones[index - 1].targetProgress);
        
        return (
          <React.Fragment key={milestone.id}>
            <div className="flex flex-col items-center min-w-0 flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-accent" />
                ) : (
                  <Circle className={`w-5 h-5 ${isNext ? 'text-primary' : 'text-text-muted'}`} />
                )}
              </div>
              
              <div className="text-center">
                <p className={`text-xs font-medium ${isCompleted ? 'text-accent' : isNext ? 'text-primary' : 'text-text-muted'}`}>
                  {milestone.name}
                </p>
                <p className="text-xs text-text-muted">
                  {milestone.targetProgress}%
                </p>
              </div>
            </div>
            
            {index < sortedMilestones.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-accent' : 'bg-border'} min-w-8`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}