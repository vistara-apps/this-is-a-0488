import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Copy, Edit3, Clock, BarChart3 } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useData } from '../context/DataContext'
import { useNotifications } from '../context/NotificationContext'
import ProgressBar from '../components/ProgressBar'
import ProgressSlider from '../components/ProgressSlider'
import MilestoneTimeline from '../components/MilestoneTimeline'

export default function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, getProjectMilestones, getProjectUpdates, updateProgress } = useData()
  const { showNotification } = useNotifications()
  
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newProgress, setNewProgress] = useState(0)
  const [updateNote, setUpdateNote] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const project = projects.find(p => p.id === projectId)
  const milestones = getProjectMilestones(projectId)
  const updates = getProjectUpdates(projectId)

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-2">Project Not Found</h1>
          <p className="text-text-muted mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleUpdateProgress = async () => {
    setIsUpdating(true)
    try {
      await updateProgress(projectId, newProgress, updateNote.trim() || null)
      showNotification('Progress updated successfully!', 'success')
      setShowUpdateModal(false)
      setUpdateNote('')
    } catch (error) {
      showNotification('Failed to update progress', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const openUpdateModal = () => {
    setNewProgress(project.currentProgress)
    setShowUpdateModal(true)
  }

  const copyWidgetCode = () => {
    const code = `<iframe src="${window.location.origin}/widget/${project.publicWidgetSlug}" width="400" height="300" frameborder="0"></iframe>`
    navigator.clipboard.writeText(code)
    showNotification('Widget code copied to clipboard!', 'success')
  }

  const copyWidgetLink = () => {
    const link = `${window.location.origin}/widget/${project.publicWidgetSlug}`
    navigator.clipboard.writeText(link)
    showNotification('Widget link copied to clipboard!', 'success')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-text-muted" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text">{project.name}</h1>
          <p className="text-text-muted mt-1">{project.description}</p>
        </div>
        <button
          onClick={openUpdateModal}
          className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Update Progress
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Overview */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium text-text mb-4">Progress Overview</h2>
            
            <div className="mb-6">
              <ProgressBar progress={project.currentProgress} size="large" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-text">{project.currentProgress}%</p>
                <p className="text-xs text-text-muted">Complete</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">
                  {milestones.filter(m => m.completedAt).length}
                </p>
                <p className="text-xs text-text-muted">Milestones</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{updates.length}</p>
                <p className="text-xs text-text-muted">Updates</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">
                  {Math.max(0, Math.ceil((new Date(project.estimatedEndDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                </p>
                <p className="text-xs text-text-muted">Days Left</p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium text-text mb-4">Project Milestones</h2>
            <MilestoneTimeline milestones={milestones} currentProgress={project.currentProgress} variant="vertical" />
          </div>

          {/* Recent Updates */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium text-text mb-4">Recent Updates</h2>
            
            {updates.length === 0 ? (
              <p className="text-text-muted text-center py-8">No updates yet. Click "Update Progress" to add the first update.</p>
            ) : (
              <div className="space-y-4">
                {updates.slice(0, 10).map(update => (
                  <div key={update.id} className="flex items-start space-x-3 p-4 bg-bg-secondary rounded-lg">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text">
                        Progress updated from <span className="font-medium">{update.oldProgress}%</span> to{' '}
                        <span className="font-medium">{update.newProgress}%</span>
                      </p>
                      {update.note && (
                        <p className="text-sm text-text-muted mt-1">"{update.note}"</p>
                      )}
                      <p className="text-xs text-text-muted mt-2">
                        {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h3 className="font-medium text-text mb-4">Project Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-text-muted">Status:</span>
                <span className="ml-2 px-2 py-1 bg-accent text-white rounded text-xs font-medium capitalize">
                  {project.status}
                </span>
              </div>
              <div>
                <span className="text-text-muted">Start Date:</span>
                <span className="ml-2 text-text">{format(new Date(project.startDate), 'MMM d, yyyy')}</span>
              </div>
              <div>
                <span className="text-text-muted">Due Date:</span>
                <span className="ml-2 text-text">{format(new Date(project.estimatedEndDate), 'MMM d, yyyy')}</span>
              </div>
              {project.clientEmail && (
                <div>
                  <span className="text-text-muted">Client:</span>
                  <span className="ml-2 text-text">{project.clientEmail}</span>
                </div>
              )}
              <div>
                <span className="text-text-muted">Last Updated:</span>
                <span className="ml-2 text-text">
                  {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          {/* Widget Embedding */}
          {project.publicWidgetEnabled && (
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="font-medium text-text mb-4">Share Progress Widget</h3>
              <div className="space-y-3">
                <button
                  onClick={copyWidgetLink}
                  className="w-full flex items-center justify-center px-3 py-2 border border-border rounded-lg hover:bg-surface-hover transition-colors text-sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Widget Link
                </button>
                <button
                  onClick={copyWidgetCode}
                  className="w-full flex items-center justify-center px-3 py-2 border border-border rounded-lg hover:bg-surface-hover transition-colors text-sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Embed Code
                </button>
                <a
                  href={`/widget/${project.publicWidgetSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Widget
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Progress Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-hover max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-text mb-4">Update Progress</h3>
              
              <div className="mb-6">
                <ProgressSlider
                  value={newProgress}
                  onChange={setNewProgress}
                  disabled={isUpdating}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-2">
                  Update Note (Optional)
                </label>
                <textarea
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="Brief note about this update..."
                  rows={3}
                  disabled={isUpdating}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 border border-border text-text rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProgress}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Progress'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}