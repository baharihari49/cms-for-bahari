// app/dashboard/techstack/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import { z } from 'zod';

// Import komponen yang telah direfaktor
import { TechStackTable } from '@/components/techstack/tech-stack-table';
import { TechStackForm } from '@/components/techstack/tech-stack-form';
import { DeleteConfirmationDialog } from '@/components/techstack/delete-confirmation-dialog';

// Import types
import { 
  TechStack, 
  TechStackFormData, 
  techStackSchema 
} from "@/types/tech-stack";

// State awal form
const initialFormData: TechStackFormData = {
  name: '',
  icon: 'IoLogoJavascript',
  category: 'Frontend',
  proficiency: 50,
  color: 'blue-500',
  description: '',
  years: 1,
  projects: 1,
};

export default function TechStackPage() {
  // State untuk data
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<TechStackFormData>(initialFormData);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // State untuk delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentTechStack, setCurrentTechStack] = useState<TechStack | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch tech stacks data
  const fetchTechStacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/techstack');
      if (!response.ok) {
        throw new Error('Failed to fetch tech stacks');
      }
      
      const data = await response.json();
      setTechStacks(data.data || []);
    } catch (error) {
      console.error('Error fetching tech stacks:', error);
      setError('Failed to load tech stacks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechStacks();
  }, []);

  // CRUD Handlers
  
  // Create/Update handler
  const handleSubmit = async (data: TechStackFormData) => {
    setFormError(null);
    
    // Basic validation
    try {
      techStackSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormError(error.errors[0].message);
      }
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      // Create or update based on whether we have an id
      const url = data.id
        ? `/api/techstack/${data.id}` 
        : '/api/techstack';
      
      const method = data.id ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${data.id ? 'update' : 'create'} tech stack`);
      }
      
      // Close dialog and refresh data
      setFormOpen(false);
      fetchTechStacks();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(`Failed to ${data.id ? 'update' : 'create'} tech stack. Please try again.`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!currentTechStack) return;
    
    setDeleteLoading(true);
    
    try {
      const response = await fetch(`/api/techstack/${currentTechStack.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete tech stack');
      }
      
      // Close dialog and refresh data
      setDeleteDialogOpen(false);
      fetchTechStacks();
    } catch (error) {
      console.error('Error deleting tech stack:', error);
      setError('Failed to delete tech stack. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // UI Interaction Handlers
  
  // Open create dialog
  const handleCreate = () => {
    setFormData(initialFormData);
    setCurrentTechStack(null);
    setFormError(null);
    setFormOpen(true);
  };

  // Open edit dialog
  const handleEdit = (techStack: TechStack) => {
    setCurrentTechStack(techStack);
    setFormData({
      id: techStack.id,
      name: techStack.name,
      icon: techStack.icon,
      category: techStack.category,
      proficiency: techStack.proficiency,
      color: techStack.color,
      description: techStack.description,
      years: techStack.years,
      projects: techStack.projects,
    });
    setFormError(null);
    setFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (techStack: TechStack) => {
    setCurrentTechStack(techStack);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tech Stack Management</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Tech Stack
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 rounded-md">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchTechStacks()}
            className="ml-2"
          >
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : techStacks.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No tech stacks found. Add your first one!</p>
          <Button onClick={handleCreate} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Tech Stack
          </Button>
        </div>
      ) : (
        <TechStackTable 
          techStacks={techStacks}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Tech Stack Form Dialog */}
      <Dialog 
        open={formOpen} 
        onOpenChange={(open) => {
          if (!open && !formSubmitting) {
            setFormOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentTechStack ? 'Edit Tech Stack' : 'Add New Tech Stack'}
            </DialogTitle>
            <DialogDescription>
              {currentTechStack 
                ? 'Update technology details and proficiency.' 
                : 'Add a new technology to your tech stack.'}
            </DialogDescription>
          </DialogHeader>
          
          <TechStackForm
            initialData={formData}
            onSubmit={handleSubmit}
            isSubmitting={formSubmitting}
            onCancel={() => setFormOpen(false)}
            formError={formError}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open && !deleteLoading) {
            setDeleteDialogOpen(false);
          }
        }}
      >
        <DeleteConfirmationDialog
          techStack={currentTechStack}
          isDeleting={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}