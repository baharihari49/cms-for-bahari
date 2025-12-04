// app/collections/page.tsx
'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useCollectionStore } from '@/hooks/useCollectionStore';
import { useCollectionCategoryStore } from '@/hooks/useCollectionCategoryStore';
import { Collection, CollectionFormData } from '@/types/collection';
import { CollectionTable } from '@/components/collection/CollectionTable';
import { CollectionForm } from '@/components/collection/CollectionForm';
import { CollectionPreview } from '@/components/collection/CollectionPreview';
import { DeleteCollectionDialog } from '@/components/collection/DeleteCollectionDialog';
import { toast } from 'sonner';

export default function CollectionsPage() {
  const {
    collections,
    isLoading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
  } = useCollectionStore();

  const {
    categories,
    fetchCategories,
  } = useCollectionCategoryStore();

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, [fetchCategories, fetchCollections]);

  // Filter collections
  const filteredCollections = collections.filter((collection) => {
    if (categoryFilter !== 'all' && collection.categoryId !== categoryFilter) {
      return false;
    }
    if (statusFilter === 'published' && !collection.published) {
      return false;
    }
    if (statusFilter === 'draft' && collection.published) {
      return false;
    }
    return true;
  });

  const handleCreate = () => {
    setCurrentCollection(null);
    setFormOpen(true);
  };

  const handleEdit = (collection: Collection) => {
    setCurrentCollection(collection);
    setFormOpen(true);
  };

  const handleDelete = (collection: Collection) => {
    setCurrentCollection(collection);
    setDeleteDialogOpen(true);
  };

  const handlePreview = (collection: Collection) => {
    setCurrentCollection(collection);
    setPreviewOpen(true);
  };

  const handleFormSubmit = async (data: CollectionFormData) => {
    if (data.id) {
      return await updateCollection(data.id, data);
    } else {
      return await createCollection(data);
    }
  };

  const handleFormSuccess = () => {
    toast.success(currentCollection ? 'Collection updated' : 'Collection created');
    fetchCollections();
  };

  const handleDeleteSuccess = () => {
    toast.success('Collection deleted');
    fetchCollections();
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Collections</h1>
            <p className="text-muted-foreground">Manage your HTML collections</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Collection
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="text-destructive bg-destructive/10 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <CollectionTable
            collections={filteredCollections}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        )}

        {/* Form Dialog */}
        <CollectionForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          collection={currentCollection}
          categories={categories}
          onSubmit={handleFormSubmit}
          onSuccess={handleFormSuccess}
        />

        {/* Preview Dialog */}
        <CollectionPreview
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          collection={currentCollection}
        />

        {/* Delete Dialog */}
        <DeleteCollectionDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          collection={currentCollection}
          onConfirm={deleteCollection}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </AuthGuard>
  );
}
