// app/api/blog/posts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { withCors } from '@/lib/withCors';

// GET all blog posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const tagId = searchParams.get('tagId');
    const featured = searchParams.get('featured') === 'true';
    const published = searchParams.get('published') === 'true' ? true : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Build the where clause based on query parameters
    // Use Prisma.BlogPostWhereInput type instead of any
    const where: Prisma.BlogPostWhereInput = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (published !== undefined) {
      where.published = published;
    }
    
    if (featured) {
      where.isFeature = true;
    }
    
    // For tag filtering, we need to use a different approach due to many-to-many relationship
    if (tagId) {
      where.tags = {
        some: {
          tagId: tagId
        }
      };
    }
    
    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
    });
    
    // Transform the response to match the expected format
    const formattedPosts = posts.map(post => ({
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
    }));

    // return NextResponse.json({ 
    //   success: true, 
    //   data: formattedPosts 
    // });
    return withCors({success: true, data: formattedPosts})
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// Tipe input untuk pembuatan blog post
interface CreateBlogPostInput {
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

// Define a proper error type for better error handling
// interface PrismaError extends Error {
//   code?: string;
//   meta?: Record<string, unknown>;
// }

// POST new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateBlogPostInput;
    
    // Validasi data input
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    if (!body.content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!body.authorId) {
      return NextResponse.json(
        { success: false, error: 'Author ID is required' },
        { status: 400 }
      );
    }

    if (!body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    // Extract tags from the request to handle them separately
    const { tags, ...postData } = body;
    
    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        thumbnail: postData.thumbnail || null,
        excerpt: postData.excerpt || null,
        content: postData.content,
        hasImage: postData.hasImage ?? false, // Gunakan nullish coalescing
        isFeature: postData.isFeature ?? false, // Gunakan nullish coalescing
        published: postData.published ?? false, // Gunakan nullish coalescing
        comments: postData.comments ?? 0, // Gunakan nullish coalescing
        authorId: postData.authorId,
        categoryId: postData.categoryId,
      },
    });
    
    // If tags were provided, validate and create the relationships
    if (tags && Array.isArray(tags) && tags.length > 0) {
      try {
        // Create tag relationships in a single transaction
        const tagConnections = tags.map((tagId: string) => ({
          postId: post.id,
          tagId: tagId,
        }));
        
        await prisma.blogPostTag.createMany({
          data: tagConnections,
        });
      } catch (tagError) {
        console.error('Error creating tag relationships:', tagError);
        // Continue with the post creation even if tag relationships fail
      }
    }
    
    // Fetch the complete post with relationships
    const completePost = await prisma.blogPost.findUnique({
      where: { id: post.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(
      { success: true, data: completePost },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating blog post:', error);
    
    // Type guard to check if the error has a message property
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create blog post',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}