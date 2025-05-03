// components/faq/faq-table.tsx
'use client';

import { FAQ } from "@/types/faq";
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoreVertical, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface FAQTableProps {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onDelete: (faq: FAQ) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}

export function FAQTable({ 
  faqs, 
  onEdit, 
  onDelete,
  onReorder 
}: FAQTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Frequently Asked Questions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq, index) => (
            <TableRow key={faq.id}>
              <TableCell>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={faq.id} className="border-0">
                    <AccordionTrigger className="py-0 hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {faq.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="mr-2">{faq.order}</span>
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={() => onReorder(faq.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={() => onReorder(faq.id, 'down')}
                      disabled={index === faqs.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
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
                    <DropdownMenuItem onClick={() => onEdit(faq)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(faq)}
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