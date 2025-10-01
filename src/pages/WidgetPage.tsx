import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmbeddableWidget } from '../components/features/EmbeddableWidget';
import { useProjects } from '../hooks/useProjects';

export function WidgetPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getProjectBySlug, getProjectMilestones } = useProjects();
  const [isLoading, setIsLoading] = useState(true);

  const project = slug ? getProjectBySlug(slug) : null;
  const milestones = project ? getProjectMilestones(project.id) : [];

  useEffect(() => {
    // Simulate loading delay for real-world API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-error bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Widget Not Found</h1>
          <p className="text-text-muted">
            The project widget you're looking for doesn't exist or has been disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <EmbeddableWidget
        project={project}
        milestones={milestones}
        showMilestones={true}
        showLastUpdated={true}
        autoRefresh={true}
        refreshInterval={30}
      />
    </div>
  );
}