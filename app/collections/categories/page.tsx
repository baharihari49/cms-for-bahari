// app/collections/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useCollectionCategoryStore } from '@/hooks/useCollectionCategoryStore';
import { CollectionCategory, CollectionCategoryFormData } from '@/types/collection';
import { toast } from 'sonner';

export default function CollectionCategoriesPage() {
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCollectionCategoryStore();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CollectionCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setFormError(null);
  };

  const handleCreate = () => {
    setCurrentCategory(null);
    resetForm();
    setFormOpen(true);
  };

  const handleEdit = (category: CollectionCategory) => {
    setCurrentCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setFormError(null);
    setFormOpen(true);
  };

  const handleDelete = (category: CollectionCategory) => {
    setCurrentCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!currentCategory) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      setFormError('Name and slug are required');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const formData: CollectionCategoryFormData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
    };

    let result;
    if (currentCategory) {
      result = await updateCategory(currentCategory.id, formData);
    } else {
      result = await createCategory(formData);
    }

    if (result.success) {
      toast.success(currentCategory ? 'Category updated' : 'Category created');
      fetchCategories();
      setFormOpen(false);
      resetForm();
    } else {
      setFormError(result.error || 'Failed to save category');
    }

    setIsSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    if (!currentCategory) return;

    setIsSubmitting(true);
    const result = await deleteCategory(currentCategory.id);

    if (result.success) {
      toast.success('Category deleted');
      fetchCategories();
      setDeleteDialogOpen(false);
    } else {
      toast.error(result.error || 'Failed to delete category');
    }

    setIsSubmitting(false);
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Collection Categories</h1>
            <p className="text-muted-foreground">Manage categories for your collections</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
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
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first category to get started
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell>
                      {(category as CollectionCategory & { _count?: { collections: number } })._count?.collections || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={formOpen} onOpenChange={(open) => !isSubmitting && setFormOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentCategory ? 'Edit Category' : 'Create Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Category name"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="category-slug"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {formError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {formError}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : currentCategory ? (
                    'Update'
                  ) : (
                    'Create'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={(open) => !isSubmitting && setDeleteDialogOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{currentCategory?.name}&quot;?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
