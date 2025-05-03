// components/ui/AlertError.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface AlertErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function AlertError({ message, onRetry, onDismiss }: AlertErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 rounded-md flex items-center justify-between">
      <div className="flex-1">{message}</div>
      <div className="flex space-x-2">
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="hover:bg-red-100 border-red-200 text-red-600"
          >
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}