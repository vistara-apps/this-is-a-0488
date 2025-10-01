import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  ExternalLink, 
  Clock, 
  User, 
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  Settings
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { MilestoneTimeline } from '../components/features/MilestoneTimeline';
import { QuickUpdateSlider } from '../components/features/QuickUpdateSlider';
import { EmbedCodeModal } from '../components/features/EmbeddableWidget';
import { useProjects } from '../hooks/useProjects';
import { useToast } from '../components/ui/Toast';
import { mockUsers } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getProjectById, 
    getProjectMilestones, 
    getProjectUpdates, 
    updateProjectProgress 
  } = useProjects();
  const { showToast, ToastContainer } = useToast();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  const project = id ? getProjectById(id) : null;
  const milestones = id ? getProjectMilestones(id) : [];
  const updates = id ? getProjectUpdates(id) : [];
  const users = mockUsers;

  if (!project) {
    return (
      <AppShell variant="dashboard">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-text mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </AppShell>
    );
  }

  const owner = users.find(u => u.id === project.ownerId);
  const client = project.clientId ? users.find(u => u.id === project.clientId) : undefined;

  const handleUpdateProgress = (progress: number, note?: string) => {
    updateProjectProgress(project.id, progress, note);
    showToast('Progress updated successfully!', 'success');
  };

  const statusColors = {
    active: 'bg-accent text-white',
    paused: 'bg-warning text-white',
    completed: 'bg-accent text-white',
  };

  const nextMilestone = milestones.find(m => 
    !m.completedAt && project.currentProgress < m.targetProgress
  );

  return (
    <AppShell variant="dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                icon={ArrowLeft}
                onClick={() => navigate('/dashboard')}
                className="p-2"
              />
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-text">{project.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <p className="text-text-muted text-lg mb-6">{project.description}</p>
            
            {/* Project Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {owner && (
                <div className="flex items-center gap-2 text-text-muted">
                  <User size={16} />
                  <span>Owner: {owner.name}</span>
                </div>
              )}
              {client && (
                <div className="flex items-center gap-2 text-text-muted">
                  <User size={16} />
                  <span>Client: {client.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-text-muted">
                <Calendar size={16} />
                <span>Started: {project.startDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Clock size={16} />
                <span>Due: {project.estimatedEndDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              icon={ExternalLink}
              onClick={() => setIsEmbedModalOpen(true)}
            >
              Embed Widget
            </Button>
            <Button
              icon={Edit3}
              onClick={() => setIsUpdateModalOpen(true)}
            >
              Update Progress
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text">Current Progress</h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-text">{Math.round(project.currentProgress)}%</div>
                    <div className="text-sm text-text-muted">
                      Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ProgressBar
                  progress={project.currentProgress}
                  variant="default"
                  showPercentage={false}
                  colors={project.brandingColors}
                  className="mb-4"
                />
                
                {nextMilestone && (
                  <div className="bg-bg-secondary p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Target size={16} className="text-primary" />
                      <span className="font-medium text-text">Next Milestone:</span>
                      <span className="text-text-muted">{nextMilestone.name} ({nextMilestone.targetProgress}%)</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-border rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, (project.currentProgress / nextMilestone.targetProgress) * 100)}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {Math.max(0, nextMilestone.targetProgress - project.currentProgress)}% remaining
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-text">Milestones</h2>
              </CardHeader>
              <CardContent>
                {milestones.length > 0 ? (
                  <MilestoneTimeline
                    milestones={milestones}
                    currentProgress={project.currentProgress}
                    variant="vertical"
                  />
                ) : (
                  <div className="text-center py-8 text-text-muted">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No milestones defined yet</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Add Milestones
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Updates */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-text">Recent Updates</h2>
              </CardHeader>
              <CardContent>
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.slice(0, 5).map(update => {
                      const updateUser = users.find(u => u.id === update.userId);
                      return (
                        <div key={update.id} className="border-l-2 border-accent pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-text">
                              {update.oldProgress}% → {update.newProgress}%
                            </span>
                            <span className="text-xs text-text-muted">
                              {formatDistanceToNow(update.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          {update.note && (
                            <p className="text-sm text-text-muted mb-2">{update.note}</p>
                          )}
                          {updateUser && (
                            <div className="flex items-center gap-1 text-xs text-text-muted">
                              <User size={12} />
                              <span>{updateUser.name}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {updates.length > 5 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All Updates
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-muted">
                    <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No updates yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => setIsUpdateModalOpen(true)}
                    >
                      Add First Update
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Update Modal */}
      <QuickUpdateSlider
        project={project}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdateProgress}
      />

      {/* Embed Code Modal */}
      <EmbedCodeModal
        project={project}
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />

      <ToastContainer />
    </AppShell>
  );
}