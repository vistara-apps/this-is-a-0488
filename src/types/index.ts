export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'contributor' | 'client';
  avatarUrl?: string;
  createdAt: Date;
  subscriptionTier: 'free' | 'pro' | 'team';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  currentProgress: number; // 0-100
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  estimatedEndDate: Date;
  ownerId: string;
  clientId?: string;
  brandingColors: {
    primary: string;
    accent: string;
  };
  publicWidgetEnabled: boolean;
  publicWidgetSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  targetProgress: number; // 0-100
  completedAt?: Date;
  notificationSent: boolean;
  order: number;
  createdAt: Date;
}

export interface ProgressUpdate {
  id: string;
  projectId: string;
  userId: string;
  oldProgress: number; // 0-100
  newProgress: number; // 0-100
  note?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  projectId: string;
  recipientEmail: string;
  type: 'milestone' | 'stalled' | 'completed';
  sentAt: Date;
  metadata: Record<string, any>;
}

export interface WidgetConfig {
  projectId: string;
  showLastUpdated: boolean;
  showMilestones: boolean;
  customColors?: {
    primary: string;
    accent: string;
  };
  autoRefresh: boolean;
  refreshInterval: number; // seconds
}