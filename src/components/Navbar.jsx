import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Plus, User } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Navbar() {
  const location = useLocation()
  const { user } = useData()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-text">LiveTrack</span>
          </Link>

          {/* Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text hover:bg-surface-hover'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/projects/new"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-text">{user.name}</p>
              <p className="text-xs text-text-muted capitalize">{user.subscriptionTier} Plan</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden border-t border-border">
        <div className="px-4 py-2 flex justify-center space-x-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'bg-primary text-white'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/projects/new"
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}