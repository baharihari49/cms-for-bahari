// types/collection.ts
import { z } from 'zod';

// Collection Category Interface
export interface CollectionCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Collection Interface
export interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnail?: string | null;
  htmlContent: string;
  published: boolean;
  order?: number | null;
  categoryId: string;
  category?: CollectionCategory;
  createdAt: Date;
  updatedAt: Date;
}

// Form data interfaces
export interface CollectionCategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CollectionFormData {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  htmlContent: string;
  published: boolean;
  order?: number;
  categoryId: string;
}

// Zod validation schemas
export const collectionCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().optional(),
});

export const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  htmlContent: z.string().min(1, "HTML content is required"),
  published: z.boolean().default(false),
  order: z.number().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

export type CollectionCategoryInput = z.infer<typeof collectionCategorySchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
