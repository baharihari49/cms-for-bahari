// app/dashboard/faq/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import komponen yang telah direfaktor
import { FAQTable } from "@/components/faq/faq-table";
import { FAQForm } from "@/components/faq/faq-form";
import { DeleteConfirmationDialog } from "@/components/faq/delete-confirmation-dialog";

// Import types
import { 
  FAQ, 
  FAQFormData, 
  faqSchema,
  FAQ_CATEGORIES 
} from "@/types/faq";

// State awal form
const initialFormData: FAQFormData = {
  question: '',
  answer: '',
  category: 'General',
};

export default function FAQPage() {
  // State untuk data
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all"); // Menggunakan "all" alih-alih empty string
  
  // State untuk form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<FAQFormData>(initialFormData);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // State untuk delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState<FAQ | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch FAQs data
  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Hanya tambahkan parameter category jika bukan "all"
      const url = categoryFilter !== "all"
        ? `/api/faq?category=${encodeURIComponent(categoryFilter)}`
        : '/api/faq';
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      
      const data = await response.json();
      setFaqs(data.data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError('Failed to load FAQs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [categoryFilter]);

  // CRUD Handlers
  
  // Create/Update handler
  const handleSubmit = async (data: FAQFormData) => {
    setFormError(null);
    
    // Basic validation
    try {
      faqSchema.parse(data);
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
        ? `/api/faq/${data.id}` 
        : '/api/faq';
      
      const method = data.id ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${data.id ? 'update' : 'create'} FAQ`);
      }
      
      // Close dialog and refresh data
      setFormOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(`Failed to ${data.id ? 'update' : 'create'} FAQ. Please try again.`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!currentFAQ) return;
    
    setDeleteLoading(true);
    
    try {
      const response = await fetch(`/api/faq/${currentFAQ.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete FAQ');
      }
      
      // Close dialog and refresh data
      setDeleteDialogOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setError('Failed to delete FAQ. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Reorder handler
  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(faq => faq.id === id);
    if (currentIndex === -1) return;
    
    const newFaqs = [...faqs];
    
    // If moving up, swap with previous item
    if (direction === 'up' && currentIndex > 0) {
      const temp = newFaqs[currentIndex - 1];
      newFaqs[currentIndex - 1] = {
        ...newFaqs[currentIndex],
        order: temp.order
      };
      newFaqs[currentIndex] = {
        ...temp,
        order: newFaqs[currentIndex].order
      };
    } 
    // If moving down, swap with next item
    else if (direction === 'down' && currentIndex < newFaqs.length - 1) {
      const temp = newFaqs[currentIndex + 1];
      newFaqs[currentIndex + 1] = {
        ...newFaqs[currentIndex],
        order: temp.order
      };
      newFaqs[currentIndex] = {
        ...temp,
        order: newFaqs[currentIndex].order
      };
    } else {
      return; // No change needed
    }
    
    // Update both items in the database
    try {
      const idx1 = direction === 'up' ? currentIndex - 1 : currentIndex;
      const idx2 = direction === 'up' ? currentIndex : currentIndex + 1;
      
      // Update first item
      await fetch(`/api/faq/${newFaqs[idx1].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newFaqs[idx1].order }),
      });
      
      // Update second item
      await fetch(`/api/faq/${newFaqs[idx2].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newFaqs[idx2].order }),
      });
      
      // Update local state
      setFaqs(newFaqs);
    } catch (error) {
      console.error('Error reordering FAQs:', error);
      setError('Failed to reorder FAQs. Please try again.');
      // Refresh to get the current order
      fetchFAQs();
    }
  };

  // UI Interaction Handlers
  
  // Open create dialog
  const handleCreate = () => {
    setFormData(initialFormData);
    setCurrentFAQ(null);
    setFormError(null);
    setFormOpen(true);
  };

  // Open edit dialog
  const handleEdit = (faq: FAQ) => {
    setCurrentFAQ(faq);
    setFormData({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
    });
    setFormError(null);
    setFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (faq: FAQ) => {
    setCurrentFAQ(faq);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-64">
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {FAQ_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-gray-500">
          Showing {faqs.length} {categoryFilter !== "all" ? `${categoryFilter} ` : ''} 
          {faqs.length === 1 ? 'FAQ' : 'FAQs'}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 rounded-md">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchFAQs()}
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
      ) : faqs.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">
            {categoryFilter !== "all" 
              ? `No FAQs found in the "${categoryFilter}" category` 
              : 'No FAQs found. Add your first one!'}
          </p>
          <Button onClick={handleCreate} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
          </Button>
        </div>
      ) : (
        <FAQTable 
          faqs={faqs}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onReorder={handleReorder}
        />
      )}

      {/* FAQ Form Dialog */}
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
              {currentFAQ ? 'Edit FAQ' : 'Add New FAQ'}
            </DialogTitle>
            <DialogDescription>
              {currentFAQ 
                ? 'Update the frequently asked question.' 
                : 'Add a new frequently asked question.'}
            </DialogDescription>
          </DialogHeader>
          <FAQForm
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
          faq={currentFAQ}
          isDeleting={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}