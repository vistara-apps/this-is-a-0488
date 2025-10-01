import React from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, MoreVertical, Clock, User } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import ProgressBar from './ProgressBar'

export default function ProjectCard({ project, variant = 'list', showActions = true }) {
  const statusColors = {
    active: 'bg-accent text-white',
    paused: 'bg-warning text-white',
    completed: 'bg-text-muted text-white'
  }

  if (variant === 'kanban') {
    return (
      <div className="bg-surface rounded-lg border border-border shadow-card hover:shadow-hover transition-shadow">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-medium text-text line-clamp-2">{project.name}</h3>
            {showActions && (
              <button className="text-text-muted hover:text-text">
                <MoreVertical className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <ProgressBar progress={project.currentProgress} size="small" className="mb-3" />
          
          <div className="space-y-2">
            <div className="flex items-center text-xs text-text-muted">
              <Clock className="h-3 w-3 mr-1" />
              Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </div>
            
            {project.clientEmail && (
              <div className="flex items-center text-xs text-text-muted">
                <User className="h-3 w-3 mr-1" />
                {project.clientEmail}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${statusColors[project.status]}`}>
                {project.status}
              </span>
              <Link
                to={`/projects/${project.id}`}
                className="text-primary hover:text-primary-hover text-xs font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // List variant
  return (
    <div className="bg-surface rounded-lg border border-border shadow-card hover:shadow-hover transition-shadow">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0 mb-4 sm:mb-0 sm:mr-6">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-medium text-text">{project.name}</h3>
              <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${statusColors[project.status]}`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-text-muted text-sm mb-3 line-clamp-2">{project.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-xs text-text-muted">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
              </div>
              
              {project.clientEmail && (
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {project.clientEmail}
                </div>
              )}
              
              <div>
                Due {format(new Date(project.estimatedEndDate), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:items-end space-y-3">
            <div className="w-full sm:w-48">
              <ProgressBar progress={project.currentProgress} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                to={`/projects/${project.id}`}
                className="px-3 py-1.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Manage
              </Link>
              
              {project.publicWidgetEnabled && (
                <a
                  href={`/widget/${project.publicWidgetSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-text-muted hover:text-text transition-colors"
                  title="View Public Widget"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              
              {showActions && (
                <button className="p-1.5 text-text-muted hover:text-text transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}