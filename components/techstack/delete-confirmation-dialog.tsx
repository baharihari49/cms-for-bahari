// components/tech-stack/delete-confirmation-dialog.tsx
'use client';

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { TechStack } from "@/types/tech-stack";

interface DeleteConfirmationDialogProps {
  techStack: TechStack | null;
  isDeleting: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  techStack,
  isDeleting,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  if (!techStack) return null;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this tech stack? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="font-medium">{techStack.name}</p>
          <p className="text-sm text-gray-500">{techStack.category}</p>
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}