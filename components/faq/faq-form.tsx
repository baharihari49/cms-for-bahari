// components/faq/faq-form.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { FAQFormData, FAQ_CATEGORIES } from "@/types/faq";

interface FAQFormProps {
  initialData: FAQFormData;
  onSubmit: (data: FAQFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  formError: string | null;
}

export function FAQForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
  formError
}: FAQFormProps) {
  const [formData, setFormData] = useState<FAQFormData>(initialData);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
          {formError}
        </div>
      )}
      
      {/* Question */}
      <div className="space-y-2">
        <Label htmlFor="question">Question*</Label>
        <Input
          id="question"
          name="question"
          value={formData.question}
          onChange={handleInputChange}
          placeholder="What services do you offer?"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category*</Label>
        <Select
          value={formData.category}
          onValueChange={handleSelectChange}
          disabled={isSubmitting}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {FAQ_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Answer */}
      <div className="space-y-2">
        <Label htmlFor="answer">Answer*</Label>
        <Textarea
          id="answer"
          name="answer"
          value={formData.answer}
          onChange={handleInputChange}
          placeholder="Provide a detailed answer to the question..."
          disabled={isSubmitting}
          rows={8}
        />
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {initialData.id ? 'Update' : 'Create'}
        </Button>
      </DialogFooter>
    </form>
  );
}