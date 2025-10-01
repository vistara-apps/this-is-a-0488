import React, { useState } from 'react';
import { Save, MessageSquare } from 'lucide-react';
import { Project } from '../../types';
import { Modal } from '../ui/Modal';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';

interface QuickUpdateSliderProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (progress: number, note?: string) => void;
  variant?: 'mobile' | 'desktop';
}

export function QuickUpdateSlider({
  project,
  isOpen,
  onClose,
  onUpdate,
  variant = 'desktop',
}: QuickUpdateSliderProps) {
  const [progress, setProgress] = useState(project.currentProgress);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onUpdate(progress, note.trim() || undefined);
    setIsLoading(false);
    
    // Reset form
    setNote('');
    setShowNote(false);
    onClose();
  };

  const isMobile = variant === 'mobile';
  const hasChanged = progress !== project.currentProgress || note.trim().length > 0;

  if (isMobile) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        className="lg:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="text-center p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text">{project.name}</h2>
            <p className="text-text-muted mt-1">Update Progress</p>
          </div>
          
          {/* Progress Slider */}
          <div className="flex-1 flex flex-col justify-center p-6">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-text mb-2">{Math.round(progress)}%</div>
              <div className="text-text-muted">Current Progress</div>
            </div>
            
            <Slider
              value={progress}
              onChange={setProgress}
              variant="mobile"
              className="mb-8"
            />
            
            <div className="text-center text-sm text-text-muted">
              Previous: {Math.round(project.currentProgress)}%
            </div>
          </div>
          
          {/* Note Section */}
          <div className="border-t border-border p-4">
            {!showNote ? (
              <Button
                variant="outline"
                icon={MessageSquare}
                onClick={() => setShowNote(true)}
                className="w-full mb-4"
              >
                Add Note (Optional)
              </Button>
            ) : (
              <div className="mb-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What did you accomplish?"
                  className="w-full p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  maxLength={200}
                />
                <div className="text-right text-xs text-text-muted mt-1">
                  {note.length}/200
                </div>
              </div>
            )}
            
            <Button
              onClick={handleSave}
              disabled={!hasChanged}
              isLoading={isLoading}
              className="w-full"
              size="lg"
              icon={Save}
            >
              Save Progress
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Progress"
      size="md"
    >
      <div className="space-y-6">
        {/* Project Info */}
        <div>
          <h3 className="font-semibold text-text">{project.name}</h3>
          <p className="text-sm text-text-muted mt-1">{project.description}</p>
        </div>
        
        {/* Progress Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-text">Progress</label>
            <span className="text-lg font-semibold text-text">{Math.round(progress)}%</span>
          </div>
          
          <Slider
            value={progress}
            onChange={setProgress}
            className="mb-2"
          />
          
          <div className="text-xs text-text-muted">
            Previous: {Math.round(project.currentProgress)}%
          </div>
        </div>
        
        {/* Note */}
        <div>
          <label className="text-sm font-medium text-text block mb-2">
            Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did you accomplish?"
            className="w-full p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            maxLength={200}
          />
          <div className="text-right text-xs text-text-muted mt-1">
            {note.length}/200
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanged}
            isLoading={isLoading}
            className="flex-1"
            icon={Save}
          >
            Save Progress
          </Button>
        </div>
      </div>
    </Modal>
  );
}