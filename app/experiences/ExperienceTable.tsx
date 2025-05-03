// components/experiences/ExperienceTable.tsx
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, MoreVertical } from 'lucide-react';
import { Experience } from '@/types';

interface ExperienceTableProps {
  experiences: Experience[];
  onEdit: (experience: Experience) => void;
  onDelete: (experience: Experience) => void;
}

export function ExperienceTable({ experiences, onEdit, onDelete }: ExperienceTableProps) {
  // Helper to determine badge variant
  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'fulltime':
        return 'default';
      case 'remote':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>List of your professional experiences</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Current</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.map((experience) => (
            <TableRow key={experience.id}>
              <TableCell className="font-medium">{experience.title}</TableCell>
              <TableCell>{experience.company}</TableCell>
              <TableCell>{experience.duration}</TableCell>
              <TableCell>
                <Badge variant={getTypeVariant(experience.type)}>
                  {experience.type}
                </Badge>
              </TableCell>
              <TableCell>
                {experience.current ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Current
                  </Badge>
                ) : (
                  <Badge variant="outline">Past</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(experience)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(experience)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
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