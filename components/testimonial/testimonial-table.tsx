// components/testimonial/testimonial-table.tsx
'use client';

import { Testimonial } from "@/types/testimonial";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, StarHalf, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface TestimonialTableProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
}

export function TestimonialTable({ 
  testimonials, 
  onEdit, 
  onDelete 
}: TestimonialTableProps) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Function to render stars based on rating
  const renderRating = (rating: number | null) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Client Testimonials</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="min-w-[350px]">Testimonial</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {testimonial.avatar ? (
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    ) : null}
                    <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{testimonial.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="line-clamp-3 text-sm">
                  &ldquo;{testimonial.content}&rdquo;
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm max-w-[200px] truncate">
                  {testimonial.position || 'N/A'}
                </div>
                {testimonial.company && (
                  <div className="text-xs text-gray-500">
                    {testimonial.company}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {renderRating(testimonial.rating)}
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-500">
                  {formatDate(testimonial.createdAt)}
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
                    <DropdownMenuItem onClick={() => onEdit(testimonial)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(testimonial)}
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