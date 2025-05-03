// app/dashboard/experiences/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import AuthGuard from '@/components/AuthGuard';
import { ExperienceTable } from './ExperienceTable';
import { ExperienceForm } from './ExperienceForm';
import { DeleteExperienceDialog } from './DeleteExperienceDialog';
import { AlertError } from './AlertError';
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from 'lucide-react';
import { Experience } from '@/types';

export default function ExperiencePage() {
  const {
    experiences,
    isLoading,
    error,
    fetchExperiences,
    setError
  } = useExperienceStore();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Handler functions
  const handleCreate = () => {
    setCurrentExperience(null);
    setFormOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setCurrentExperience(experience);
    setFormOpen(true);
  };

  const handleDeleteClick = (experience: Experience) => {
    setCurrentExperience(experience);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    fetchExperiences();
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Experience Management</h1>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </div>

        {error && (
          <AlertError 
            message={error} 
            onRetry={fetchExperiences} 
            onDismiss={() => setError(null)}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No experiences found. Create your first one!</p>
            <Button onClick={handleCreate} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </div>
        ) : (
          <ExperienceTable 
            experiences={experiences} 
            onEdit={handleEdit} 
            onDelete={handleDeleteClick} 
          />
        )}

        {/* Experience Form Dialog */}
        <ExperienceForm
          open={formOpen}
          onClose={handleFormClose}
          onSuccess={fetchExperiences}
          experience={currentExperience}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteExperienceDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onSuccess={handleDeleteSuccess}
          experience={currentExperience}
        />
      </div>
    </AuthGuard>
  );
}