// app/api/blog/posts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to get ID from URL
const getIdFromRequest = (request: NextRequest): string | null => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments.pop() || null;
};

// GET blog post by id
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    const post = await prisma.blogPost.findUnique({ 
      where: { id },
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
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PATCH update blog post
export async function PATCH(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    const body = await request.json();
    const { tags } = body;

    // // Update the blog post
    // const post = await prisma.blogPost.update({ 
    //   where: { id }, 
    //   data: postData 
    // });

    // If tags were provided, update the relationships
    if (tags !== undefined) {
      // Delete existing relationships
      await prisma.blogPostTag.deleteMany({
        where: { postId: id }
      });

      // Create new relationships if tags array is not empty
      if (tags && tags.length > 0) {
        const tagConnections = tags.map((tagId: string) => ({
          postId: id,
          tagId: tagId,
        }));
        
        await prisma.blogPostTag.createMany({
          data: tagConnections,
        });
      }
    }

    // Get updated post with relationships
    const updatedPost = await prisma.blogPost.findUnique({
      where: { id },
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

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE blog post
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    // The related BlogPostTag records will be automatically deleted due to Cascade
    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
  }
}