// app/api/blog/categories/route.ts

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withCors, corsPreflight } from '@/lib/withCors';
import { FormattedBlogCategory } from '@/lib/blog';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsPreflight();
}

// GET all blog categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withPostCount = searchParams.get('withPostCount') === 'true';

    if (withPostCount) {
      // Fetch categories with post count
      const categories = await prisma.blogCategory.findMany({
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      // Transform the response to include post count
      const formattedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        postCount: category._count.posts,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }));

      return withCors({
        success: true,
        data: formattedCategories
      });
    } else {
      // Fetch categories without post count
      const categories = await prisma.blogCategory.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      return withCors({
        success: true,
        data: categories
      });
    }
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return withCors(
      { success: false, error: 'Failed to fetch blog categories' },
      500
    );
  }
}

// POST new blog category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug) {
      return withCors(
        { success: false, error: 'Name and slug are required' },
        400
      );
    }

    // Check if category with the same name already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { name: body.name }
    });

    if (existingCategory) {
      return withCors(
        { success: false, error: 'Category with this name already exists' },
        400
      );
    }

    // Check if category with the same slug already exists
    const existingSlug = await prisma.blogCategory.findUnique({
      where: { slug: body.slug }
    });

    if (existingSlug) {
      return withCors(
        { success: false, error: 'Category with this slug already exists' },
        400
      );
    }

    // Create the category
    const category = await prisma.blogCategory.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null
      }
    });

    return withCors(
      { success: true, data: category },
      201
    );
  } catch (error) {
    console.error('Error creating blog category:', error);
    return withCors(
      { success: false, error: 'Failed to create blog category' },
      500
    );
  }
}

// PUT update all blog categories (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.categories)) {
      return withCors(
        { success: false, error: 'Categories array is required' },
        400
      );
    }

    // Update categories in transaction
    const result = await prisma.$transaction(
      body.categories.map((category: FormattedBlogCategory) =>
        prisma.blogCategory.update({
          where: { id: category.id },
          data: {
            name: category.name,
            slug: category.slug,
            description: category.description || null
          }
        })
      )
    );

    return withCors(
      { success: true, data: result },
      200
    );
  } catch (error) {
    console.error('Error updating blog categories:', error);
    return withCors(
      { success: false, error: 'Failed to update blog categories' },
      500
    );
  }
}

// DELETE all blog categories (be careful with this!)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');

    if (confirm !== 'true') {
      return withCors(
        { success: false, error: 'Please confirm the deletion by adding ?confirm=true' },
        400
      );
    }

    // Check if any categories have posts
    const categoriesWithPosts = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      where: {
        posts: {
          some: {}
        }
      }
    });

    if (categoriesWithPosts.length > 0) {
      return withCors(
        {
          success: false,
          error: 'Cannot delete categories that have associated posts',
          categoriesWithPosts: categoriesWithPosts.map(cat => ({
            id: cat.id,
            name: cat.name,
            postCount: cat._count.posts
          }))
        },
        400
      );
    }

    // Delete all categories that don't have posts
    const result = await prisma.blogCategory.deleteMany({});

    return withCors(
      {
        success: true,
        message: `Successfully deleted ${result.count} categories`,
        deletedCount: result.count
      },
      200
    );
  } catch (error) {
    console.error('Error deleting blog categories:', error);
    return withCors(
      { success: false, error: 'Failed to delete blog categories' },
      500
    );
  }
}