// components/collection/CollectionForm.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Collection, CollectionCategory, CollectionFormData } from '@/types/collection';
import { HtmlEditor } from './HtmlEditor';
import { CloudinaryUpload } from '@/components/CloudinaryUpload';

interface CollectionFormProps {
  open: boolean;
  onClose: () => void;
  collection: Collection | null;
  categories: CollectionCategory[];
  onSubmit: (data: CollectionFormData) => Promise<{ success: boolean; error?: string }>;
  onSuccess: () => void;
}

export function CollectionForm({
  open,
  onClose,
  collection,
  categories,
  onSubmit,
  onSuccess,
}: CollectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [published, setPublished] = useState(false);
  const [categoryId, setCategoryId] = useState('');

  // Reset form when dialog opens/closes or collection changes
  useEffect(() => {
    if (open) {
      if (collection) {
        setTitle(collection.title);
        setSlug(collection.slug);
        setDescription(collection.description || '');
        setThumbnail(collection.thumbnail || '');
        setHtmlContent(collection.htmlContent);
        setPublished(collection.published);
        setCategoryId(collection.categoryId);
      } else {
        setTitle('');
        setSlug('');
        setDescription('');
        setThumbnail('');
        setHtmlContent('');
        setPublished(false);
        setCategoryId(categories.length > 0 ? categories[0].id : '');
      }
      setError(null);
      setActiveTab('basic');
    }
  }, [open, collection, categories]);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!collection) {
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

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      setActiveTab('basic');
      return;
    }
    if (!slug.trim()) {
      setError('Slug is required');
      setActiveTab('basic');
      return;
    }
    if (!categoryId) {
      setError('Category is required');
      setActiveTab('basic');
      return;
    }
    if (!htmlContent.trim()) {
      setError('HTML content is required');
      setActiveTab('content');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData: CollectionFormData = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      thumbnail: thumbnail.trim() || undefined,
      htmlContent: htmlContent,
      published,
      categoryId,
    };

    if (collection) {
      formData.id = collection.id;
    }

    const result = await onSubmit(formData);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to save collection');
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {collection ? 'Edit Collection' : 'Create Collection'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">HTML Content</TabsTrigger>
              <TabsTrigger value="media">Thumbnail</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter collection title"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="collection-slug"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly identifier (lowercase, hyphens only)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && (
                    <p className="text-xs text-destructive">
                      No categories available. Please create a category first.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the collection"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={published}
                    onCheckedChange={(checked) => setPublished(checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    Published
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="mt-4">
              <HtmlEditor
                value={htmlContent}
                onChange={setHtmlContent}
                label="HTML Content *"
                disabled={isSubmitting}
              />
            </TabsContent>

            <TabsContent value="media" className="mt-4">
              <div className="space-y-2">
                <Label>Thumbnail Image</Label>
                <CloudinaryUpload
                  value={thumbnail}
                  onChange={setThumbnail}
                />
                <p className="text-xs text-muted-foreground">
                  Optional preview image for the collection
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || categories.length === 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : collection ? (
                'Update Collection'
              ) : (
                'Create Collection'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
