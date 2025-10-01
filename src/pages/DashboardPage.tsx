import React, { useState } from 'react';
import { Plus, Filter, Search, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { ProjectCard } from '../components/features/ProjectCard';
import { QuickUpdateSlider } from '../components/features/QuickUpdateSlider';
import { EmbedCodeModal } from '../components/features/EmbeddableWidget';
import { useProjects } from '../hooks/useProjects';
import { useToast } from '../components/ui/Toast';
import { mockUsers } from '../data/mockData';

export function DashboardPage() {
  const navigate = useNavigate();
  const { projects, updateProjectProgress, getProjectMilestones } = useProjects();
  const { showToast, ToastContainer } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'completed'>('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  // Get mock users for display
  const users = mockUsers;

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate dashboard stats
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.currentProgress, 0) / projects.length)
    : 0;
  const projectsNeedingAttention = projects.filter(p => {
    const hoursSinceUpdate = (Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60);
    return p.status === 'active' && hoursSinceUpdate > 48;
  }).length;

  const handleQuickUpdate = (projectId: string) => {
    setSelectedProject(projectId);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateProgress = (progress: number, note?: string) => {
    if (selectedProject) {
      updateProjectProgress(selectedProject, progress, note);
      showToast('Progress updated successfully!', 'success');
    }
  };

  const handleViewWidget = (projectId: string) => {
    setSelectedProject(projectId);
    setIsEmbedModalOpen(true);
  };

  const selectedProjectData = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  return (
    <AppShell variant="dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Dashboard</h1>
            <p className="text-text-muted mt-1">Track all your projects in real-time</p>
          </div>
          
          <Link to="/projects/new">
            <Button icon={Plus} className="w-full lg:w-auto">
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                  <div className="w-4 h-4 bg-primary rounded" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-text">{activeProjects}</p>
                  <p className="text-sm text-text-muted">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent bg-opacity-10 rounded-lg">
                  <div className="w-4 h-4 bg-accent rounded" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-text">{completedProjects}</p>
                  <p className="text-sm text-text-muted">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-warning bg-opacity-10 rounded-lg">
                  <div className="w-4 h-4 bg-warning rounded" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-text">{averageProgress}%</p>
                  <p className="text-sm text-text-muted">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-error bg-opacity-10 rounded-lg">
                  <div className="w-4 h-4 bg-error rounded" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-text">{projectsNeedingAttention}</p>
                  <p className="text-sm text-text-muted">Need Attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              Projects ({filteredProjects.length})
            </h2>
          </div>
          
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    {searchTerm || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
                  </h3>
                  <p className="text-text-muted mb-6">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Create your first project to start tracking progress.'
                    }
                  </p>
                  <Link to="/projects/new">
                    <Button icon={Plus}>Create Project</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map(project => {
                const owner = users.find(u => u.id === project.ownerId);
                const client = project.clientId ? users.find(u => u.id === project.clientId) : undefined;
                
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    owner={owner}
                    client={client}
                    variant="list"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    onEdit={() => handleQuickUpdate(project.id)}
                    onViewWidget={() => handleViewWidget(project.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Update Modal */}
      {selectedProjectData && (
        <QuickUpdateSlider
          project={selectedProjectData}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedProject(null);
          }}
          onUpdate={handleUpdateProgress}
        />
      )}

      {/* Embed Code Modal */}
      {selectedProjectData && (
        <EmbedCodeModal
          project={selectedProjectData}
          isOpen={isEmbedModalOpen}
          onClose={() => {
            setIsEmbedModalOpen(false);
            setSelectedProject(null);
          }}
        />
      )}

      <ToastContainer />
    </AppShell>
  );
}