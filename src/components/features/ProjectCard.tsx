import React from 'react';
import { MoreVertical, Clock, User, ExternalLink } from 'lucide-react';
import { Project, User as UserType } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  owner?: UserType;
  client?: UserType;
  variant?: 'list' | 'kanban';
  onEdit?: () => void;
  onViewWidget?: () => void;
  onClick?: () => void;
  className?: string;
}

export function ProjectCard({
  project,
  owner,
  client,
  variant = 'list',
  onEdit,
  onViewWidget,
  onClick,
  className = '',
}: ProjectCardProps) {
  const statusColors = {
    active: 'bg-accent text-white',
    paused: 'bg-warning text-white',
    completed: 'bg-accent text-white',
  };

  const timeSinceUpdate = formatDistanceToNow(project.updatedAt, { addSuffix: true });

  if (variant === 'kanban') {
    return (
      <Card 
        className={`${className}`} 
        hover={!!onClick}
        onClick={onClick}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text truncate">{project.name}</h3>
              <p className="text-sm text-text-muted mt-1 line-clamp-2">{project.description}</p>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
                {project.status}
              </span>
              <Button variant="ghost" size="sm" className="p-1" onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
                <MoreVertical size={14} />
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mb-4">
            <ProgressBar
              progress={project.currentProgress}
              variant="default"
              showPercentage={false}
              colors={project.brandingColors}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold text-text">{Math.round(project.currentProgress)}%</span>
              <span className="text-xs text-text-muted">
                <Clock size={12} className="inline mr-1" />
                {timeSinceUpdate}
              </span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-2">
              {owner && (
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{owner.name}</span>
                </div>
              )}
              {client && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>{client.name}</span>
                </div>
              )}
            </div>
            
            {onViewWidget && (
              <Button 
                variant="ghost" 
                size="sm" 
                icon={ExternalLink}
                className="p-1 text-xs"
                onClick={(e) => { e.stopPropagation(); onViewWidget(); }}
              >
                Widget
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`${className}`} 
      hover={!!onClick}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-text truncate">{project.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-sm text-text-muted mb-3 line-clamp-1">{project.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-text-muted">
              {owner && (
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{owner.name}</span>
                </div>
              )}
              {client && (
                <div className="flex items-center gap-1">
                  <span>Client: {client.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{timeSinceUpdate}</span>
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="w-48 flex-shrink-0">
            <ProgressBar
              progress={project.currentProgress}
              variant="minimal"
              showPercentage={false}
              colors={project.brandingColors}
              className="mb-1"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-text">{Math.round(project.currentProgress)}%</span>
              <span className="text-xs text-text-muted">complete</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onViewWidget && (
              <Button 
                variant="outline" 
                size="sm" 
                icon={ExternalLink}
                onClick={(e) => { e.stopPropagation(); onViewWidget(); }}
              >
                Widget
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              icon={MoreVertical}
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}