import React, { useState, useEffect } from 'react';
import { ExternalLink, Code, Eye } from 'lucide-react';
import { Project, Milestone } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { MilestoneTimeline } from './MilestoneTimeline';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface EmbeddableWidgetProps {
  project: Project;
  milestones?: Milestone[];
  showMilestones?: boolean;
  showLastUpdated?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // seconds
  className?: string;
}

export function EmbeddableWidget({
  project,
  milestones = [],
  showMilestones = true,
  showLastUpdated = true,
  autoRefresh = true,
  refreshInterval = 30,
  className = '',
}: EmbeddableWidgetProps) {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
        // In a real app, this would trigger a data refresh
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return (
    <div className={`bg-surface border border-border rounded-lg shadow-widget p-6 max-w-md w-full ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-text">{project.name}</h3>
        <p className="text-sm text-text-muted mt-1">{project.description}</p>
      </div>
      
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar
          progress={project.currentProgress}
          variant="widget"
          lastUpdated={project.updatedAt}
          colors={project.brandingColors}
        />
      </div>
      
      {/* Milestones */}
      {showMilestones && milestones.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-text mb-3">Milestones</h4>
          <MilestoneTimeline
            milestones={milestones}
            currentProgress={project.currentProgress}
            variant="vertical"
          />
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border">
        <div>
          {showLastUpdated && (
            <span>Last updated: {project.updatedAt.toLocaleTimeString()}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <a href="#" className="text-primary hover:underline font-medium">
            LiveTrack
          </a>
        </div>
      </div>
      
      {autoRefresh && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1 text-xs text-text-muted">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Auto-refreshing every {refreshInterval}s</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface EmbedCodeModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function EmbedCodeModal({ project, isOpen, onClose }: EmbedCodeModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'iframe' | 'script'>('preview');
  
  const baseUrl = window.location.origin;
  const widgetUrl = `${baseUrl}/widget/${project.publicWidgetSlug}`;
  
  const iframeCode = `<iframe 
  src="${widgetUrl}" 
  width="400" 
  height="300" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>`;

  const scriptCode = `<div id="livetrack-widget-${project.id}"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${widgetUrl}';
    iframe.width = '400';
    iframe.height = '300';
    iframe.frameBorder = '0';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    document.getElementById('livetrack-widget-${project.id}').appendChild(iframe);
  })();
</script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Embed Progress Widget"
      size="lg"
    >
      <div className="space-y-6">
        {/* Project Info */}
        <div className="p-4 bg-bg-secondary rounded-lg">
          <h3 className="font-semibold text-text">{project.name}</h3>
          <p className="text-sm text-text-muted mt-1">
            Widget URL: <code className="bg-white px-2 py-1 rounded text-primary">{widgetUrl}</code>
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'iframe', label: 'iframe Code', icon: Code },
              { id: 'script', label: 'Script Tag', icon: Code },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:text-text hover:border-border'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">
                This is how your widget will appear on your website:
              </p>
              <div className="flex justify-center p-8 bg-bg-secondary rounded-lg">
                <EmbeddableWidget project={project} />
              </div>
            </div>
          )}
          
          {activeTab === 'iframe' && (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">
                Copy and paste this iframe code into your website:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{iframeCode}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(iframeCode)}
                  className="absolute top-2 right-2"
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === 'script' && (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">
                For dynamic loading, use this script tag:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{scriptCode}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(scriptCode)}
                  className="absolute top-2 right-2"
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={ExternalLink}
            onClick={() => window.open(widgetUrl, '_blank')}
            className="flex-1"
          >
            Open Widget
          </Button>
          <Button
            onClick={onClose}
            className="flex-1"
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}