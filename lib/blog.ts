// lib/data/blog.ts - Data conversion utility for blog data

import { BlogPost, BlogCategory, BlogTag, User } from '@prisma/client';

// Define types for the formatted data
export type FormattedBlogPost = {
  id: string;
  slug: string;
  thumbnail: string;
  category: string;
  categoryId: string;
  date: string;
  comments: number;
  title: string;
  excerpt: string;
  content?: string;
  hasImage: boolean;
  isFeature: boolean;
  published: boolean;
  author: {
    id: string;
    name: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export type FormattedBlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount?: number;
  posts?: FormattedBlogPost[];
  createdAt: Date;
  updatedAt: Date;
};

export type FormattedBlogTag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount?: number;
  posts?: FormattedBlogPost[];
  createdAt: Date;
  updatedAt: Date;
};

// Helper function to convert database post to formatted post
export const formatBlogPost = (
  post: BlogPost & {
    author: Pick<User, 'id' | 'name'>;
    category: BlogCategory;
    tags: Array<{
      tag: BlogTag;
    }>;
  }
): FormattedBlogPost => {
  return {
    id: post.id,
    slug: post.slug,
    thumbnail: post.thumbnail || '',
    category: post.category.name,
    categoryId: post.categoryId,
    date: post.createdAt.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    comments: post.comments,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content,
    hasImage: post.hasImage,
    isFeature: post.isFeature,
    published: post.published,
    author: post.author,
    tags: post.tags.map(pt => ({
      id: pt.tag.id,
      name: pt.tag.name
    })),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
};

// Define an interface for the expected post data input
export interface BlogPostInput {
  title: string;
  slug: string;
  thumbnail?: string | null;
  excerpt?: string | null;
  content: string;
  hasImage?: boolean;
  isFeature?: boolean;
  published?: boolean;
  comments?: number;
  authorId: string;
  categoryId: string;
  tags?: string[];
}

// Helper function to convert a blog post JSON to database format
export const prepareBlogPostForDatabase = (postData: BlogPostInput) => {
  const { tags, ...data } = postData;
  
  // Extract fields that should go into the blog post table
  const blogPostData = {
    title: data.title,
    slug: data.slug,
    thumbnail: data.thumbnail || null,
    excerpt: data.excerpt || null,
    content: data.content,
    hasImage: data.hasImage || false,
    isFeature: data.isFeature || false,
    published: data.published || false,
    comments: data.comments || 0,
    authorId: data.authorId,
    categoryId: data.categoryId,
  };

  return {
    blogPostData,
    tagIds: tags || []
  };
};

// Create a slug from a string
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .trim();
};