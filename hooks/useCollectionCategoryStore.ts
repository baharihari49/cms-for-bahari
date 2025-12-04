// hooks/useCollectionCategoryStore.ts
import { useState, useCallback } from 'react';
import { CollectionCategory, CollectionCategoryFormData } from '@/types/collection';

export function useCollectionCategoryStore() {
  const [categories, setCategories] = useState<CollectionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/collections/categories', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create category
  const createCategory = async (categoryData: CollectionCategoryFormData) => {
    try {
      const response = await fetch('/api/collections/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create category'
      };
    }
  };

  // Update category
  const updateCategory = async (id: string, categoryData: Partial<CollectionCategoryFormData>) => {
    try {
      const response = await fetch(`/api/collections/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update category');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update category'
      };
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/collections/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete category'
      };
    }
  };

  return {
    categories,
    isLoading,
    error,
    setError,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
