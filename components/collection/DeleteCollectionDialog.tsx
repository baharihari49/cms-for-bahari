// components/collection/DeleteCollectionDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Collection } from '@/types/collection';

interface DeleteCollectionDialogProps {
  open: boolean;
  onClose: () => void;
  collection: Collection | null;
  onConfirm: (id: string) => Promise<{ success: boolean; error?: string }>;
  onSuccess: () => void;
}

export function DeleteCollectionDialog({
  open,
  onClose,
  collection,
  onConfirm,
  onSuccess,
}: DeleteCollectionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!collection) return;

    setIsDeleting(true);
    setError(null);

    const result = await onConfirm(collection.id);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to delete collection');
    }

    setIsDeleting(false);
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{collection?.title}&quot;? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
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
  );
}
