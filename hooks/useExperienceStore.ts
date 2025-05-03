// hooks/useExperienceStore.ts
import { useState, useCallback } from 'react';
import { Experience } from '@/types';

export function useExperienceStore() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch experiences data
  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/experiences', {
        credentials: 'include' // Important for sending cookies
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }
      
      const data = await response.json();
      setExperiences(data.data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Failed to load experiences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create experience
  const createExperience = async (experienceData: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to create experience');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error creating experience:', error);
      return { 
        success: false, 
        error: 'Failed to create experience. Please try again.' 
      };
    }
  };

  // Update experience
  const updateExperience = async (id: string, experienceData: Partial<Experience>) => {
    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update experience');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating experience:', error);
      return { 
        success: false, 
        error: 'Failed to update experience. Please try again.' 
      };
    }
  };

  // Delete experience
  const deleteExperience = async (id: string) => {
    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete experience');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting experience:', error);
      return { 
        success: false, 
        error: 'Failed to delete experience. Please try again.' 
      };
    }
  };

  return {
    experiences,
    isLoading,
    error,
    setError,
    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience
  };
}