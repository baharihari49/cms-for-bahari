// app/dashboard/portfolio/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/hooks/usePortfolioStore';
import AuthGuard from '@/components/AuthGuard';
import { PortfolioTable } from '@/components/portfolio/PortfolioTable';
import { PortfolioForm } from '@/components/portfolio/PortfolioForm';
import { PortfolioDetails } from '@/components/portfolio/PortfolioDetails';
import { DeletePortfolioDialog } from '@/components/portfolio/DeletePortfolioDialog';
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from 'lucide-react';
import { Portfolio } from '@/types';
import { AlertError } from '../experiences/AlertError';

export default function PortfolioPage() {
  const {
    portfolioItems,
    isLoading,
    error,
    fetchPortfolioItems,
    setError
  } = usePortfolioStore();

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    fetchPortfolioItems();
  }, [fetchPortfolioItems]);

  // Handler functions
  const handleCreate = () => {
    setCurrentPortfolio(null);
    setFormOpen(true);
  };

  const handleView = (portfolio: Portfolio) => {
    setCurrentPortfolio(portfolio);
    setDetailsOpen(true);
  };

  const handleEdit = (portfolio: Portfolio) => {
    setCurrentPortfolio(portfolio);
    setFormOpen(true);
  };

  const handleDeleteClick = (portfolio: Portfolio) => {
    setCurrentPortfolio(portfolio);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };

  const handleOperationSuccess = () => {
    setFormOpen(false);
    setDeleteDialogOpen(false);
    fetchPortfolioItems();
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>

        {error && (
          <AlertError 
            message={error} 
            onRetry={fetchPortfolioItems} 
            onDismiss={() => setError(null)}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : portfolioItems.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No portfolio projects found. Create your first one!</p>
            <Button onClick={handleCreate} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </div>
        ) : (
          <PortfolioTable 
            portfolioItems={portfolioItems} 
            onView={handleView}
            onEdit={handleEdit} 
            onDelete={handleDeleteClick}
          />
        )}

        {/* Portfolio Details Dialog */}
        {currentPortfolio && (
          <PortfolioDetails
            open={detailsOpen}
            onClose={handleDetailsClose}
            portfolio={currentPortfolio}
            onEdit={() => {
              setDetailsOpen(false);
              setFormOpen(true);
            }}
          />
        )}

        {/* Portfolio Form Dialog */}
        <PortfolioForm
          open={formOpen}
          onClose={handleFormClose}
          onSuccess={handleOperationSuccess}
          portfolio={currentPortfolio}
        />

        {/* Delete Confirmation Dialog */}
        <DeletePortfolioDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onSuccess={handleOperationSuccess}
          portfolio={currentPortfolio}
        />
      </div>
    </AuthGuard>
  );
}