// app/api/blog/categories/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to get ID from URL
const getIdFromRequest = (request: NextRequest): string | null => {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments.pop() || null;
};

// GET category by id
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    const { searchParams } = new URL(request.url);
    const withPosts = searchParams.get('withPosts') === 'true';

    if (withPosts) {
      // Fetch category with associated posts
      const category = await prisma.blogCategory.findUnique({
        where: { id },
        include: {
          posts: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                }
              },
              tags: {
                include: {
                  tag: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      if (!category) {
        return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
      }

      // Format the posts data
      const formattedCategory = {
        ...category,
        posts: category.posts.map(post => ({
          id: post.id,
          slug: post.slug,
          thumbnail: post.thumbnail || '',
          title: post.title,
          excerpt: post.excerpt || '',
          hasImage: post.hasImage,
          isFeature: post.isFeature,
          published: post.published,
          comments: post.comments,
          date: post.createdAt.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long', 
            year: 'numeric'
          }),
          author: post.author,
          tags: post.tags.map(pt => ({
            id: pt.tag.id,
            name: pt.tag.name
          })),
          createdAt: post.createdAt,
          updatedAt: post.updatedAt
        }))
      };

      return NextResponse.json({ success: true, data: formattedCategory });
    } else {
      // Fetch just the category without posts
      const category = await prisma.blogCategory.findUnique({
        where: { id }
      });

      if (!category) {
        return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: category });
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PATCH update category
export async function PATCH(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    const body = await request.json();
    
    // Check if another category with the same name exists
    if (body.name) {
      const existingCategory = await prisma.blogCategory.findFirst({
        where: {
          name: body.name,
          id: {
            not: id
          }
        }
      });
      
      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'Another category with this name already exists' },
          { status: 400 }
        );
      }
    }
    
    const category = await prisma.blogCategory.update({ 
      where: { id }, 
      data: body 
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) throw new Error('Invalid ID');

    // Check if there are posts using this category
    const postCount = await prisma.blogPost.count({
      where: { categoryId: id }
    });

    if (postCount > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete category. It is used by ${postCount} blog posts.` 
      }, { status: 400 });
    }

    await prisma.blogCategory.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}