// components/collection/CollectionPreview.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Collection } from '@/types/collection';
import { useState } from 'react';

interface CollectionPreviewProps {
  open: boolean;
  onClose: () => void;
  collection: Collection | null;
}

export function CollectionPreview({ open, onClose, collection }: CollectionPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!collection) return null;

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(false)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <iframe
          srcDoc={collection.htmlContent}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title={collection.title}
        />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle>{collection.title}</DialogTitle>
              <Badge variant={collection.published ? 'default' : 'secondary'}>
                {collection.published ? 'Published' : 'Draft'}
              </Badge>
              {collection.category && (
                <Badge variant="outline">{collection.category.name}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(true)}
              className="mr-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          {collection.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {collection.description}
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-hidden rounded-md border bg-white dark:bg-gray-950">
          <iframe
            srcDoc={collection.htmlContent}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title={collection.title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
