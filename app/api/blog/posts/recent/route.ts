// app/api/blog/posts/recent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withCors } from '@/lib/withCors';

// GET recent blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 5;
    const published = searchParams.get('published') !== 'false'; // Default to true
    
    const posts = await prisma.blogPost.findMany({
      where: {
        published: published
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
    });
    
    // Transform the response to a cleaner format
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      thumbnail: post.thumbnail,
      excerpt: post.excerpt,
      hasImage: post.hasImage,
      isFeature: post.isFeature,
      published: post.published,
      comments: post.comments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      date: post.createdAt.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      author: post.author,
      category: post.category,
      tags: post.tags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug
      }))
    }));

    return withCors({
      success: true, 
      data: formattedPosts,
      meta: {
        total: formattedPosts.length,
        limit: limit,
        publishedOnly: published
      }
    });
    
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent blog posts' },
      { status: 500 }
    );
  }
}