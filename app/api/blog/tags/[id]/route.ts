// app/api/blog/tags/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to get ID from URL
const getIdFromRequest = (request: NextRequest): string | null => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments.pop() || null;
};

// GET tag by id
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    const { searchParams } = new URL(request.url);
    const withPosts = searchParams.get('withPosts') === 'true';

    if (withPosts) {
      // Fetch tag with associated posts through the junction table
      const tag = await prisma.blogTag.findUnique({
        where: { id },
        include: {
          posts: {
            include: {
              post: {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                    }
                  },
                  category: true
                }
              }
            }
          }
        }
      });

      if (!tag) {
        return NextResponse.json({ success: false, error: 'Tag not found' }, { status: 404 });
      }

      // Format the posts data
      const formattedTag = {
        ...tag,
        posts: tag.posts.map(pt => ({
          id: pt.post.id,
          slug: pt.post.slug,
          thumbnail: pt.post.thumbnail || '',
          title: pt.post.title,
          excerpt: pt.post.excerpt || '',
          hasImage: pt.post.hasImage,
          isFeature: pt.post.isFeature,
          published: pt.post.published,
          comments: pt.post.comments,
          category: pt.post.category.name,
          categoryId: pt.post.categoryId,
          date: pt.post.createdAt.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long', 
            year: 'numeric'
          }),
          author: pt.post.author,
          createdAt: pt.post.createdAt,
          updatedAt: pt.post.updatedAt
        }))
      };

      return NextResponse.json({ success: true, data: formattedTag });
    } else {
      // Fetch just the tag without posts
      const tag = await prisma.blogTag.findUnique({
        where: { id }
      });

      if (!tag) {
        return NextResponse.json({ success: false, error: 'Tag not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: tag });
    }
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tag' }, { status: 500 });
  }
}

// PATCH update tag
export async function PATCH(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    const body = await request.json();
    
    // Check if another tag with the same name exists
    if (body.name) {
      const existingTag = await prisma.blogTag.findFirst({
        where: {
          name: body.name,
          id: {
            not: id
          }
        }
      });
      
      if (existingTag) {
        return NextResponse.json(
          { success: false, error: 'Another tag with this name already exists' },
          { status: 400 }
        );
      }
    }
    
    const tag = await prisma.blogTag.update({ 
      where: { id }, 
      data: body 
    });

    return NextResponse.json({ success: true, data: tag });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ success: false, error: 'Failed to update tag' }, { status: 500 });
  }
}

// DELETE tag
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    // Check if there are posts using this tag
    const postCount = await prisma.blogPostTag.count({
      where: { tagId: id }
    });

    if (postCount > 0) {
      // Option 1: Prevent deletion if tag is in use
      // return NextResponse.json({ 
      //   success: false, 
      //   error: `Cannot delete tag. It is used by ${postCount} blog posts.` 
      // }, { status: 400 });
      
      // Option 2: Delete the tag references first (chosen approach)
      await prisma.blogPostTag.deleteMany({
        where: { tagId: id }
      });
    }

    await prisma.blogTag.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete tag' }, { status: 500 });
  }
}