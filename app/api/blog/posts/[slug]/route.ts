// app/api/blog/posts/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withCors, corsPreflight } from '@/lib/withCors';
import { Prisma } from '@prisma/client';
import { formatBlogPost } from '@/lib/blog';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsPreflight();
}

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

    // Use the formatBlogPost helper function
    const formattedPost = formatBlogPost(post);

    // Optionally get next and previous posts
    const nextPost = await prisma.blogPost.findFirst({
      where: {
        createdAt: { gt: post.createdAt },
        published: true
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        thumbnail: true
      }
    });

    const prevPost = await prisma.blogPost.findFirst({
      where: {
        createdAt: { lt: post.createdAt },
        published: true
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        thumbnail: true
      }
    });

    // Get related posts (posts with similar tags)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        AND: [
          { slug: { not: post.slug } },
          { published: true },
          {
            tags: {
              some: {
                tagId: {
                  in: post.tags.map(pt => pt.tagId)
                }
              }
            }
          }
        ]
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    const formattedRelatedPosts = relatedPosts.map(rPost => ({
      id: rPost.id,
      slug: rPost.slug,
      title: rPost.title,
      thumbnail: rPost.thumbnail || '',
      category: rPost.category.name,
      date: rPost.createdAt.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }));

    // Add navigation and related posts to response
    const responseData = {
      ...formattedPost,
      nextPost,
      prevPost,
      relatedPosts: formattedRelatedPosts
    };

    return withCors({success: true, data: responseData})
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PATCH update blog post by slug
export async function PATCH(request: NextRequest) {
  try {
    const slug = getSlugFromRequest(request);
    if (!slug) throw new Error('Invalid slug');

    const body = await request.json();
    const { 
      title, 
      content, 
      excerpt, 
      thumbnail, 
      published, 
      isFeature, 
      hasImage, 
      categoryId,
      tags 
    } = body;

    // Create a proper Prisma update object with only the fields that were provided
    const updateData: Prisma.BlogPostUpdateInput = {};
    
    // Only add properties that were provided in the request
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (published !== undefined) updateData.published = published;
    if (isFeature !== undefined) updateData.isFeature = isFeature;
    if (hasImage !== undefined) updateData.hasImage = hasImage;
    if (categoryId !== undefined) updateData.category = { connect: { id: categoryId } };

    // Update the blog post
    const post = await prisma.blogPost.update({ 
      where: { slug }, 
      data: updateData
    });

    // If tags were provided, update the relationships
    if (tags !== undefined) {
      // Delete existing relationships
      await prisma.blogPostTag.deleteMany({
        where: { postId: post.id }
      });

      // Create new relationships if tags array is not empty
      if (tags && tags.length > 0) {
        const tagConnections = tags.map((tagId: string) => ({
          postId: post.id,
          tagId: tagId,
        }));
        
        await prisma.blogPostTag.createMany({
          data: tagConnections,
        });
      }
    }

    // Get updated post with relationships
    const updatedPost = await prisma.blogPost.findUnique({
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

    if (!updatedPost) {
      throw new Error('Failed to retrieve updated post');
    }

    // Format the post for response
    const formattedUpdatedPost = formatBlogPost(updatedPost);

    return NextResponse.json({ success: true, data: formattedUpdatedPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE blog post by slug
export async function DELETE(request: NextRequest) {
  try {
    const slug = getSlugFromRequest(request);
    if (!slug) throw new Error('Invalid slug');

    // Get the post first to ensure it exists
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    // The related BlogPostTag records will be automatically deleted due to Cascade
    await prisma.blogPost.delete({ where: { slug } });

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
  }
}