import { useState, useEffect } from 'react';
import { Project, ProgressUpdate, Milestone } from '../types';
import { mockProjects, mockProgressUpdates, mockMilestones } from '../data/mockData';
import { useLocalStorage } from './useLocalStorage';

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>('livetrack-projects', mockProjects);
  const [progressUpdates, setProgressUpdates] = useLocalStorage<ProgressUpdate[]>('livetrack-updates', mockProgressUpdates);
  const [milestones, setMilestones] = useLocalStorage<Milestone[]>('livetrack-milestones', mockMilestones);

  const updateProjectProgress = (projectId: string, newProgress: number, note?: string, userId: string = '1') => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const oldProgress = project.currentProgress;
    
    // Update project
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { ...p, currentProgress: newProgress, updatedAt: new Date() }
        : p
    );
    setProjects(updatedProjects);

    // Add progress update record
    const newUpdate: ProgressUpdate = {
      id: `update-${Date.now()}`,
      projectId,
      userId,
      oldProgress,
      newProgress,
      note,
      createdAt: new Date(),
    };
    setProgressUpdates(prev => [newUpdate, ...prev]);

    // Check for milestone completions
    const projectMilestones = milestones.filter(m => m.projectId === projectId);
    const newlyCompletedMilestones = projectMilestones.filter(m => 
      !m.completedAt && 
      m.targetProgress <= newProgress && 
      m.targetProgress > oldProgress
    );

    if (newlyCompletedMilestones.length > 0) {
      const updatedMilestones = milestones.map(m => 
        newlyCompletedMilestones.some(nm => nm.id === m.id)
          ? { ...m, completedAt: new Date(), notificationSent: true }
          : m
      );
      setMilestones(updatedMilestones);

      // In a real app, trigger notifications here
      console.log('Milestone(s) completed:', newlyCompletedMilestones.map(m => m.name));
    }
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);
  
  const getProjectBySlug = (slug: string) => projects.find(p => p.publicWidgetSlug === slug);
  
  const getProjectMilestones = (projectId: string) => 
    milestones.filter(m => m.projectId === projectId).sort((a, b) => a.order - b.order);
  
  const getProjectUpdates = (projectId: string) => 
    progressUpdates.filter(u => u.projectId === projectId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const addMilestone = (milestone: Omit<Milestone, 'id' | 'createdAt'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: `mile-${Date.now()}`,
      createdAt: new Date(),
    };
    setMilestones(prev => [...prev, newMilestone]);
    return newMilestone;
  };

  return {
    projects,
    updateProjectProgress,
    getProjectById,
    getProjectBySlug,
    getProjectMilestones,
    getProjectUpdates,
    createProject,
    addMilestone,
  };
}