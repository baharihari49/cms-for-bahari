// app/dashboard/testimonial/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";  // Tambahkan DialogHeader dan DialogTitle
import { PlusCircle, Loader2 } from "lucide-react";
import { z } from 'zod';

// Import komponen
import { TestimonialTable } from "@/components/testimonial/testimonial-table";
import { TestimonialForm } from "@/components/testimonial/testimonial-form";
import { DeleteConfirmationDialog } from "@/components/testimonial/delete-confirmation-dialog";

// Import types
import { 
  Testimonial, 
  TestimonialFormData, 
  testimonialSchema
} from "@/types/testimonial";

// State awal form
const initialFormData: TestimonialFormData = {
  content: '',
  name: '',
  position: null,
  avatar: null,
  company: null,
  rating: 5
};

export default function TestimonialPage() {
  // State untuk data
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>(initialFormData);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // State untuk delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch testimonials data
  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/testimonial');
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      setTestimonials(data.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // CRUD Handlers
  
  // Create/Update handler
  const handleSubmit = async (data: TestimonialFormData) => {
    setFormError(null);
    
    // Basic validation
    try {
      testimonialSchema.parse(data);
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
        ? `/api/testimonial/${data.id}` 
        : '/api/testimonial';
      
      const method = data.id ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${data.id ? 'update' : 'create'} testimonial`);
      }
      
      // Close dialog and refresh data
      setFormOpen(false);
      fetchTestimonials();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(`Failed to ${data.id ? 'update' : 'create'} testimonial. Please try again.`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!currentTestimonial) return;
    
    setDeleteLoading(true);
    
    try {
      const response = await fetch(`/api/testimonial/${currentTestimonial.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }
      
      // Close dialog and refresh data
      setDeleteDialogOpen(false);
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      setError('Failed to delete testimonial. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // UI Interaction Handlers
  
  // Open create dialog
  const handleCreate = () => {
    setFormData(initialFormData);
    setCurrentTestimonial(null);
    setFormError(null);
    setFormOpen(true);
  };

  // Open edit dialog
  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      id: testimonial.id,
      content: testimonial.content,
      name: testimonial.name,
      position: testimonial.position,
      avatar: testimonial.avatar,
      company: testimonial.company,
      rating: testimonial.rating,
    });
    setFormError(null);
    setFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonial Management</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 rounded-md">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchTestimonials()}
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
      ) : testimonials.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No testimonials found. Add your first one!</p>
          <Button onClick={handleCreate} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
          </Button>
        </div>
      ) : (
        <TestimonialTable 
          testimonials={testimonials}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Testimonial Form Dialog - Dengan DialogHeader dan DialogTitle */}
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
              {currentTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {currentTestimonial 
                ? 'Update the testimonial details.' 
                : 'Add a new client testimonial.'}
            </DialogDescription>
          </DialogHeader>
          
          <TestimonialForm
            initialData={formData}
            onSubmit={handleSubmit}
            isSubmitting={formSubmitting}
            onCancel={() => setFormOpen(false)}
            formError={formError}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog tidak perlu DialogContent karena sudah termasuk di dalam komponennya */}
      <Dialog 
        open={deleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open && !deleteLoading) {
            setDeleteDialogOpen(false);
          }
        }}
      >
        <DeleteConfirmationDialog
          testimonial={currentTestimonial}
          isDeleting={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}