// hooks/usePortfolioStore.ts
import { useState, useCallback } from 'react';
import { Portfolio } from '@/types';

export function usePortfolioStore() {
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all portfolio items
  const fetchPortfolioItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/portfolio', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio items');
      }
      
      const data = await response.json();
      setPortfolioItems(data.data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      setError('Failed to load portfolio items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a single portfolio item by ID or slug
  const fetchPortfolioItem = async (idOrSlug: string) => {
    try {
      const response = await fetch(`/api/portfolio/${idOrSlug}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio item');
      }
      
      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      return { 
        success: false, 
        error: 'Failed to fetch portfolio item. Please try again.' 
      };
    }
  };

  // Create a new portfolio item
  const createPortfolioItem = async (portfolioData: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to create portfolio item');
      }
      
      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      return { 
        success: false, 
        error: 'Failed to create portfolio item. Please try again.' 
      };
    }
  };

  // Update an existing portfolio item
  const updatePortfolioItem = async (idOrSlug: string, portfolioData: Partial<Portfolio>) => {
    try {
      const response = await fetch(`/api/portfolio/${idOrSlug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update portfolio item');
      }
      
      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      return { 
        success: false, 
        error: 'Failed to update portfolio item. Please try again.' 
      };
    }
  };

  // Delete a portfolio item
  const deletePortfolioItem = async (idOrSlug: string) => {
    try {
      const response = await fetch(`/api/portfolio/${idOrSlug}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete portfolio item');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      return { 
        success: false, 
        error: 'Failed to delete portfolio item. Please try again.' 
      };
    }
  };

  return {
    portfolioItems,
    isLoading,
    error,
    setError,
    fetchPortfolioItems,
    fetchPortfolioItem,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  };
}