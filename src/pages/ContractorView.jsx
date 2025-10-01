import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, MessageSquare, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useData } from '../context/DataContext'
import { useNotifications } from '../context/NotificationContext'
import ProgressSlider from '../components/ProgressSlider'
import MilestoneTimeline from '../components/MilestoneTimeline'

export default function ContractorView() {
  const { projectId } = useParams()
  const { projects, getProjectMilestones, updateProgress } = useData()
  const { showNotification } = useNotifications()
  
  const [newProgress, setNewProgress] = useState(0)
  const [updateNote, setUpdateNote] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const project = projects.find(p => p.id === projectId)
  const milestones = getProjectMilestones(projectId)

  React.useEffect(() => {
    if (project) {
      setNewProgress(project.currentProgress)
    }
  }, [project])

  if (!project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-2">Project Not Found</h1>
          <p className="text-text-muted">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const handleUpdateProgress = async () => {
    if (newProgress === project.currentProgress && !updateNote.trim()) {
      showNotification('No changes to save', 'info')
      return
    }

    setIsUpdating(true)
    try {
      await updateProgress(projectId, newProgress, updateNote.trim() || null)
      showNotification('Progress updated successfully!', 'success')
      setUpdateNote('')
    } catch (error) {
      showNotification('Failed to update progress', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const completedMilestones = milestones.filter(m => m.completedAt).length
  const daysSinceUpdate = Math.floor((new Date() - new Date(project.updatedAt)) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">{project.name}</h1>
          <p className="text-text-muted">Update your progress below</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface rounded-lg border border-border p-4 text-center">
            <p className="text-2xl font-bold text-text">{project.currentProgress}%</p>
            <p className="text-xs text-text-muted">Current Progress</p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4 text-center">
            <p className="text-2xl font-bold text-text">{completedMilestones}</p>
            <p className="text-xs text-text-muted">Milestones Done</p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4 text-center sm:col-span-1 col-span-2">
            <p className="text-2xl font-bold text-text">{daysSinceUpdate}</p>
            <p className="text-xs text-text-muted">Days Since Update</p>
          </div>
        </div>

        {/* Progress Update Section */}
        <div className="bg-surface rounded-lg border border-border shadow-card p-6 mb-8">
          <h2 className="text-lg font-medium text-text mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-accent" />
            Update Progress
          </h2>

          <div className="mb-6">
            <ProgressSlider
              value={newProgress}
              onChange={setNewProgress}
              disabled={isUpdating}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">
              <MessageSquare className="h-4 w-4 inline mr-1" />
              Progress Note (Optional)
            </label>
            <textarea
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              placeholder="What did you accomplish? Any blockers?"
              rows={3}
              disabled={isUpdating}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-text-muted mt-1">
              This note will be visible to the client and project manager.
            </p>
          </div>

          <button
            onClick={handleUpdateProgress}
            disabled={isUpdating}
            className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isUpdating ? 'Updating...' : 'Save Progress Update'}
          </button>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="bg-surface rounded-lg border border-border shadow-card p-6 mb-8">
            <h2 className="text-lg font-medium text-text mb-4">Project Milestones</h2>
            <MilestoneTimeline milestones={milestones} currentProgress={newProgress} variant="vertical" />
          </div>
        )}

        {/* Project Info */}
        <div className="bg-surface rounded-lg border border-border shadow-card p-6">
          <h2 className="text-lg font-medium text-text mb-4">Project Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Status:</span>
              <span className="px-2 py-1 bg-accent text-white rounded text-xs font-medium capitalize">
                {project.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Due Date:</span>
              <span className="text-text">{new Date(project.estimatedEndDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Last Updated:</span>
              <span className="text-text">
                {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Reminder */}
        {daysSinceUpdate > 1 && (
          <div className="mt-6 p-4 bg-warning bg-opacity-10 border border-warning rounded-lg">
            <p className="text-sm text-warning font-medium">
              💡 Reminder: It's been {daysSinceUpdate} days since your last update. 
              Regular updates help keep everyone in the loop!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}