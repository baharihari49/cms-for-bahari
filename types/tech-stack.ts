// types/tech-stack.ts
import { z } from 'zod';

// Interface untuk TechStack dari database
export interface TechStack {
  id: string;
  name: string;
  icon: string;
  category: string;
  proficiency: number;
  color: string;
  description: string;
  years: number;
  projects: number;
  createdAt: string;
  updatedAt: string;
}

// Interface untuk data form tanpa id, createdAt, updatedAt
export interface TechStackFormData {
  id?: string;
  name: string;
  icon: string;
  category: string;
  proficiency: number;
  color: string;
  description: string;
  years: number;
  projects: number;
}

// Schema validasi untuk TechStack form
export const techStackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().min(0).max(100),
  color: z.string().min(1, "Color is required"),
  description: z.string().min(1, "Description is required"),
  years: z.number().int().min(0, "Years must be a positive integer"),
  projects: z.number().int().min(0, "Projects must be a positive integer"),
});

// Constants untuk category
export const TECH_CATEGORIES = [
  "Frontend", 
  "Backend", 
  "Database", 
  "Mobile", 
  "DevOps", 
  "Testing", 
  "Other"
];

// Constants untuk color options
export const COLOR_OPTIONS = [
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