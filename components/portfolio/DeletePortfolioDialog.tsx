// components/portfolio/DeletePortfolioDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { usePortfolioStore } from '@/hooks/usePortfolioStore';
import { Portfolio } from '@/types';
import Image from 'next/image';

interface DeletePortfolioDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  portfolio: Portfolio | null;
}

export function DeletePortfolioDialog({ 
  open, 
  onClose, 
  onSuccess, 
  portfolio 
}: DeletePortfolioDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deletePortfolioItem } = usePortfolioStore();

  // Handle delete portfolio
  const handleDelete = async () => {
    if (!portfolio) return;
    
    setIsDeleting(true);
    
    try {
      const result = await deletePortfolioItem(portfolio.id);
      
      if (result.success) {
        onSuccess();
      } else {
        // If there was an error, we could show it here
        console.error(result.error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && !isDeleting) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this portfolio item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {portfolio && (
            <div className="bg-gray-50 p-3 rounded-md space-y-3">
              {portfolio.image && (
                <div className="relative h-32 w-full overflow-hidden rounded-md">
                  <Image
                    src={portfolio.image}
                    alt={portfolio.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium">{portfolio.title}</p>
                <p className="text-sm text-gray-500">{portfolio.category} - {portfolio.year}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}