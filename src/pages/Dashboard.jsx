import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Filter, LayoutGrid, List, Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import ProjectCard from '../components/ProjectCard'

export default function Dashboard() {
  const { projects } = useData()
  const [viewMode, setViewMode] = useState('list')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.clientEmail && project.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.currentProgress, 0) / projects.length)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Project Dashboard</h1>
          <p className="text-text-muted mt-1">
            Track progress across {activeProjects} active projects
          </p>
        </div>
        
        <Link
          to="/projects/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-text-muted text-sm font-medium">Active Projects</h3>
          <p className="text-3xl font-bold text-text mt-2">{activeProjects}</p>
        </div>
        
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-text-muted text-sm font-medium">Average Progress</h3>
          <p className="text-3xl font-bold text-text mt-2">{totalProgress}%</p>
        </div>
        
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-text-muted text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold text-text mt-2">{projects.length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-bg-secondary rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-text mb-2">No projects found</h3>
          <p className="text-text-muted mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first project to get started with LiveTrack.'
            }
          </p>
          <Link
            to="/projects/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              variant={viewMode === 'grid' ? 'kanban' : 'list'} 
            />
          ))}
        </div>
      )}
    </div>
  )
}