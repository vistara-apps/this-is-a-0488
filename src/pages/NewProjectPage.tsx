import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Target } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useProjects } from '../hooks/useProjects';
import { useToast } from '../components/ui/Toast';
import { Project } from '../types';

export function NewProjectPage() {
  const navigate = useNavigate();
  const { createProject, addMilestone } = useProjects();
  const { showToast, ToastContainer } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientEmail: '',
    estimatedEndDate: '',
    brandingColors: {
      primary: '#3b82f6',
      accent: '#10b981',
    },
  });

  const [milestones, setMilestones] = useState([
    { name: 'Planning Complete', targetProgress: 25 },
    { name: 'Development Phase', targetProgress: 50 },
    { name: 'Testing & QA', targetProgress: 75 },
    { name: 'Launch Ready', targetProgress: 100 },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorChange = (type: 'primary' | 'accent', color: string) => {
    setFormData(prev => ({
      ...prev,
      brandingColors: {
        ...prev.brandingColors,
        [type]: color,
      },
    }));
  };

  const addMilestoneRow = () => {
    setMilestones(prev => [...prev, { name: '', targetProgress: 50 }]);
  };

  const updateMilestone = (index: number, field: 'name' | 'targetProgress', value: string | number) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ));
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast('Project name is required', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Create project
      const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        currentProgress: 0,
        status: 'active',
        startDate: new Date(),
        estimatedEndDate: formData.estimatedEndDate 
          ? new Date(formData.estimatedEndDate)
          : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        ownerId: '1', // Mock current user
        clientId: formData.clientEmail ? '2' : undefined, // Mock client assignment
        brandingColors: formData.brandingColors,
        publicWidgetEnabled: true,
        publicWidgetSlug: generateSlug(formData.name) + '-' + Date.now(),
      };

      const newProject = createProject(projectData);

      // Add milestones
      const validMilestones = milestones.filter(m => m.name.trim());
      for (let i = 0; i < validMilestones.length; i++) {
        const milestone = validMilestones[i];
        addMilestone({
          projectId: newProject.id,
          name: milestone.name.trim(),
          targetProgress: milestone.targetProgress,
          notificationSent: false,
          order: i + 1,
        });
      }

      showToast('Project created successfully!', 'success');
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      showToast('Failed to create project', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell variant="dashboard">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/dashboard')}
            className="p-2"
          />
          <div>
            <h1 className="text-3xl font-bold text-text">Create New Project</h1>
            <p className="text-text-muted mt-1">Set up progress tracking for your next project</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-text">Project Details</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Website Redesign, Mobile App Development"
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Briefly describe what this project involves"
                  className="w-full p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Client Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="client@company.com"
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Client will receive milestone notifications
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Estimated End Date
                  </label>
                  <input
                    type="date"
                    value={formData.estimatedEndDate}
                    onChange={(e) => handleInputChange('estimatedEndDate', e.target.value)}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-text">Widget Branding</h2>
              <p className="text-text-muted">Customize the appearance of your progress widget</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.brandingColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-12 h-12 border border-border rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.brandingColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Accent Color (Progress Bar)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.brandingColors.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-12 h-12 border border-border rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.brandingColors.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="flex-1 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-text">Milestones</h2>
                  <p className="text-text-muted">Define key checkpoints for automated notifications</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={addMilestoneRow}
                >
                  Add Milestone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                        placeholder="Milestone name"
                        className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={milestone.targetProgress}
                          onChange={(e) => updateMilestone(index, 'targetProgress', parseInt(e.target.value) || 0)}
                          className="w-full p-3 pr-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted">%</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                      className="text-error hover:bg-error hover:bg-opacity-10"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                {milestones.length === 0 && (
                  <div className="text-center py-8 text-text-muted">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No milestones added yet</p>
                    <p className="text-sm">Add milestones to enable automated notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1"
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </AppShell>
  );
}