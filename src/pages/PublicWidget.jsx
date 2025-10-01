import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, CheckCircle, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useData } from '../context/DataContext'
import ProgressBar from '../components/ProgressBar'
import MilestoneTimeline from '../components/MilestoneTimeline'

export default function PublicWidget() {
  const { projectSlug } = useParams()
  const { getProjectBySlug, getProjectMilestones, getProjectUpdates } = useData()
  const [project, setProject] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    const loadProject = () => {
      const foundProject = getProjectBySlug(projectSlug)
      if (foundProject) {
        setProject(foundProject)
        setMilestones(getProjectMilestones(foundProject.id))
        const updates = getProjectUpdates(foundProject.id)
        setLastUpdate(updates[0] || null)
      }
    }

    loadProject()
    
    // Auto-refresh every 30 seconds to simulate real-time updates
    const interval = setInterval(loadProject, 30000)
    return () => clearInterval(interval)
  }, [projectSlug, getProjectBySlug, getProjectMilestones, getProjectUpdates])

  if (!project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-2">Project Not Found</h1>
          <p className="text-text-muted">The project widget you're looking for doesn't exist or has been disabled.</p>
        </div>
      </div>
    )
  }

  const customColors = project.brandingColors || { primary: '#3b82f6', accent: '#10b981' }

  return (
    <div className="min-h-screen bg-bg" style={{ '--custom-primary': customColors.primary, '--custom-accent': customColors.accent }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">{project.name}</h1>
          {project.description && (
            <p className="text-text-muted">{project.description}</p>
          )}
        </div>

        {/* Main Progress Display */}
        <div className="bg-surface rounded-lg border border-border shadow-widget p-6 sm:p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl sm:text-7xl font-bold mb-2" style={{ color: customColors.primary }}>
              {project.currentProgress}%
            </div>
            <p className="text-text-muted">Project Complete</p>
          </div>

          <ProgressBar 
            progress={project.currentProgress} 
            size="large" 
            className="mb-6"
          />

          <div className="flex items-center justify-center text-sm text-text-muted">
            <Clock className="h-4 w-4 mr-1" />
            Last updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </div>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="bg-surface rounded-lg border border-border shadow-widget p-6 mb-8">
            <h2 className="text-lg font-medium text-text mb-4">Project Milestones</h2>
            <MilestoneTimeline milestones={milestones} currentProgress={project.currentProgress} />
          </div>
        )}

        {/* Latest Update */}
        {lastUpdate && (
          <div className="bg-surface rounded-lg border border-border shadow-widget p-6 mb-8">
            <h2 className="text-lg font-medium text-text mb-4">Latest Update</h2>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 mt-0.5" style={{ color: customColors.accent }} />
              <div>
                <p className="text-text">
                  Progress updated to <span className="font-medium">{lastUpdate.newProgress}%</span>
                </p>
                {lastUpdate.note && (
                  <p className="text-text-muted mt-1">"{lastUpdate.note}"</p>
                )}
                <p className="text-sm text-text-muted mt-2">
                  {formatDistanceToNow(new Date(lastUpdate.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Project Status */}
        <div className="bg-surface rounded-lg border border-border shadow-widget p-6">
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p className="text-text-muted">Status</p>
              <p className="font-medium text-text capitalize">{project.status}</p>
            </div>
            <div>
              <p className="text-text-muted">Started</p>
              <p className="font-medium text-text">
                {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-xs text-text-muted">
            Powered by{' '}
            <a 
              href="/"
              className="hover:underline"
              style={{ color: customColors.primary }}
            >
              LiveTrack
            </a>
            {' '}• Updates automatically every 30 seconds
          </p>
        </div>
      </div>

      <style jsx>{`
        .bg-progress-bar {
          background-color: var(--custom-accent) !important;
        }
      `}</style>
    </div>
  )
}