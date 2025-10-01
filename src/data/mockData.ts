import { User, Project, Milestone, ProgressUpdate } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@agency.com',
    name: 'John Smith',
    role: 'admin',
    subscriptionTier: 'pro',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'sarah@client.com',
    name: 'Sarah Johnson',
    role: 'client',
    subscriptionTier: 'free',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    email: 'mike@contractor.com',
    name: 'Mike Wilson',
    role: 'contributor',
    subscriptionTier: 'free',
    createdAt: new Date('2024-02-01'),
  },
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete redesign of corporate website with new branding',
    currentProgress: 75,
    status: 'active',
    startDate: new Date('2024-01-01'),
    estimatedEndDate: new Date('2024-03-01'),
    ownerId: '1',
    clientId: '2',
    brandingColors: {
      primary: '#3b82f6',
      accent: '#10b981',
    },
    publicWidgetEnabled: true,
    publicWidgetSlug: 'website-redesign-2024',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'proj-2',
    name: 'Mobile App Development',
    description: 'iOS and Android app for customer portal',
    currentProgress: 45,
    status: 'active',
    startDate: new Date('2024-02-01'),
    estimatedEndDate: new Date('2024-06-01'),
    ownerId: '1',
    clientId: '2',
    brandingColors: {
      primary: '#8b5cf6',
      accent: '#f59e0b',
    },
    publicWidgetEnabled: true,
    publicWidgetSlug: 'mobile-app-dev-2024',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  {
    id: 'proj-3',
    name: 'E-commerce Integration',
    description: 'Shopify integration with existing systems',
    currentProgress: 90,
    status: 'active',
    startDate: new Date('2024-01-15'),
    estimatedEndDate: new Date('2024-02-15'),
    ownerId: '3',
    clientId: '2',
    brandingColors: {
      primary: '#ef4444',
      accent: '#06b6d4',
    },
    publicWidgetEnabled: true,
    publicWidgetSlug: 'ecommerce-integration-2024',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
];

export const mockMilestones: Milestone[] = [
  // Website Redesign milestones
  {
    id: 'mile-1',
    projectId: 'proj-1',
    name: 'Design Wireframes',
    targetProgress: 25,
    completedAt: new Date('2024-01-15'),
    notificationSent: true,
    order: 1,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'mile-2',
    projectId: 'proj-1',
    name: 'Visual Design',
    targetProgress: 50,
    completedAt: new Date('2024-02-01'),
    notificationSent: true,
    order: 2,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'mile-3',
    projectId: 'proj-1',
    name: 'Development',
    targetProgress: 80,
    notificationSent: false,
    order: 3,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'mile-4',
    projectId: 'proj-1',
    name: 'Launch',
    targetProgress: 100,
    notificationSent: false,
    order: 4,
    createdAt: new Date('2024-01-01'),
  },
  // Mobile App milestones
  {
    id: 'mile-5',
    projectId: 'proj-2',
    name: 'MVP Features',
    targetProgress: 40,
    notificationSent: false,
    order: 1,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'mile-6',
    projectId: 'proj-2',
    name: 'Testing Phase',
    targetProgress: 70,
    notificationSent: false,
    order: 2,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'mile-7',
    projectId: 'proj-2',
    name: 'App Store Submission',
    targetProgress: 100,
    notificationSent: false,
    order: 3,
    createdAt: new Date('2024-02-01'),
  },
];

export const mockProgressUpdates: ProgressUpdate[] = [
  {
    id: 'update-1',
    projectId: 'proj-1',
    userId: '1',
    oldProgress: 70,
    newProgress: 75,
    note: 'Completed responsive design for mobile',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'update-2',
    projectId: 'proj-2',
    userId: '1',
    oldProgress: 40,
    newProgress: 45,
    note: 'User authentication module completed',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: 'update-3',
    projectId: 'proj-3',
    userId: '3',
    oldProgress: 85,
    newProgress: 90,
    note: 'Payment processing integration finished',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
];