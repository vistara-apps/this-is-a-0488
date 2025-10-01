import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const DataContext = createContext()

// Mock user data
const mockUser = {
  id: 'user-1',
  email: 'demo@livetrack.com',
  name: 'Demo User',
  role: 'admin',
  subscriptionTier: 'pro',
  avatarUrl: null,
  createdAt: new Date().toISOString()
}

// Utility function to generate UUID (simple implementation)
function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Sample data
const sampleProjects = [
  {
    id: generateId(),
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    currentProgress: 75,
    status: 'active',
    startDate: '2024-01-01',
    estimatedEndDate: '2024-02-15',
    ownerId: 'user-1',
    clientId: 'client-1',
    clientEmail: 'client@company.com',
    brandingColors: { primary: '#3b82f6', accent: '#10b981' },
    publicWidgetEnabled: true,
    publicWidgetSlug: 'website-redesign-demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Mobile App Development',
    description: 'iOS and Android app for customer portal',
    currentProgress: 45,
    status: 'active',
    startDate: '2024-01-15',
    estimatedEndDate: '2024-03-30',
    ownerId: 'user-1',
    clientId: 'client-2',
    clientEmail: 'startup@example.com',
    brandingColors: { primary: '#8b5cf6', accent: '#f59e0b' },
    publicWidgetEnabled: true,
    publicWidgetSlug: 'mobile-app-demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const sampleMilestones = [
  { id: generateId(), projectId: sampleProjects[0].id, name: 'Design Complete', targetProgress: 25, completedAt: new Date('2024-01-08').toISOString(), notificationSent: true, order: 1 },
  { id: generateId(), projectId: sampleProjects[0].id, name: 'Frontend Development', targetProgress: 50, completedAt: new Date('2024-01-20').toISOString(), notificationSent: true, order: 2 },
  { id: generateId(), projectId: sampleProjects[0].id, name: 'Backend Integration', targetProgress: 75, completedAt: new Date().toISOString(), notificationSent: true, order: 3 },
  { id: generateId(), projectId: sampleProjects[0].id, name: 'Testing & Launch', targetProgress: 100, completedAt: null, notificationSent: false, order: 4 },
  
  { id: generateId(), projectId: sampleProjects[1].id, name: 'Requirements Analysis', targetProgress: 20, completedAt: new Date('2024-01-18').toISOString(), notificationSent: true, order: 1 },
  { id: generateId(), projectId: sampleProjects[1].id, name: 'UI/UX Design', targetProgress: 40, completedAt: new Date('2024-01-25').toISOString(), notificationSent: true, order: 2 },
  { id: generateId(), projectId: sampleProjects[1].id, name: 'Core Development', targetProgress: 70, completedAt: null, notificationSent: false, order: 3 },
  { id: generateId(), projectId: sampleProjects[1].id, name: 'App Store Submission', targetProgress: 100, completedAt: null, notificationSent: false, order: 4 }
]

export function DataProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('livetrack-projects')
    return saved ? JSON.parse(saved) : sampleProjects
  })
  
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('livetrack-milestones')
    return saved ? JSON.parse(saved) : sampleMilestones
  })
  
  const [progressUpdates, setProgressUpdates] = useState(() => {
    const saved = localStorage.getItem('livetrack-updates')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('livetrack-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('livetrack-milestones', JSON.stringify(milestones))
  }, [milestones])

  useEffect(() => {
    localStorage.setItem('livetrack-updates', JSON.stringify(progressUpdates))
  }, [progressUpdates])

  const createProject = (projectData) => {
    const newProject = {
      id: generateId(),
      ...projectData,
      currentProgress: 0,
      status: 'active',
      ownerId: mockUser.id,
      publicWidgetSlug: projectData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setProjects(prev => [...prev, newProject])
    return newProject
  }

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    ))
  }

  const updateProgress = (projectId, newProgress, note = null) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    const update = {
      id: generateId(),
      projectId,
      userId: mockUser.id,
      oldProgress: project.currentProgress,
      newProgress,
      note,
      createdAt: new Date().toISOString()
    }

    setProgressUpdates(prev => [...prev, update])
    updateProject(projectId, { currentProgress: newProgress })

    // Check for milestone completions
    const projectMilestones = milestones.filter(m => m.projectId === projectId)
    projectMilestones.forEach(milestone => {
      if (newProgress >= milestone.targetProgress && !milestone.completedAt) {
        setMilestones(prev => prev.map(m =>
          m.id === milestone.id
            ? { ...m, completedAt: new Date().toISOString(), notificationSent: true }
            : m
        ))
      }
    })
  }

  const getProjectBySlug = (slug) => {
    return projects.find(p => p.publicWidgetSlug === slug)
  }

  const getProjectMilestones = (projectId) => {
    return milestones.filter(m => m.projectId === projectId).sort((a, b) => a.order - b.order)
  }

  const getProjectUpdates = (projectId) => {
    return progressUpdates.filter(u => u.projectId === projectId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const value = {
    user: mockUser,
    projects,
    milestones,
    progressUpdates,
    createProject,
    updateProject,
    updateProgress,
    getProjectBySlug,
    getProjectMilestones,
    getProjectUpdates
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}