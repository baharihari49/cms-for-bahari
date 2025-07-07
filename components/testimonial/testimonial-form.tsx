// components/testimonial/testimonial-form.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { TestimonialFormData, RATING_OPTIONS } from "@/types/testimonial";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";

interface TestimonialFormProps {
  initialData: TestimonialFormData;
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  formError: string | null;
}

export function TestimonialForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
  formError
}: TestimonialFormProps) {
  const [formData, setFormData] = useState<TestimonialFormData>(initialData);

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle rating change
  const handleRatingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rating: parseInt(value) }));
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
      
      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {formData.avatar ? (
            <AvatarImage src={formData.avatar} alt={formData.name} />
          ) : null}
          <AvatarFallback className="text-lg">
            {formData.name ? getInitials(formData.name) : '?'}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <CloudinaryUpload
            label="Avatar URL"
            value={formData.avatar || ''}
            onChange={(url) => setFormData(prev => ({ ...prev, avatar: url }))}
            placeholder="https://example.com/avatar.jpg"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name*</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="John Doe"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Position */}
      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          name="position"
          value={formData.position || ''}
          onChange={handleInputChange}
          placeholder="CEO at Company"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          value={formData.company || ''}
          onChange={handleInputChange}
          placeholder="Acme Inc."
          disabled={isSubmitting}
        />
      </div>
      
      {/* Rating */}
      <div className="space-y-2">
        <Label>Rating</Label>
        <RadioGroup 
          value={formData.rating?.toString() || '5'} 
          onValueChange={handleRatingChange}
          className="flex space-x-2"
        >
          {RATING_OPTIONS.map((rating) => (
            <div key={rating} className="flex items-center space-x-1">
              <RadioGroupItem 
                value={rating.toString()} 
                id={`rating-${rating}`}
                disabled={isSubmitting}
              />
              <Label htmlFor={`rating-${rating}`}>{rating}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Testimonial Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Testimonial*</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Write the testimonial content here..."
          disabled={isSubmitting}
          rows={5}
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