import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Mail, Palette } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useNotifications } from '../context/NotificationContext'

export default function CreateProject() {
  const navigate = useNavigate()
  const { createProject } = useData()
  const { showNotification } = useNotifications()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientEmail: '',
    estimatedEndDate: '',
    publicWidgetEnabled: true,
    brandingColors: {
      primary: '#3b82f6',
      accent: '#10b981'
    }
  })

  const [milestones, setMilestones] = useState([
    { name: 'Project Kickoff', targetProgress: 10 },
    { name: 'Design Complete', targetProgress: 30 },
    { name: 'Development Complete', targetProgress: 80 },
    { name: 'Testing & Launch', targetProgress: 100 }
  ])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleColorChange = (colorType, value) => {
    setFormData(prev => ({
      ...prev,
      brandingColors: {
        ...prev.brandingColors,
        [colorType]: value
      }
    }))
  }

  const handleMilestoneChange = (index, field, value) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ))
  }

  const addMilestone = () => {
    setMilestones(prev => [...prev, { name: '', targetProgress: 50 }])
  }

  const removeMilestone = (index) => {
    if (milestones.length > 1) {
      setMilestones(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showNotification('Project name is required', 'error')
      return
    }

    try {
      const project = createProject(formData)
      showNotification('Project created successfully!', 'success')
      navigate(`/projects/${project.id}`)
    } catch (error) {
      showNotification('Failed to create project', 'error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-text-muted" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-text">Create New Project</h1>
          <p className="text-text-muted mt-1">Set up a new project with progress tracking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-medium text-text mb-4">Project Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Website Redesign"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the project..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                placeholder="client@company.com"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Estimated End Date
              </label>
              <input
                type="date"
                name="estimatedEndDate"
                value={formData.estimatedEndDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Widget Settings */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-medium text-text mb-4">Widget Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="publicWidget"
                name="publicWidgetEnabled"
                checked={formData.publicWidgetEnabled}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <label htmlFor="publicWidget" className="text-sm text-text">
                Enable public widget (clients can view progress without login)
              </label>
            </div>

            {formData.publicWidgetEnabled && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <Palette className="h-4 w-4 inline mr-1" />
                  Widget Branding Colors
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Primary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.brandingColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-12 h-10 border border-border rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brandingColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Accent Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.brandingColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-12 h-10 border border-border rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brandingColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-text">Project Milestones</h2>
            <button
              type="button"
              onClick={addMilestone}
              className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Add Milestone
            </button>
          </div>
          
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                    placeholder="Milestone name"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={milestone.targetProgress}
                    onChange={(e) => handleMilestoneChange(index, 'targetProgress', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                  />
                </div>
                <span className="text-text-muted text-sm">%</span>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="p-2 text-error hover:bg-error hover:text-white rounded-lg transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-border text-text rounded-lg hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  )
}