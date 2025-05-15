// app/api/blog/posts/slug/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to get slug from URL
const getSlugFromRequest = (request: NextRequest): string | null => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments.pop() || null;
};

// GET blog post by slug
export async function GET(request: NextRequest) {
  try {
    const slug = getSlugFromRequest(request);
    if (!slug) throw new Error('Invalid slug');

    const post = await prisma.blogPost.findUnique({ 
      where: { slug },
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

    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    // Transform to match expected format
    const formattedPost = {
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

    return NextResponse.json({ success: true, data: formattedPost });
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}