// types/testimonial.ts
import { z } from 'zod';

// Interface untuk Testimonial dari database
export interface Testimonial {
  id: string;
  content: string;
  name: string;
  position: string | null;
  avatar: string | null;
  company: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

// Interface untuk data form tanpa id, createdAt, updatedAt
export interface TestimonialFormData {
  id?: string;
  content: string;
  name: string;
  position: string | null;
  avatar: string | null;
  company: string | null;
  rating: number | null;
}

// Schema validasi untuk Testimonial form
export const testimonialSchema = z.object({
  content: z.string().min(1, "Testimonial content is required"),
  name: z.string().min(1, "Name is required"),
  position: z.string().nullable(),
  avatar: z.string().nullable(),
  company: z.string().nullable(),
  rating: z.number().min(1).max(5).nullable(),
});

// Rating options
export const RATING_OPTIONS = [1, 2, 3, 4, 5];