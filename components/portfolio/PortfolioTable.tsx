// components/portfolio/PortfolioTable.tsx
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
import { Pencil, Trash2, MoreVertical, Eye } from 'lucide-react';
import { Portfolio } from '@/types';
import Image from 'next/image';

interface PortfolioTableProps {
  portfolioItems: Portfolio[];
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (portfolio: Portfolio) => void;
  onView: (portfolio: Portfolio) => void;
}

export function PortfolioTable({ 
  portfolioItems, 
  onEdit, 
  onDelete, 
  onView 
}: PortfolioTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>List of your portfolio projects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead className="w-[250px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolioItems.map((portfolio) => (
            <TableRow key={portfolio.id}>
              <TableCell>
                <div className="relative h-16 w-24 overflow-hidden rounded-md">
                  <Image
                    src={portfolio.image}
                    alt={portfolio.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="text-base">{portfolio.title}</span>
                  <span className="text-sm text-muted-foreground truncate max-w-xs">
                    {portfolio.role}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{portfolio.category}</Badge>
              </TableCell>
              <TableCell>{portfolio.year}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[250px]">
                  {portfolio.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {portfolio.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{portfolio.technologies.length - 3}
                    </Badge>
                  )}
                </div>
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
                    <DropdownMenuItem onClick={() => onView(portfolio)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(portfolio)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(portfolio)}
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