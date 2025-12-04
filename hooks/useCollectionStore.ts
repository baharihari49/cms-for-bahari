// hooks/useCollectionStore.ts
import { useState, useCallback } from 'react';
import { Collection, CollectionFormData } from '@/types/collection';

interface FetchParams {
  categoryId?: string;
  published?: boolean;
}

export function useCollectionStore() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collections with optional filtering
  const fetchCollections = useCallback(async (params?: FetchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
      if (params?.published !== undefined) searchParams.set('published', String(params.published));

      const url = `/api/collections${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

      const response = await fetch(url, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = await response.json();
      setCollections(data.data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setError('Failed to load collections. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch single collection by ID or slug
  const fetchCollection = async (idOrSlug: string) => {
    try {
      const response = await fetch(`/api/collections/${idOrSlug}`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch collection');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch collection'
      };
    }
  };

  // Create collection
  const createCollection = async (collectionData: CollectionFormData) => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create collection');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create collection'
      };
    }
  };

  // Update collection
  const updateCollection = async (id: string, collectionData: Partial<CollectionFormData>) => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update collection');
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error updating collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update collection'
      };
    }
  };

  // Delete collection
  const deleteCollection = async (id: string) => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete collection');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete collection'
      };
    }
  };

  return {
    collections,
    isLoading,
    error,
    setError,
    fetchCollections,
    fetchCollection,
    createCollection,
    updateCollection,
    deleteCollection
  };
}
