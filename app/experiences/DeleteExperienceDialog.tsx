// components/experiences/DeleteExperienceDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import { Experience } from '@/types';

interface DeleteExperienceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  experience: Experience | null;
}

export function DeleteExperienceDialog({ 
  open, 
  onClose, 
  onSuccess, 
  experience 
}: DeleteExperienceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteExperience } = useExperienceStore();

  // Handle delete experience
  const handleDelete = async () => {
    if (!experience) return;
    
    setIsDeleting(true);
    
    try {
      const result = await deleteExperience(experience.id);
      
      if (result.success) {
        onSuccess();
      } else {
        // If there was an error, we could show it here
        console.error(result.error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && !isDeleting) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this experience? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {experience && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium">{experience.title}</p>
              <p className="text-sm text-gray-500">{experience.company}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Experience
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}