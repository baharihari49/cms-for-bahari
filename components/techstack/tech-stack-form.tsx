// components/tech-stack/tech-stack-form.tsx
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
import { TechStackFormData } from "@/types/tech-stack";

// Category options
const categoryOptions = ["Frontend", "Backend", "Database", "Mobile", "DevOps", "Testing", "Other"];

// Icon options (simplified for this example)
const iconOptions = [
  { value: "IoLogoJavascript", label: "JavaScript" },
  { value: "SiTypescript", label: "TypeScript" },
  { value: "FaReact", label: "React" },
  { value: "SiNextdotjs", label: "Next.js" },
  { value: "FaNodeJs", label: "Node.js" },
  { value: "SiTailwindcss", label: "Tailwind CSS" },
  { value: "SiPrisma", label: "Prisma" },
  { value: "SiPostgresql", label: "PostgreSQL" },
  { value: "SiMongodb", label: "MongoDB" },
  { value: "SiDocker", label: "Docker" },
  { value: "SiAmazonaws", label: "AWS" },
  { value: "SiGit", label: "Git" },
];

// Color options for Tailwind CSS
const colorOptions = [
  { value: "blue-500", label: "Blue" },
  { value: "green-500", label: "Green" },
  { value: "red-500", label: "Red" },
  { value: "yellow-500", label: "Yellow" },
  { value: "purple-500", label: "Purple" },
  { value: "pink-500", label: "Pink" },
  { value: "orange-500", label: "Orange" },
  { value: "teal-500", label: "Teal" },
  { value: "indigo-500", label: "Indigo" },
  { value: "gray-500", label: "Gray" },
];

interface TechStackFormProps {
  initialData: TechStackFormData;
  onSubmit: (data: TechStackFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  formError: string | null;
}

export function TechStackForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
  formError
}: TechStackFormProps) {
  const [formData, setFormData] = useState<TechStackFormData>(initialData);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle number input changes with validation
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
          {formError}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Technology Name*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="React"
            disabled={isSubmitting}
          />
        </div>
        
        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category*</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Icon */}
        <div className="space-y-2">
          <Label htmlFor="icon">Icon*</Label>
          <Select
            value={formData.icon}
            onValueChange={(value) => handleSelectChange('icon', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="icon">
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color">Color*</Label>
          <Select
            value={formData.color}
            onValueChange={(value) => handleSelectChange('color', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="color">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full bg-${color.value} mr-2`}></div>
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Proficiency */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="proficiency">Proficiency*</Label>
          <span className="text-sm text-gray-500">{formData.proficiency}%</span>
        </div>
        <Input
          id="proficiency"
          name="proficiency"
          type="range"
          min="0"
          max="100"
          value={formData.proficiency}
          onChange={handleNumberChange}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Years of Experience */}
        <div className="space-y-2">
          <Label htmlFor="years">Years of Experience*</Label>
          <Input
            id="years"
            name="years"
            type="number"
            min="0"
            value={formData.years}
            onChange={handleNumberChange}
            disabled={isSubmitting}
          />
        </div>
        
        {/* Number of Projects */}
        <div className="space-y-2">
          <Label htmlFor="projects">Number of Projects*</Label>
          <Input
            id="projects"
            name="projects"
            type="number"
            min="0"
            value={formData.projects}
            onChange={handleNumberChange}
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your expertise and experience with this technology..."
          disabled={isSubmitting}
          rows={4}
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