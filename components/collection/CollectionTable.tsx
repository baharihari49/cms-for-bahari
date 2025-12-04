// components/collection/CollectionTable.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Collection } from '@/types/collection';
import { format } from 'date-fns';

interface CollectionTableProps {
  collections: Collection[];
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
  onPreview: (collection: Collection) => void;
}

export function CollectionTable({
  collections,
  onEdit,
  onDelete,
  onPreview,
}: CollectionTableProps) {
  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No collections found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first collection to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {collection.thumbnail && (
                    <img
                      src={collection.thumbnail}
                      alt={collection.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{collection.title}</div>
                    <div className="text-sm text-muted-foreground">{collection.slug}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{collection.category?.name || 'Uncategorized'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={collection.published ? 'default' : 'secondary'}>
                  {collection.published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(collection.updatedAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPreview(collection)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(collection)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(collection)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
