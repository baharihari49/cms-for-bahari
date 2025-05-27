// types/index.ts

export interface Experience {
  id: string;
  title: string;
  list: string[];
  company: string;
  companyLogo?: string;
  duration: string;
  location: string;
  skills: string[];
  achievements: string[];
  current: boolean;
  type: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}
  export interface Portfolio {
    id: string;
    title: string;
    slug: string;
    category: string;
    image: string;
    description: string;
    technologies: string[];
    year: string;
    role: string;
    duration: string;
    highlight?: string;
    keyFeatures: string[];
    gallery: string[];
    challenges?: string[];
    solutions?: string[];
    testimonial?: {
      text: string;
      author: string;
      position: string;
    };
    nextProject?: string;
    nextProjectSlug?: string;
    createdAt: Date;
    updatedAt: Date;
    link: string;
  }
  
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
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category?: string;
    order?: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Testimonial {
    id: string;
    content: string;
    name: string;
    position: string;
    avatar?: string;
    company?: string;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  };