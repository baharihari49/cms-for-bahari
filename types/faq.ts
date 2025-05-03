// types/faq.ts
import { z } from 'zod';

// Interface untuk FAQ dari database
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Interface untuk data form tanpa id, createdAt, updatedAt
export interface FAQFormData {
  id?: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
}

// Schema validasi untuk FAQ form
export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().min(1, "Category is required"),
});

// FAQ categories
export const FAQ_CATEGORIES = [
  "Services",
  "Process",
  "Technical",
  "Pricing",
  "Support",
  "General"
];