// components/testimonial/delete-confirmation-dialog.tsx
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
import { Testimonial } from "@/types/testimonial";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DeleteConfirmationDialogProps {
  testimonial: Testimonial | null;
  isDeleting: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  testimonial,
  isDeleting,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  if (!testimonial) return null;

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this testimonial? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-start gap-3">
            <Avatar>
              {testimonial.avatar ? (
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              ) : null}
              <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{testimonial.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {testimonial.position || 'No position'}
                {testimonial.company ? ` at ${testimonial.company}` : ''}
              </p>
              <p className="text-sm mt-2 italic">&ldquo;{testimonial.content.length > 100 
                ? `${testimonial.content.substring(0, 100)}...` 
                : testimonial.content}&rdquo;</p>
            </div>
          </div>
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