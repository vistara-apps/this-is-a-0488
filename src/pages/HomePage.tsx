import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Clock, Bell, Users, Widget, TrendingUp } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { EmbeddableWidget } from '../components/features/EmbeddableWidget';
import { useProjects } from '../hooks/useProjects';

export function HomePage() {
  const { projects } = useProjects();
  const demoProject = projects[0]; // Use first project as demo

  const features = [
    {
      icon: Widget,
      title: 'Embeddable Progress Widget',
      description: 'Lightweight iframe that displays live progress with auto-refresh. Clients see 24/7 visibility without constant check-ins.',
      benefit: 'Save 3-5 hours/week on status updates',
    },
    {
      icon: Clock,
      title: '10-Second Progress Updates',
      description: 'Mobile-optimized interface: drag slider, add note, save. Updates propagate instantly to all embedded widgets.',
      benefit: 'Increase update frequency from weekly to daily',
    },
    {
      icon: Bell,
      title: 'Automated Milestone Notifications',
      description: 'Define milestones at project creation. Auto-send celebratory emails when progress crosses thresholds.',
      benefit: 'Reduce client inquiries by 70%',
    },
    {
      icon: TrendingUp,
      title: 'Live Rollup Dashboard',
      description: 'Manager view showing all projects with real-time progress bars, blockers, and last-update timestamps.',
      benefit: 'Replace 2-hour status meetings with 5-minute reviews',
    },
    {
      icon: Users,
      title: 'Contractor Accountability',
      description: 'Client-facing view for outsourced work with progress tracking and feedback without direct messaging.',
      benefit: 'Reduce micromanagement anxiety',
    },
    {
      icon: BarChart3,
      title: 'Progress Embedding API',
      description: 'REST API and webhooks for custom integrations. Perfect for agencies building white-label portals.',
      benefit: 'Unlock "progress as a service"',
    },
  ];

  return (
    <AppShell>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Real-time progress visibility for every project
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100">
                No updates, no chasing. LiveTrack provides embeddable progress widgets and automated notifications so clients see real-time status without constant check-ins.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/projects/new">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
                    Start Free Project
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Widget Demo */}
            <div className="flex justify-center lg:justify-end">
              <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
                {demoProject && (
                  <EmbeddableWidget 
                    project={demoProject}
                    showMilestones={true}
                    className="shadow-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
              Everything you need for progress transparency
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Eliminate status meetings, reduce client anxiety, and keep everyone aligned with real-time progress tracking.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-hover transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-text">{feature.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-muted mb-4">{feature.description}</p>
                    <div className="bg-accent bg-opacity-10 text-accent px-3 py-2 rounded-md text-sm font-medium">
                      {feature.benefit}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-muted mb-8">Trusted by agencies, freelancers, and service businesses</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {['Agency Pro', 'DevCorp', 'FreelanceHub', 'BuildCo'].map((company, index) => (
              <div key={index} className="text-lg font-semibold text-text">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to eliminate status meetings?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Start your first project for free. Upgrade to Pro for unlimited projects and custom branding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects/new">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
                Create Your First Project
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
              View Pricing
            </Button>
          </div>
          
          <p className="text-sm text-blue-200 mt-4">
            Free tier: 1 active project • Pro: $15/mo • Team: $49/mo
          </p>
        </div>
      </section>
    </AppShell>
  );
}