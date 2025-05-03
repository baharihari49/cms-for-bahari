// components/tech-stack/tech-stack-table.tsx
'use client';

import { TechStack } from "@/types/tech-stack";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

// Helper function to get color class for the badge
const getColorClass = (color: string) => {
  const colorBase = color.split('-')[0];
  return `bg-${colorBase}-100 text-${colorBase}-800 border-${colorBase}-200`;
};

interface TechStackTableProps {
  techStacks: TechStack[];
  onEdit: (techStack: TechStack) => void;
  onDelete: (techStack: TechStack) => void;
}

export function TechStackTable({ 
  techStacks, 
  onEdit, 
  onDelete 
}: TechStackTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Your tech stack skills and proficiency</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Proficiency</TableHead>
            <TableHead>Years</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {techStacks.map((tech) => (
            <TableRow key={tech.id}>
              <TableCell className="font-medium">{tech.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getColorClass(tech.color)}>
                  {tech.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={tech.proficiency} className="h-2" />
                  <span className="text-sm">{tech.proficiency}%</span>
                </div>
              </TableCell>
              <TableCell>{tech.years} {tech.years === 1 ? 'year' : 'years'}</TableCell>
              <TableCell>{tech.projects} {tech.projects === 1 ? 'project' : 'projects'}</TableCell>
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
                    <DropdownMenuItem onClick={() => onEdit(tech)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(tech)}
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